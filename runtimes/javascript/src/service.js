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

var dbg = require('../utils/debug');
var DEBUG = new dbg();

var NodeActionRunner = require('../runner');

function NodeActionService(config) {

    var Status = {
        ready: 'ready',
        starting: 'starting',
        running: 'running',
        stopped: 'stopped'
    };

    var status = Status.ready;
    var ignoreRunStatus = config.allowConcurrent === undefined ? false : config.allowConcurrent.toLowerCase() === "true";
    var server = undefined;
    var userCodeRunner = undefined;
    DEBUG.trace("INIT: status=" + status);
    DEBUG.trace("INIT: ignoreRunStatus=" + ignoreRunStatus);

    function setStatus(newStatus) {
        DEBUG.functionStart();
        if (status !== Status.stopped) {
            DEBUG.trace("oldStatus=" + status + "; newStatus=" + newStatus);
            status = newStatus;
        }
        DEBUG.functionEnd();
    }

    /**
     * An ad-hoc format for the endpoints returning a Promise representing,
     * eventually, an HTTP response.
     *
     * The promised values (whether successful or not) have the form:
     * { code: int, response: object }
     *
     */
    function responseMessage (code, response) {
        return { code: code, response: response };
    }

    function errorMessage (code, errorMsg) {
        return responseMessage(code, { error: errorMsg });
    }

    /**
     * Starts the server.
     *
     * @param app express app
     */
    this.start = function start(app) {
        DEBUG.functionStart();
        server = app.listen(app.get('port'), function() {
            var host = server.address().address;
            var port = server.address().port;
            DEBUG.trace("host: " + host + "; port: " + port);
        });
        //This is required as http server will auto disconnect in 2 minutes, this to not auto disconnect at all
        server.timeout = 0;
        DEBUG.dumpObject(server, "server");
        DEBUG.functionEnd();
    };

    /** Returns a promise of a response to the /init invocation.
     *
     *  req.body = { main: String, code: String, binary: Boolean }
     */
    this.initCode = function initCode(req) {
        DEBUG.functionStart("status=" + status, "initCode");

        if (status === Status.ready && userCodeRunner === undefined) {
            
            setStatus(Status.starting);

            var body = req.body || {};
            var message = body.value || {};

            DEBUG.dumpObject(body,"body", "initCode");
            DEBUG.dumpObject(message,"message", "initCode");

            if (message.main && message.code && typeof message.main === 'string' && typeof message.code === 'string') {
                return doInit(message).then(function (result) {
                    setStatus(Status.ready);
                    DEBUG.functionEnd("[200] { OK: true }", "initCode");
                    return responseMessage(200, { OK: true });
                }).catch(function (error) {
                    var errStr = error.stack ? String(error.stack) : error;
                    setStatus(Status.stopped);
                    DEBUG.functionEnd("[502] Initialization has failed due to: " + errStr,"initCode");
                    return Promise.reject(errorMessage(502, "Initialization has failed due to: " + errStr));
                });
            } else {
                setStatus(Status.ready);
                DEBUG.functionEnd("[403] Missing main/no code to execute.","initCode");
                return Promise.reject(errorMessage(403, "Missing main/no code to execute."));
            }
        } else if (userCodeRunner !== undefined) {
            var msg = "Cannot initialize the action more than once.";
            console.error("Internal system error:", msg);
            DEBUG.functionEnd("[403] " + msg, "initCode");
            return Promise.reject(errorMessage(403, msg));
        } else {
            var msg = "System not ready, status is " + status + ".";
            console.error("Internal system error:", msg);
            DEBUG.functionEnd("[403] " + msg,"initCode");
            return Promise.reject(errorMessage(403, msg));
        }
    };

    /**
     * Returns a promise of a response to the /exec invocation.
     * Note that the promise is failed if and only if there was an unhandled error
     * (the user code threw an exception, or our proxy had an internal error).
     * Actions returning { error: ... } are modeled as a Promise successful resolution.
     *
     * req.body = { value: Object, meta { activationId : int } }
     */
    this.runCode = function runCode(req) {
        DEBUG.functionStart("status=" + status, "runCode");

        if (status === Status.ready) {
            if (!ignoreRunStatus) {
                setStatus(Status.running);
            }

            DEBUG.dumpObject(req, "request", "runCode");

            return doRun(req).then(function (result) {
                if (!ignoreRunStatus) {
                    setStatus(Status.ready);
                }
                DEBUG.dumpObject(result, "result", "runCode");
                if (typeof result !== "object") {
                    DEBUG.functionEnd("[502] The action did not return a dictionary.","runCode");
                    return errorMessage(502, "The action did not return a dictionary.");
                } else {
                    DEBUG.functionEnd("[200] result: " + result, "runCode");
                    return responseMessage(200, result);
                }
            }).catch(function (error) {
                setStatus(Status.stopped);
                DEBUG.functionEnd("[502]: An error has occurred: " + error, "runCode");
                return Promise.reject(errorMessage(502, "An error has occurred: " + error));
            });
        } else {
            var msg = "System not ready, status is " + status + ".";
            console.error("Internal system error:", msg);
            DEBUG.functionEnd("[403] " + msg, "runCode");
            return Promise.reject(errorMessage(403, msg));
        }
    };

    function doInit(message) {
        userCodeRunner = new NodeActionRunner();

        DEBUG.functionStart();
        DEBUG.dumpObject(message,"message")
        return userCodeRunner.init(message).then(function (result) {
            // 'true' has no particular meaning here. The fact that the promise
            // is resolved successfully in itself carries the intended message
            // that initialization succeeded.
            DEBUG.functionEnd("return true;", "doInit");
            return true;
        }).catch(function (error) {
            // emit error to activation log then flush the logs as this
            // is the end of the activation
            console.error('Error during initialization:', error);
            writeMarkers();
            DEBUG.functionEnd("Error: " + error, "doInit");
            return Promise.reject(error);
        });
    }

    function doRun(req) {
        DEBUG.functionStart();
        DEBUG.dumpObject(req,"request");
        var msg = req && req.body || {};
        DEBUG.dumpObject(msg,"msg");
        DEBUG.trace(msg,"Setting process environment variables.", "doRun");
        Object.keys(msg).forEach(
            function (k) {
                if(typeof msg[k] === 'string' && k !== 'value'){
                    process.env['Adding: __OW_' + k.toUpperCase()] = msg[k];
                    var envVariable = '__OW_' + k.toUpperCase();
                    DEBUG.dumpObject(envVariable,"envVariable", "doRun");
                }
            }
        );

        return userCodeRunner.run(msg.value).then(function(result) {
            if (typeof result !== "object") {
                console.error('Result must be of type object but has type "' + typeof result + '":', result);
            }
            writeMarkers();
            DEBUG.functionEnd("Result" + result, "doRun");
            return result;
        }).catch(function (error) {
            console.error(error);
            writeMarkers();
            DEBUG.functionEnd("Error:" + error, "doRun")
            return Promise.reject(error);
        });
    }

    function writeMarkers() {
        console.log('XXX_THE_END_OF_A_WHISK_ACTIVATION_XXX');
        console.error('XXX_THE_END_OF_A_WHISK_ACTIVATION_XXX');
    }
}

NodeActionService.getService = function(config) {
    return new NodeActionService(config);
};

module.exports = NodeActionService;
