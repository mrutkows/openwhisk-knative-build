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
const FG_WHITE   = "\x1b[37m";

const FG_INFO    = FG_CYAN;
const FG_WARN    = FG_YELLOW;
const FG_ERROR   = FG_RED;
const FG_LOG     = FG_WHITE;

// args:
// - moduleName
// - messagem
// - timestamp
const MSG = "[%s]: [%s] (%s)";

let config = {
  displayPrefix: true,
  displayPostfix: true,
  prefixFGColor: FG_CYAN,
  postfixFGColor: FG_MAGENTA,
  bodyFGColor: FG_WHITE,
  defaultFGColor: FG_WHITE,
};


function getTimeFormatted(){
  let date = new Date();
  let ftime =
      date.getHours() + ":" +
      date.getMinutes() + ":" +
      date.getSeconds() + ":" +
      date.getMilliseconds();
  return ftime;
}

function formatMessagePrefix(){
  let prefix = config.prefixFGColor + "[" + this.moduleName + "] ";
  return prefix;

}

function formatMessagePostfix(){
  let postfix = config.postfixFGColor + " (" + getTimeFormatted() + ")";
  return postfix;
}

function formatBody(msg){

  return config.bodyFGColor + msg;
}

function formatMessage(msg){
  let message = formatMessagePrefix() + formatBody(msg) + formatMessagePostfix() + config.defaultFGColor;
  return message;
}

module.exports = function() {

  this.moduleName = "unknown";

  if(module !== 'undefined' && module.parent !== 'undefined' && module.parent.filename ) {
    this.moduleName = path.basename(module.parent.filename, '.js');
  }

  this.startModule = function(msg) {
    let formattedMessage = formatMessage(msg);
    console.info(formattedMessage);
  };

  this.endModule = function(msg) {
    let formattedMessage = formatMessage(msg);
    console.info(formattedMessage);
  };

  this.startFunction = function(optionalMessage) {

    let msg = "";
    if(optionalMessage !== 'undefined'){
      msg = optionalMessage;
    }
    let formattedMessage = formatMessage( arguments.callee.caller.name + ":"+ msg );
    console.info(formattedMessage);
  };

  this.endFunction = function(msg) {
    let msg = "";
    if(optionalMessage !== 'undefined'){
      msg = optionalMessage;
    }
    let formattedMessage = formatMessage( arguments.callee.caller.name + ":"+ msg );
    console.info(formattedMessage);
  };

  this.trace = function(msg) {
    let formattedMessage = formatMessage(msg);
    console.info(formattedMessage);
  };

  this.dumpObject = function(obj, label){
    let jsonFormatted = JSON.stringify(obj,null,4);
    let formattedMessage = formatMessage("[" + label + "] "+ jsonFormatted);
    console.info(formattedMessage);
  };

  return this;
};

