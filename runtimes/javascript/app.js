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

var DEBUG = require('./utils/debug')();
DEBUG.startModule("Hello World from NodeJS runtime");
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

/**
 * setup a middleware layer to restrict the request body size
 * this middlware is called every time a request is sent to the server
 */
app.use(bodyParser.json({ limit: "48mb" }));

if (process.env.__OW_RUNTIME_PLATFORM === runtime_platform.openwhisk) {

    app.post('/init', wrapEndpoint(service.initCode));

    app.post('/run', wrapEndpoint(service.runCode));

    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).json({error: "Bad request."});
    });

} else if (process.env.__OW_RUNTIME_PLATFORM === runtime_platform.knative) {
    app.post('/', function (req, res) {
        try {
            var main = process.env.__OW_ACTION_MAIN;
            var code = process.env.__OW_ACTION_CODE;
            var binary = JSON.parse(process.env.__OW_ACTION_BINARY);
            var name = process.env.__OW_ACTION_NAME;

            if (req.query.value) {
                if (req.query.value.main && typeof req.query.value.main === 'string') {
                    main = req.query.value.main
                }
                if (req.query.value.code && typeof req.query.value.code === 'string') {
                    code = req.query.value.code
                }
                if (req.query.value.binary && typeof req.query.value.binary === "boolean") {
                    main = req.query.value.binary
                }
                if (req.query.value.name && typeof req.query.value.name === "string") {
                    name = req.query.value.name
                }
            }

            req.body.value = {
                main: main,
                code: code,
                binary: binary,
                name: name
            };

            service.initCode(req).then(function () {
                service.runCode(req).then(function (result) {
                    res.status(result.code).json(result.response)
                });
            }).catch(function (error) {
                console.error(error)
                if (typeof error.code === 'number' && typeof error.response !== undefined) {
                    if (error.code === 403) {
                        service.runCode(req).then(function (result) {
                            res.status(result.code).json(result.response)
                        });
                    } else {
                        res.status(error.code).json(error.response)
                    }
                }
            });
        } catch (e) {
            res.status(500).json({error: "internal error"})
        }
    });
} else {
    console.error("__OW_RUNTIME_PLATFORM is undefined!");
}

service.start(app);

/**
 * Wraps an endpoint written to return a Promise into an express endpoint,
 * producing the appropriate HTTP response and closing it for all controlable
 * failure modes.
 *
 * The expected signature for the promise value (both completed and failed)
 * is { code: int, response: object }.
 *
 * @param ep a request=>promise function
 * @returns an express endpoint handler
 */
function wrapEndpoint(ep) {
    DEBUG.startFunction(ep.name);
    return function (req, res) {
        try {
            ep(req).then(function (result) {
                res.status(result.code).json(result.response);
            }).catch(function (error) {
                if (typeof error.code === "number" && typeof error.response !== "undefined") {
                    res.status(error.code).json(error.response);
                } else {
                    console.error("[wrapEndpoint]", "invalid errored promise", JSON.stringify(error));
                    res.status(500).json({ error: "Internal error." });
                }
            });
        } catch (e) {
            // This should not happen, as the contract for the endpoints is to
            // never (externally) throw, and wrap failures in the promise instead,
            // but, as they say, better safe than sorry.
            console.error("[wrapEndpoint]", "exception caught", e.message);
            res.status(500).json({ error: "Internal error (exception)." });
        }
    }
}
