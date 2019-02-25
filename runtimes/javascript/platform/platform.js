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

var service = require('../src/service').getService(config);

function preProcessRequest(req){

    // If the function's INIT data is already placed in the process
    // See if the request has passed in valid "init" data
    // If so, then use it over any provided in the process (Container's) env. vars.
    let body = req.body || {};
    let message = body.value || {};
    let env = process.env || {};

    try{

        // Set defaults to use INIT data not provided on the request
        // Look first to the process (i.e., Container's) environment variables.
        var main = (typeof env.__OW_ACTION_MAIN === 'undefined') ? "main" : env.__OW_ACTION_MAIN;
        // TODO: Throw error if CODE is NOT defined!
        var code = (typeof env.__OW_ACTION_CODE === 'undefined') ? "" : env.__OW_ACTION_CODE;
        var binary = (typeof env.__OW_ACTION_BINARY === 'undefined') ? "false" : env.__OW_ACTION_BINARY;

        if (message) {
            if (message.main && typeof message.main === 'string') {
                main = req.body.value.main
            }
            if (message.code && typeof message.code === 'string') {
                code = req.body.value.code
            }
            if (message.binary && typeof req.body.value.binary === 'boolean') {
                // TODO: Throw error if BINARY is not 'true' or 'false'
                binary = req.body.value.binary
            }
        }

        message.main = main;
        message.code = code;
        message.binary = binary;

    } catch(e){
        console.log(e);
        // TODO
        throw("Unable to initialize the runtime: " + e.message);
    }
}

module.exports = class Platform {

    constructor( platform) {
        console.info("Platform: " + platform );

    }

    getRunHandler(){

        return(function (req, res) {
            try {

                preProcessRequest(req);

                service.initCode(req).then(function () {
                    service.runCode(req).then(function (result) {
                        res.status(result.code).json(result.response)
                    });
                }).catch(function (error) {
                    console.error(error);
                    if (typeof error.code === 'number' && typeof error.response !== "undefined") {
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
        })
    }

};
