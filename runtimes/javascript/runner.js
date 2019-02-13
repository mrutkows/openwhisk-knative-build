/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var DEBUG = require('./utils/debug')(module);

/**
 * Object which encapsulates a first-class function, the user code for
 * an action.
 *
 * This file (runner.js) must currently live in root directory for nodeJsAction.
 */
var util = require('util');
var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
const serializeError = require('serialize-error');

function NodeActionRunner() {
    DEBUG.functionStart();
    // Use this ref inside closures etc.
    var thisRunner = this;

    this.userScriptMain = undefined;

    // This structure is reset for every action invocation. It contains two fields:
    //   - completed; indicating whether the action has already signaled completion
    //   - next; a callback to be invoked with the result of the action.
    // Note that { error: ... } results are still results.
    var callback = {
        completed : undefined,
        next      : function (result) { return; }
    };

    DEBUG.dumpObject(callback,"callback");

    this.init = function(message) {
        DEBUG.functionStart("NodeActionRunner", "init");
        function assertMainIsFunction() {
            DEBUG.dumpObject(thisRunner.userScriptMain,"this.Runner.userScriptMain", "init");
            if (typeof thisRunner.userScriptMain !== 'function') {
                DEBUG.functionEnd("ERROR: Action entrypoint '\" + message.main + \"' is not a function.", "init");
                throw "Action entrypoint '" + message.main + "' is not a function.";
            }
            DEBUG.functionEnd();
        }

        // Loading the user code.
        DEBUG.dumpObject(message.binary, "message.binary", "init");
        if (message.binary) {
            // The code is a base64-encoded zip file.
            return unzipInTmpDir(message.code).then(function (moduleDir) {
                if(!fs.existsSync(path.join(moduleDir, 'package.json')) &&
                    !fs.existsSync(path.join(moduleDir, 'index.js'))) {
                    DEBUG.functionEnd("ERROR: Zipped actions must contain either package.json or index.js at the root.", "init");
                    return Promise.reject('Zipped actions must contain either package.json or index.js at the root.')
                }

                try {
                    // Set the executable directory to the project dir
                    process.chdir(moduleDir);
                    thisRunner.userScriptMain = eval('require("' + moduleDir + '").' + message.main);
                    assertMainIsFunction();
                    // The value 'true' has no special meaning here;
                    // the successful state is fully reflected in the
                    // successful resolution of the promise.
                    DEBUG.functionEnd("return true;", "init");
                    return true;
                } catch (e) {
                    DEBUG.functionEnd("ERROR: " + e.message, "init");
                    return Promise.reject(e);
                }
            }).catch(function (error) {
                DEBUG.functionEnd("ERROR: " + e.message, "init");
                return Promise.reject(error);
            });
        } else {
            // The code is a plain old JS file.
            try {
                thisRunner.userScriptMain = eval('(function(){' + message.code + '\nreturn ' + message.main + '})()');
                DEBUG.dumpObject(thisRunner.userScriptMain,"thisRunner.userScriptMain", "init");
                assertMainIsFunction();
                // See comment above about 'true'; it has no specific meaning.
                DEBUG.functionEnd("Promise.resolve(true)", "init");
                return Promise.resolve(true);
            } catch (e) {
                DEBUG.functionEnd("ERROR: " + e.message, "init");
                return Promise.reject(e);
            }
        }
    };

    // Returns a Promise with the result of the user code invocation.
    // The Promise is rejected iff the user code throws.
    this.run = function(args) {
        DEBUG.functionStart("NodeActionRunner", "run");
        return new Promise(
            function (resolve, reject) {
                callback.completed = undefined;
                callback.next = resolve;

                try {
                    DEBUG.dumpObject(args, "Calling: thisRunner.userScriptMain(args): args", "run");
                    var result = thisRunner.userScriptMain(args);
                    DEBUG.dumpObject(result,"Returned: thisRunner.userScriptMain(args): result", "run");
                } catch (e) {
                    DEBUG.functionEnd("ERROR: " + e.message, "run");
                    reject(e);
                }

                // Non-promises/undefined instantly resolve.
                Promise.resolve(result).then(function (resolvedResult) {
                    // This happens, e.g. if you just have "return;"
                    if (typeof resolvedResult === "undefined") {
                        resolvedResult = {};
                    }
                    DEBUG.functionEnd("resolvedResult: " + resolvedResult, "run");
                    resolve(resolvedResult);
                }).catch(function (error) {
                    // A rejected Promise from the user code maps into a
                    // successful promise wrapping a whisk-encoded error.

                    // Special case if the user just called `reject()`.
                    if (!error) {
                        DEBUG.functionEnd("ERROR: reject()", "run");
                        resolve({ error: {}});
                    } else {
                        DEBUG.functionEnd("ERROR: " + error.message, "run");
                        resolve({ error: serializeError(error) });
                    }
                });
            }
        );
    };

    // Helper function to copy a base64-encoded zip file to a temporary location,
    // decompress it into temporary directory, and return the name of that directory.
    // Note that this makes heavy use of shell commands because:
    //   1) Node 0.12 doesn't have many of the useful fs functions.
    //   2) We know in which environment we're running.
    function unzipInTmpDir(base64) {
        DEBUG.functionStart();
        var mkTempCmd = "mktemp -d XXXXXXXX";
        return exec(mkTempCmd).then(function (tmpDir1) {
            return new Promise(
                function (resolve, reject) {
                    var zipFile = path.join(tmpDir1, "action.zip");
                    fs.writeFile(zipFile, base64, "base64", function (err) {
                        if (err) {
                            DEBUG.functionEnd("ERROR: " + err.message);
                            reject("There was an error reading the action archive.");
                        }
                        DEBUG.functionEnd("RESOLVE zipFile=" + zipFile);
                        resolve(zipFile);
                    });
                }
            );
        }).then(function (zipFile) {
            return exec(mkTempCmd).then(function (tmpDir2) {
                return exec("unzip -qq " + zipFile + " -d " + tmpDir2).then(function (res) {
                    DEBUG.functionEnd("RESOLVE tmpDir2=" + tmpDir2);
                    return path.resolve(tmpDir2);
                }).catch(function (error) {
                    DEBUG.functionEnd("ERROR: " + error.message);
                    return Promise.reject("There was an error uncompressing the action archive.");
                });
            });
        });
    }

    // Helper function to run shell commands.
    function exec(cmd) {
        DEBUG.functionStart();
        return new Promise(
            function (resolve, reject) {
                child_process.exec(cmd, function (error, stdout, stderr) {
                    DEBUG.dumpObject(cmd,"cmd");
                    if (error) {
                        DEBUG.functionEnd("ERROR: " + error.message);
                        reject(stderr.trim());
                    } else {
                        DEBUG.functionEnd("RESOLVE");
                        resolve(stdout.trim());
                    }
                });
            }
        );
    }
}

module.exports = NodeActionRunner;
