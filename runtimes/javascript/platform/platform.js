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

function preProcessRequest(req){
    DEBUG.functionStart();

    try{
        // If the function's INIT data is already placed in the process
        // See if the request has passed in valid "init" data
        let body = req.body || {};
        let valuedata = body.value || {};
        let initdata = body.init || {};
        let env = process.env || {};

        // Set defaults to use INIT data not provided on the request
        // Look first to the process (i.e., Container's) environment variables.
        var main = (typeof env.__OW_ACTION_MAIN === 'undefined') ? "main" : env.__OW_ACTION_MAIN;
        // TODO: Throw error if CODE is NOT defined!
        var code = (typeof env.__OW_ACTION_CODE === 'undefined') ? "" : env.__OW_ACTION_CODE;
        var binary = (typeof env.__OW_ACTION_BINARY === 'undefined') ? false : env.__OW_ACTION_BINARY.toLowerCase() === "true";

        // Look for init data within the request (i.e., "stem cell" runtime, where code is injected by request)
        if (initdata) {
            if (initdata.main && typeof initdata.main === 'string') {
                main = initdata.main
            }
            if (initdata.code && typeof initdata.code === 'string') {
                code = initdata.code
            }
            if (initdata.binary && typeof initdata.binary === 'boolean') {
                // TODO: Throw error if BINARY is not 'true' or 'false'
                binary = initdata.binary
            }
        }

        // Move the init data to the request body under the "value" key.
        // This will allow us to reuse the "openwhisk" /init route handler function
        valuedata.main = main;
        valuedata.code = code;
        valuedata.binary = binary;

    } catch(e){
        console.error(e);
        DEBUG.functionEnd("ERROR: " + e.message);
        // TODO: test this error is handled properly and results in an HTTP error response
        throw("Unable to initialize the runtime: " + e.message);
    }

    DEBUG.functionEnd();
}

function PlatformFactory(id, svc, cfg) {

    DEBUG.dumpObject(id, "Platform" );
    DEBUG.dumpObject(svc, "Service" );
    DEBUG.dumpObject(cfg, "Config" );

    var platform = id;
    var service = svc;
    var config = cfg;
    var isInitialized = false;

    this.run = function(req, res) {

        try {

            preProcessRequest(req);
            console.info("isInitialized="+isInitialized);

            service.initCode(req).then(function () {
                service.runCode(req).then(function (result) {
                    res.status(result.code).json(result.response)
                });
            }).catch(function (error) {
                console.error(error);

                if (typeof error.code === "number" && typeof error.response !== "undefined") {
                    res.status(error.code).json(error.response);
                } else {
                    console.error("[wrapEndpoint]", "invalid errored promise", JSON.stringify(error));
                    res.status(500).json({ error: "Internal error." });
                }
            });
        } catch (e) {
            res.status(500).json({error: "internal error"})
        }
    }

};

module.exports = PlatformFactory;
