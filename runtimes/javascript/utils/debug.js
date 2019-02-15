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

const FG_RED     = "\x1b[31m";
const FG_GREEN   = "\x1b[32m";
const FG_YELLOW  = "\x1b[33m";
const FG_BLUE    = "\x1b[34m";
const FG_MAGENTA = "\x1b[35m";
const FG_CYAN    = "\x1b[36m";
const FG_LTGRAY  = "\x1b[37m";
const FG_ORANGE  = "\x1b[37m";
const FG_WHITE   = "\x1b[97m";

const RESET      = "\e[0m";
const FG_INFO    = FG_CYAN;
const FG_WARN    = FG_YELLOW;
const FG_ERROR   = FG_RED;
const FG_LOG     = FG_LTGRAY;

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
function _formatMessagePrefix(functionName, color){

  let prefixColor = config.prefixFGColor;

  // If color arg is defined, use it
  // TODO: validate color is an actual valid color string
  if( color !== undefined) {
    prefixColor = color;
  }

  let prefix = prefixColor + "[" + this.moduleName + "] ";

  if(functionName !== undefined) {
    prefix += functionName + "(): ";
  }
  else {
    let tmpFxName = "anonymous";
    prefix += tmpFxName + "(): ";
  }
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

function _updateCallingModuleName(callerModule){

  if( callerModule &&
      typeof(callerModule) !== 'undefined' &&
      typeof(callerModule) === 'object' &&
      typeof(callerModule.filename) !== 'undefined') {

    // EXPLICIT approach (Module object provided)
    this.moduleName = path.basename(callerModule.filename, '.js');

  } else {
    // IMPLICIT approach (derive from callee frame)
    this.moduleName = path.basename(module.parent.filename, '.js');
  }

  // NOTE: After we read the module.filename, we MUST force the module loader to remove the
  // module object from its cache to force it to update "module.parent" on next "require".
  //delete require.cache[__filename];

}

function _updateCallingFunctionName(callee, functionLabel){

  // if explicit label provided, use it...
  let fxName = functionLabel;

  if(typeof(fxName) == 'undefined'){

    if( typeof(callee) !== 'undefined' &&
        typeof(callee.caller) !== 'undefined' ) {
      fxName = callee.caller.name;
    } else {
      fxName = 'unknown';
    }
  }

  this.functionName = fxName;
}

/*
 * Initialize the debug context including:
 *
 * - Calling module
 * - Calling module function (if anonymous, identify by signature)
 */
function _updateContext(callee, callerModule, callerFunctionLabel){

  // Update: functionName
  _updateCallingFunctionName(callee,callerFunctionLabel);
  _updateCallingModuleName(callerModule);
}

module.exports = function(requiringModule) {

  _updateContext(arguments.callee, requiringModule);

  /**
   * moduleStart
   *
   * @param msg optional message to display with module start information
   */
  this.moduleStart = function(msg) {

    _updateContext(arguments.callee);

    let formattedMessage = _formatMessage(msg);
    console.info(formattedMessage);
  };

  /**
   * functionStart
   *
   * @param message optional message to display with function start marker
   */
  this.functionStart = function(message, functionName) {

    _updateContext(arguments.callee, null, functionName);

    let msg = "";
    if(message !== undefined){
      msg = message;
    }

    let formattedMessage = _formatMessage( config.functionStartMarker + msg, this.functionName );
    console.info(formattedMessage);
  };

  /**
   * functionEnd
   *
   * @param message optional message to display with function end marker
   */
  this.functionEnd = function(message, functionName) {

    _updateContext(arguments.callee, null, functionName);

    let msg = "";
    if(message !== undefined){
      msg = message;
    }

    let formattedMessage = _formatMessage( config.functionEndMarker + msg, this.functionName  );
    console.info(formattedMessage);
  };

  /**
   * functionEndError
   *
   * @param optionalMessage optional message to display with function end marker
   */
  // this.functionEndError = function(optionalMessage, error, functionName) {
  // };

  /**
   * trace
   *
   * @param msg message to display to console as trace information
   */
  this.trace = function(msg, functionName) {

    _updateContext(arguments.callee, null, functionName);

    let formattedMessage = _formatMessage(msg, this.functionName);
    console.info(formattedMessage);
  };

  /**
   * dumpObject
   *
   * @param obj object to dump to console
   * @param label optional string label to display with object dump
   */
  this.dumpObject = function(obj, label, functionName){

    _updateContext(arguments.callee, null, functionName);

    let otype = typeof(obj)

    if( otype !== "undefined") {

      try{
        let jsonFormatted = JSON.stringify(obj,null,4);
        let formattedMessage = _formatMessage("[" + label + " (" + otype + ")] = "+ jsonFormatted,
            this.functionName);
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
      let formattedMessage = _formatMessage("[" + label + " (" + otype + ")] is undefined.");
      console.info(formattedMessage);
    }

  };

  return this;
};
