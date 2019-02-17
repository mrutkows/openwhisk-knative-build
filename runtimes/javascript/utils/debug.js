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
var path = require('path');

//const FG_RED     = "\x1b[31m";
//const FG_GREEN   = "\x1b[32m";
const FG_YELLOW  = "\x1b[33m";
//const FG_BLUE    = "\x1b[34m";
const FG_MAGENTA = "\x1b[35m";
const FG_CYAN    = "\x1b[36m";
const FG_LTGRAY  = "\x1b[37m";
//const FG_WHITE   = "\x1b[97m";

//const RESET      = "\e[0m";
//const FG_INFO    = FG_CYAN;
//const FG_WARN    = FG_YELLOW;
//const FG_ERROR   = FG_RED;
//const FG_LOG     = FG_LTGRAY;

let config = {
  prefixFGColor: FG_CYAN,
  postfixFGColor: FG_MAGENTA,
  bodyFGColor: FG_LTGRAY,
  defaultFGColor: FG_LTGRAY,
  functionStartMarker: ">>> START: ",
  functionEndMarker: "<<< END: ",
};

/**
 * Formats Hours, Minutes, Seconds and Milliseconds as HH:MM:SS:mm
 */
function _getTimeFormatted(){
  let date = new Date();
  let ftime =
      date.getHours() + ":" +
      date.getMinutes() + ":" +
      date.getSeconds() + ":" +
      date.getMilliseconds();
  return ftime;
}

/**
 * Formats and colorizes the prefix of the message consisting of the:
 *   [moduleName] [functionName]()
 */
function _formatMessagePrefix(color){

  let prefixColor = config.prefixFGColor;

  // If color arg is defined, use it
  // TODO: validate color is an actual valid color string
  if( color !== undefined) {
    prefixColor = color;
  }

  let prefix = prefixColor + "[" + this.moduleName + "] ["+this.functionName+"] ";

  return prefix;

}

/**
 * Formats and colorizes the postfix of the message consisting of the:
 *   [(formattedTime)]
 */
function _formatMessagePostfix(color){

  let postfixColor = config.postfixFGColor;

  // If color arg is defined, use it
  // TODO: validate color is an actual valid color string
  if( color !== undefined) {
    postfixColor = color;
  }
  let postfix = postfixColor + " (" + _getTimeFormatted() + ")";
  return postfix;
}

/**
 * Formats and colorizes the body of the message.
 */
function _formatBody(msg, color){

  let bodyColor = config.bodyFGColor;

  // If color arg is defined, use it
  // TODO: validate color is an actual valid color string
  if(color !== undefined)
    bodyColor = color;

  return bodyColor + msg;
}

/**
 * Formats the entirety of the message comprised of the message prefix + body + postfix.
 */
function _formatMessage(msg, functionName){
  // Reset to default color at end of formatted message
  let message = _formatMessagePrefix(functionName) + _formatBody(msg) + _formatMessagePostfix() + config.defaultFGColor;
  return message;
}

function _updateCallingFunctionName(functionLabel){

  // if explicit label provided, use it...
  let fxName = functionLabel;

  if(typeof(fxName) == 'undefined'){

    let obj = {};

    try{
      Error.stackTraceLimit = 4;
      Error.captureStackTrace(obj, _updateCallingFunctionName);

      let fullStackInfo = obj.stack.split(")\n");
      let rawFunctionInfo = fullStackInfo[2];
      //
      let entryInfo = rawFunctionInfo.split("at ")[1];
      let fm = entryInfo.split(" (");
      this.functionName = fm[0];
      this.fullModuleInfo = fm[1].substring(fm[1].lastIndexOf("/") +1,fm[1].indexOf(":"));
      this.moduleName = this.fullModuleInfo.substring(
          this.fullModuleInfo.lastIndexOf("/",
          this.fullModuleInfo.indexOf(":")));
    } catch(e){
      console.error("Unable to get stack trace: " + e.message)
    }
  }
}

/*
 * Initialize the debug context including:
 *message = ReferenceError: message is not defined
    at eval (eval at _updateCallingFunctionName (/Users/Matt/knative/openwhisk-knative-build/runtimes/javascript/utils/debug.js:144:1), <anonymous>:1:1)
    at _updateCallingFunctionName (/Users/Matt/knative/openwhisk-knative-build/runtimes/javascript/utils/debug.js:144:1)
    at _updateContext (/Users/Matt/knative/openwhisk-knative-build/runtimes/javascript/utils/debug.js:153:3)
    at DEBUG.dumpObject (/Users/Matt/knative/openwhisk-knative-build/runtimes/javascript/utils/debug.js:219:5)
 * - Calling module
 * - Calling function (if anonymous, identify by signature)
 */
function _updateContext(callerModule, callerFunctionLabel){
  _updateCallingFunctionName(callerFunctionLabel);
}


module.exports = class DEBUG {

  constructor() {
  }

  /**
   * functionStart
   *
   * @param message optional message to display with function start marker
   */
  functionStart(message, functionName) {

    _updateContext(null, functionName);

    let msg = "";
    if(message !== undefined){
      msg = message;
    }

    let formattedMessage = _formatMessage( config.functionStartMarker + msg );
    console.info(formattedMessage);
  };

  /**
   * functionEnd
   *
   * @param message optional message to display with function end marker
   */
  functionEnd(message, functionName) {

    _updateContext(null, functionName);

    let msg = "";
    if(message !== undefined){
      msg = message;
    }

    let formattedMessage = _formatMessage( config.functionEndMarker + msg );
    console.info(formattedMessage);
  };

  /**
   * trace
   *
   * @param msg message to display to console as trace information
   */
  trace(msg, functionName) {

    _updateContext(null, functionName);

    let formattedMessage = _formatMessage(msg);
    console.info(formattedMessage);
  };

  /**
   * dumpObject
   *
   * @param obj object to dump to console
   * @param label optional string label to display with object dump
   */
  dumpObject(obj, label, functionName){

    _updateContext(null, functionName);

    let otype = typeof(obj)

    if( otype !== "undefined") {

      try{
        let jsonFormatted = JSON.stringify(obj,null,4);
        let formattedMessage = _formatMessage("[" + label + " (" + otype + ")] = "+ jsonFormatted);
        console.info(formattedMessage);
      } catch (e) {

        // try manually dumping a shallow (string-friendly) copy of the Object
        try {
          console.log("{");
          Object.keys(obj).forEach(
              function (key) {
                if(typeof obj[key] === 'string' && typeof(obj[key].toString()) !== "undefined"){
                  console.info("    \"" + key + "\": \"" + obj[key].toString() +"\"" );
                }
              }
          );
          console.log("}");

        } catch(e2) {
          console.error("[" + label + " (" + otype + ")] : " + e.message);
          let formattedMessage = _formatMessage(_ + "[" + label + " (" + otype + ")] : " +
              e.message);
          console.error(formattedMessage);
        }
      }

    } else {
      let formattedMessage = _formatMessage( FG_YELLOW + "[" + label + " (" + otype + ")] is undefined." + FG_LTGRAY);
      console.info(formattedMessage);
    }

  };

};
