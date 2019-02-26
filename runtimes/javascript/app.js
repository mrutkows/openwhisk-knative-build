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

var dbg = require('./utils/debug');
var DEBUG = new dbg();

DEBUG.trace("Hello World from NodeJS runtime");
DEBUG.dumpObject(process.env, "process.env");

var config = {
        'port': 8080,
        'apiHost': process.env.__OW_API_HOST,
        'allowConcurrent': process.env.__OW_ALLOW_CONCURRENT
};

var runtime_platform = {
    openwhisk: 'openwhisk',
    knative: 'knative',
};

var bodyParser = require('body-parser');
var express    = require('express');

/**
 * instantiate app as an instance of Express
 * i.e. app starts the server
 */
var app = express();

/**
 * instantiate an object which handles REST calls from the Invoker
 */
var service = require('./src/service').getService(config);

app.set('port', config.port);

// TODO: test if we can/should use config via NodeJS Express "set" vs. passed on getService() method.
app.set('test', config);

/**
 * setup a middleware layer to restrict the request body size
 * this middleware is called every time a request is sent to the server
 */
app.use(bodyParser.json({ limit: "48mb" }));

// identify the target Serverless platform
var targetPlatform = process.env.__OW_RUNTIME_PLATFORM;

// default to "openwhisk" platform initialization if not defined
if( typeof targetPlatform === "undefined") {
    console.error("__OW_RUNTIME_PLATFORM is undefined; defaulting to 'openwhisk' ...");
    targetPlatform = runtime_platform.openwhisk;
}

// Register different endpoint handlers depending on target PLATFORM and its expected behavior.
// In addition, register request pre-processors and/or response post-processors as needed.
if (targetPlatform === runtime_platform.openwhisk ) {

    app.post('/init', wrapEndpoint(service.initCode));
    app.post('/run', wrapEndpoint(service.runCode));

    // TODO: this appears to be registered incorrectly "use" only takes 3 parameters (req, res, next)
    // BAD: app.use(function (err, req, res, next) {
    app.use(function (req, res, next) {
        res.status(500).json({error: "Bad request."});
    });

} else if (targetPlatform === runtime_platform.knative) {

    var platformFactory = require('./platform/platform.js');
    var platform = new platformFactory("knative", service, config);
    app.post('/', platform.run);

} else {
    console.error("Environment variable '__OW_RUNTIME_PLATFORM' has an unrecognized value ("+targetPlatform+").");
}

service.start(app);

/**
 * Wraps an endpoint written to return a Promise into an express endpoint,
 * producing the appropriate HTTP response and closing it for all controllable
 * failure modes.
 *
 * The expected signature for the promise value (both completed and failed)
 * is { code: int, response: object }.
 *
 * @param ep a request=>promise function
 * @returns an express endpoint handler
 */
function wrapEndpoint(ep) {
    DEBUG.functionStart(ep.name);
    return function (req, res) {
        try {
            ep(req).then(function (result) {
                res.status(result.code).json(result.response);
            }).catch(function (error) {
                if (typeof error.code === "number" && typeof error.response !== "undefined") {
                    res.status(error.code).json(error.response);
                } else {
                    console.error("[wrapEndpoint]", "invalid errored promise", JSON.stringify(error));
                    DEBUG.functionEnd("invalid errored promise", JSON.stringify(error));
                    res.status(500).json({ error: "Internal error." });
                }
            });
        } catch (e) {
            // This should not happen, as the contract for the endpoints is to
            // never (externally) throw, and wrap failures in the promise instead,
            // but, as they say, better safe than sorry.
            console.error("[wrapEndpoint]", "exception caught", e.message);
            DEBUG.functionEnd("ERROR", e.message);
            res.status(500).json({ error: "Internal error (exception)." });
        }
        DEBUG.functionEnd("", "wrapEndpoint");
    }
}
