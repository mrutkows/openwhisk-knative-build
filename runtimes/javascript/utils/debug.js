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
const FG_YELLOW  = "\x1b[33m";
const FG_MAGENTA = "\x1b[35m";
const FG_CYAN    = "\x1b[36m";
const FG_WHITE   = "\x1b[37m";
const FG_BLUE    = "\x1b[34m";
const FG_GREEN   = "\x1b[32m";

const FG_INFO    = FG_CYAN;
const FG_WARN    = FG_YELLOW;
const FG_ERROR   = FG_RED;
const FG_LOG     = FG_WHITE;

let config = {
  prefixFGColor: FG_CYAN,
  postfixFGColor: FG_MAGENTA,
  bodyFGColor: FG_WHITE,
  defaultFGColor: FG_WHITE,
  functionStartMarker: ">>> START: ",
  functionEndMarker: "<<< END: ",
};

/**
 * Formats Hours, Minutes, Seconds and Milliseconds as HH:MM:SS:mm
 */
function getTimeFormatted(){
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
function formatMessagePrefix(functionName, color){

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
function formatMessagePostfix(color){

  let postfixColor = config.postfixFGColor;

  // If color arg is defined, use it
  // TODO: validate color is an actual valid color string
  if( color !== undefined) {
    postfixColor = color;
  }
  let postfix = postfixColor + " (" + getTimeFormatted() + ")";
  return postfix;
}

/**
 * Formats and colorizes the body of the message.
 */
function formatBody(msg, color){

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
function formatMessage(msg, functionName){
  // Reset to default color at end of formatted message
  let message = formatMessagePrefix(functionName) + formatBody(msg) + formatMessagePostfix() + config.defaultFGColor;
  return message;
}

module.exports = function(requiringModule) {

  // identify module name of module that 'required' us to display as part of console trace prefix
  if(requiringModule && requiringModule!=='undefined' &&
      typeof (requiringModule) === 'object' &&
      requiringModule.filename !== 'undefined') {
      this.moduleName = path.basename(requiringModule.filename, '.js');
  } else {
    console.error("Invalid argument: parent Module not provided; using parent Module name.");
    this.moduleName = path.basename(module.parent.filename, '.js');
  }

  /**
   * startModule
   *
   * @param msg optional message to display with module start information
   */
  this.startModule = function(msg) {
    let formattedMessage = formatMessage(msg);
    console.info(formattedMessage);
  };

  /**
   * functionStart
   *
   * @param message optional message to display with function start marker
   */
  this.functionStart = function(message, functionName) {

    let msg = "";
    if(message !== undefined){
      msg = message;
    }

    let fxName = arguments.callee.caller.name;
    if(functionName !== undefined){
      fxName = functionName;
    }

    let formattedMessage = formatMessage( config.functionStartMarker + msg, fxName );
    console.info(formattedMessage);
  };

  /**
   * functionEnd
   *
   * @param message optional message to display with function end marker
   */
  this.functionEnd = function(message, functionName) {

    let msg = "";
    if(message !== undefined){
      msg = message;
    }

    let fxName = arguments.callee.caller.name;
    if(functionName !== undefined){
      fxName = functionName;
    }

    let formattedMessage = formatMessage( config.functionEndMarker + msg, fxName );
    console.info(formattedMessage);
  };

  /**
   * functionEndError
   *
   * @param optionalMessage optional message to display with function end marker
   */
  // this.functionEndError = function(optionalMessage, error, functionName) {
  //   let fxName = arguments.callee.caller.name;
  //   if(functionName !== undefined){
  //     fxName = functionName;
  //   }
  // };

  /**
   * trace
   *
   * @param msg message to display to console as trace information
   */
  this.trace = function(msg, functionName) {

    let fxName = arguments.callee.caller.name;
    if(functionName !== undefined){
      fxName = functionName;
    }

    let formattedMessage = formatMessage(msg, fxName);
    console.info(formattedMessage);
  };

  /**
   * dumpObject
   *
   * @param obj object to dump to console
   * @param label optional string label to display with object dump
   */
  this.dumpObject = function(obj, label, functionName){

    try{

      let fxName = arguments.callee.caller.name;
      if(functionName !== undefined){
        fxName = functionName;
      }

      let jsonFormatted = JSON.stringify(obj,null,4);
      let otype = typeof(obj)
      let formattedMessage = formatMessage("[" + label + " (" + otype + ")] = "+ jsonFormatted, fxName);
      console.info(formattedMessage);
    } catch (e) {
      let otype = typeof(obj)
      console.error("[debug] dumpObject(): ERROR: " + "[" + label + " (" + otype + ")] : " + e.message);
    }
  };

  return this;
};
