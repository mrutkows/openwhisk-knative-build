<!--
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
-->

# OpenWhisk NodeJS Runtime for Knative

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

This directory is used to build and test the OpenWhisk NodeJS Action runtime for Knative.

## Build and Deploy the OpenWhisk Runtime Build Template

### Configure 'service.yaml'

Replace `{DOCKER_USERNAME}` with your own docker username in `service.yaml`. 

```bash
kubectl apply -f service.yaml
```

<details>
    <summary>Debugger Output</summary>

```bash
Hello World from NodeJS runtime
**************************
DEBUGGER: config
{ port: 8080, apiHost: undefined, allowConcurrent: undefined }
**************************
DEBUGGER: Starting the server
**************************
DEBUGGER: I am inside wrapEndpoint
**************************
DEBUGGER: I am inside wrapEndpoint
```
</details>

# Tests

## Simple hello, Content-Type: JSON

### /init
```bash
curl -H "Host: nodejs-runtime.default.example.com" -d "@data-with-simple-hello.json" -H "Content-Type: application/json" http://localhost/init -v
```

<details>
  <summary>Init data</summary>
    
```bash
cat data-with-simple-hello.json
{
    "value": {
        "name" : "helloNodeJS",
        "main" : "main",
        "binary": false,
        "code" : "function main() {return {payload: 'HI'};}"
    }
}
```
</details>

<details>
  <summary>Curl output</summary>
  
```
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 80 (#0)
> POST /init HTTP/1.1
> Host: nodejs-runtime.default.example.com
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 164
>
* upload completely sent off: 164 out of 164 bytes
< HTTP/1.1 200 OK
< content-length: 11
< content-type: application/json; charset=utf-8
< date: Tue, 29 Jan 2019 20:50:08 GMT
< etag: W/"b-2MeHcbdPiKDIdPsWUDKemTPAQvg"
< server: envoy
< x-envoy-upstream-service-time: 8626
< x-powered-by: Express
<
* Connection #0 to host localhost left intact
{"OK":true}
```
</details>

### /run

```bash
curl -H "Host: nodejs-runtime.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run -v
```
<details>
  <summary>Curl output</summary> 
  
```
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 80 (#0)
> POST /run HTTP/1.1
> Host: nodejs-runtime.default.example.com
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Type: application/json
>
< HTTP/1.1 200 OK
< content-length: 16
< content-type: application/json; charset=utf-8
< date: Tue, 29 Jan 2019 21:59:00 GMT
< etag: W/"10-r4HisfsG2IPqXoE1oxz8LXbAq+I"
< x-powered-by: Express
< x-envoy-upstream-service-time: 19
< server: envoy
<
* Connection #0 to host localhost left intact
{"payload":"HI"}
```
</details>

### Logs 'user-container'

```bash
kubectl logs nodejs-runtime-00001-deployment-66896df589-25cv4 -c user-container
```

<details>
  <summary>Logs 'user-container'</summary> 

```
Hello World from NodeJS runtime
**************************
DEBUGGER: config
{ port: 8080, apiHost: undefined, allowConcurrent: undefined }
**************************
DEBUGGER: app
{ [EventEmitter: app]
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  defaultConfiguration: [Function: defaultConfiguration],
  lazyrouter: [Function: lazyrouter],
  handle: [Function: handle],
  use: [Function: use],
  route: [Function: route],
  engine: [Function: engine],
  param: [Function: param],
  set: [Function: set],
  path: [Function: path],
  enabled: [Function: enabled],
  disabled: [Function: disabled],
  enable: [Function: enable],
  disable: [Function: disable],
  acl: [Function],
  bind: [Function],
  checkout: [Function],
  connect: [Function],
  copy: [Function],
  delete: [Function],
  get: [Function],
  head: [Function],
  link: [Function],
  lock: [Function],
  'm-search': [Function],
  merge: [Function],
  mkactivity: [Function],
  mkcalendar: [Function],
  mkcol: [Function],
  move: [Function],
  notify: [Function],
  options: [Function],
  patch: [Function],
  post: [Function],
  propfind: [Function],
  proppatch: [Function],
  purge: [Function],
  put: [Function],
  rebind: [Function],
  report: [Function],
  search: [Function],
  source: [Function],
  subscribe: [Function],
  trace: [Function],
  unbind: [Function],
  unlink: [Function],
  unlock: [Function],
  unsubscribe: [Function],
  all: [Function: all],
  del: [Function],
  render: [Function: render],
  listen: [Function: listen],
  request: IncomingMessage { app: [Circular] },
  response: ServerResponse { app: [Circular] },
  cache: {},
  engines: {},
  settings:
   { 'x-powered-by': true,
     etag: 'weak',
     'etag fn': [Function: generateETag],
     env: 'development',
     'query parser': 'extended',
     'query parser fn': [Function: parseExtendedQueryString],
     'subdomain offset': 2,
     'trust proxy': false,
     'trust proxy fn': [Function: trustNone],
     view: [Function: View],
     views: '/nodejsAction/views',
     'jsonp callback name': 'callback' },
  locals:
   [Object: null prototype] {
     settings:
      { 'x-powered-by': true,
        etag: 'weak',
        'etag fn': [Function: generateETag],
        env: 'development',
        'query parser': 'extended',
        'query parser fn': [Function: parseExtendedQueryString],
        'subdomain offset': 2,
        'trust proxy': false,
        'trust proxy fn': [Function: trustNone],
        view: [Function: View],
        views: '/nodejsAction/views',
        'jsonp callback name': 'callback' } },
  mountpath: '/' }
**************************
DEBUGGER: Starting the server
[Function: start]
**************************
DEBUGGER: app
{ [EventEmitter: app]
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  defaultConfiguration: [Function: defaultConfiguration],
  lazyrouter: [Function: lazyrouter],
  handle: [Function: handle],
  use: [Function: use],
  route: [Function: route],
  engine: [Function: engine],
  param: [Function: param],
  set: [Function: set],
  path: [Function: path],
  enabled: [Function: enabled],
  disabled: [Function: disabled],
  enable: [Function: enable],
  disable: [Function: disable],
  acl: [Function],
  bind: [Function],
  checkout: [Function],
  connect: [Function],
  copy: [Function],
  delete: [Function],
  get: [Function],
  head: [Function],
  link: [Function],
  lock: [Function],
  'm-search': [Function],
  merge: [Function],
  mkactivity: [Function],
  mkcalendar: [Function],
  mkcol: [Function],
  move: [Function],
  notify: [Function],
  options: [Function],
  patch: [Function],
  post: [Function],
  propfind: [Function],
  proppatch: [Function],
  purge: [Function],
  put: [Function],
  rebind: [Function],
  report: [Function],
  search: [Function],
  source: [Function],
  subscribe: [Function],
  trace: [Function],
  unbind: [Function],
  unlink: [Function],
  unlock: [Function],
  unsubscribe: [Function],
  all: [Function: all],
  del: [Function],
  render: [Function: render],
  listen: [Function: listen],
  request: IncomingMessage { app: [Circular] },
  response: ServerResponse { app: [Circular] },
  cache: {},
  engines: {},
  settings:
   { 'x-powered-by': true,
     etag: 'weak',
     'etag fn': [Function: generateETag],
     env: 'development',
     'query parser': 'extended',
     'query parser fn': [Function: parseExtendedQueryString],
     'subdomain offset': 2,
     'trust proxy': false,
     'trust proxy fn': [Function: trustNone],
     view: [Function: View],
     views: '/nodejsAction/views',
     'jsonp callback name': 'callback',
     port: 8080 },
  locals:
   [Object: null prototype] {
     settings:
      { 'x-powered-by': true,
        etag: 'weak',
        'etag fn': [Function: generateETag],
        env: 'development',
        'query parser': 'extended',
        'query parser fn': [Function: parseExtendedQueryString],
        'subdomain offset': 2,
        'trust proxy': false,
        'trust proxy fn': [Function: trustNone],
        view: [Function: View],
        views: '/nodejsAction/views',
        'jsonp callback name': 'callback',
        port: 8080 } },
  mountpath: '/' }
**************************
DEBUGGER: app
{ [EventEmitter: app]
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  defaultConfiguration: [Function: defaultConfiguration],
  lazyrouter: [Function: lazyrouter],
  handle: [Function: handle],
  use: [Function: use],
  route: [Function: route],
  engine: [Function: engine],
  param: [Function: param],
  set: [Function: set],
  path: [Function: path],
  enabled: [Function: enabled],
  disabled: [Function: disabled],
  enable: [Function: enable],
  disable: [Function: disable],
  acl: [Function],
  bind: [Function],
  checkout: [Function],
  connect: [Function],
  copy: [Function],
  delete: [Function],
  get: [Function],
  head: [Function],
  link: [Function],
  lock: [Function],
  'm-search': [Function],
  merge: [Function],
  mkactivity: [Function],
  mkcalendar: [Function],
  mkcol: [Function],
  move: [Function],
  notify: [Function],
  options: [Function],
  patch: [Function],
  post: [Function],
  propfind: [Function],
  proppatch: [Function],
  purge: [Function],
  put: [Function],
  rebind: [Function],
  report: [Function],
  search: [Function],
  source: [Function],
  subscribe: [Function],
  trace: [Function],
  unbind: [Function],
  unlink: [Function],
  unlock: [Function],
  unsubscribe: [Function],
  all: [Function: all],
  del: [Function],
  render: [Function: render],
  listen: [Function: listen],
  request: IncomingMessage { app: [Circular] },
  response: ServerResponse { app: [Circular] },
  cache: {},
  engines: {},
  settings:
   { 'x-powered-by': true,
     etag: 'weak',
     'etag fn': [Function: generateETag],
     env: 'development',
     'query parser': 'extended',
     'query parser fn': [Function: parseExtendedQueryString],
     'subdomain offset': 2,
     'trust proxy': false,
     'trust proxy fn': [Function: trustNone],
     view: [Function: View],
     views: '/nodejsAction/views',
     'jsonp callback name': 'callback',
     port: 8080 },
  locals:
   [Object: null prototype] {
     settings:
      { 'x-powered-by': true,
        etag: 'weak',
        'etag fn': [Function: generateETag],
        env: 'development',
        'query parser': 'extended',
        'query parser fn': [Function: parseExtendedQueryString],
        'subdomain offset': 2,
        'trust proxy': false,
        'trust proxy fn': [Function: trustNone],
        view: [Function: View],
        views: '/nodejsAction/views',
        'jsonp callback name': 'callback',
        port: 8080 } },
  mountpath: '/',
  _router:
   { [Function: router]
     params: {},
     _params: [],
     caseSensitive: false,
     mergeParams: undefined,
     strict: false,
     stack: [ [Layer], [Layer], [Layer] ] } }
**************************
DEBUGGER: app
{ [EventEmitter: app]
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  defaultConfiguration: [Function: defaultConfiguration],
  lazyrouter: [Function: lazyrouter],
  handle: [Function: handle],
  use: [Function: use],
  route: [Function: route],
  engine: [Function: engine],
  param: [Function: param],
  set: [Function: set],
  path: [Function: path],
  enabled: [Function: enabled],
  disabled: [Function: disabled],
  enable: [Function: enable],
  disable: [Function: disable],
  acl: [Function],
  bind: [Function],
  checkout: [Function],
  connect: [Function],
  copy: [Function],
  delete: [Function],
  get: [Function],
  head: [Function],
  link: [Function],
  lock: [Function],
  'm-search': [Function],
  merge: [Function],
  mkactivity: [Function],
  mkcalendar: [Function],
  mkcol: [Function],
  move: [Function],
  notify: [Function],
  options: [Function],
  patch: [Function],
  post: [Function],
  propfind: [Function],
  proppatch: [Function],
  purge: [Function],
  put: [Function],
  rebind: [Function],
  report: [Function],
  search: [Function],
  source: [Function],
  subscribe: [Function],
  trace: [Function],
  unbind: [Function],
  unlink: [Function],
  unlock: [Function],
  unsubscribe: [Function],
  all: [Function: all],
  del: [Function],
  render: [Function: render],
  listen: [Function: listen],
  request: IncomingMessage { app: [Circular] },
  response: ServerResponse { app: [Circular] },
  cache: {},
  engines: {},
  settings:
   { 'x-powered-by': true,
     etag: 'weak',
     'etag fn': [Function: generateETag],
     env: 'development',
     'query parser': 'extended',
     'query parser fn': [Function: parseExtendedQueryString],
     'subdomain offset': 2,
     'trust proxy': false,
     'trust proxy fn': [Function: trustNone],
     view: [Function: View],
     views: '/nodejsAction/views',
     'jsonp callback name': 'callback',
     port: 8080 },
  locals:
   [Object: null prototype] {
     settings:
      { 'x-powered-by': true,
        etag: 'weak',
        'etag fn': [Function: generateETag],
        env: 'development',
        'query parser': 'extended',
        'query parser fn': [Function: parseExtendedQueryString],
        'subdomain offset': 2,
        'trust proxy': false,
        'trust proxy fn': [Function: trustNone],
        view: [Function: View],
        views: '/nodejsAction/views',
        'jsonp callback name': 'callback',
        port: 8080 } },
  mountpath: '/',
  _router:
   { [Function: router]
     params: {},
     _params: [],
     caseSensitive: false,
     mergeParams: undefined,
     strict: false,
     stack: [ [Layer], [Layer], [Layer], [Layer] ] } }
**************************
DEBUGGER: app
{ [EventEmitter: app]
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  defaultConfiguration: [Function: defaultConfiguration],
  lazyrouter: [Function: lazyrouter],
  handle: [Function: handle],
  use: [Function: use],
  route: [Function: route],
  engine: [Function: engine],
  param: [Function: param],
  set: [Function: set],
  path: [Function: path],
  enabled: [Function: enabled],
  disabled: [Function: disabled],
  enable: [Function: enable],
  disable: [Function: disable],
  acl: [Function],
  bind: [Function],
  checkout: [Function],
  connect: [Function],
  copy: [Function],
  delete: [Function],
  get: [Function],
  head: [Function],
  link: [Function],
  lock: [Function],
  'm-search': [Function],
  merge: [Function],
  mkactivity: [Function],
  mkcalendar: [Function],
  mkcol: [Function],
  move: [Function],
  notify: [Function],
  options: [Function],
  patch: [Function],
  post: [Function],
  propfind: [Function],
  proppatch: [Function],
  purge: [Function],
  put: [Function],
  rebind: [Function],
  report: [Function],
  search: [Function],
  source: [Function],
  subscribe: [Function],
  trace: [Function],
  unbind: [Function],
  unlink: [Function],
  unlock: [Function],
  unsubscribe: [Function],
  all: [Function: all],
  del: [Function],
  render: [Function: render],
  listen: [Function: listen],
  request: IncomingMessage { app: [Circular] },
  response: ServerResponse { app: [Circular] },
  cache: {},
  engines: {},
  settings:
   { 'x-powered-by': true,
     etag: 'weak',
     'etag fn': [Function: generateETag],
     env: 'development',
     'query parser': 'extended',
     'query parser fn': [Function: parseExtendedQueryString],
     'subdomain offset': 2,
     'trust proxy': false,
     'trust proxy fn': [Function: trustNone],
     view: [Function: View],
     views: '/nodejsAction/views',
     'jsonp callback name': 'callback',
     port: 8080 },
  locals:
   [Object: null prototype] {
     settings:
      { 'x-powered-by': true,
        etag: 'weak',
        'etag fn': [Function: generateETag],
        env: 'development',
        'query parser': 'extended',
        'query parser fn': [Function: parseExtendedQueryString],
        'subdomain offset': 2,
        'trust proxy': false,
        'trust proxy fn': [Function: trustNone],
        view: [Function: View],
        views: '/nodejsAction/views',
        'jsonp callback name': 'callback',
        port: 8080 } },
  mountpath: '/',
  _router:
   { [Function: router]
     params: {},
     _params: [],
     caseSensitive: false,
     mergeParams: undefined,
     strict: false,
     stack: [ [Layer], [Layer], [Layer], [Layer], [Layer] ] } }
**************************
DEBUGGER: Status is
ready
**************************
DEBUGGER: Returning 200
{ name: 'helloNodeJS',
  main: 'main',
  binary: false,
  code: 'function main() {return {payload: \'HI\'};}' }
```
</details>

---

# Failed Tests

```bash
kubectl logs nodejs-runtime-00001-deployment-6588cc7dcf-vbgz9 -c queue-proxy
```
<details>
  <summary>Logs 'queue-proxy': Error!!! </summary> 
  
```
{"level":"info","ts":"2019-01-29T20:50:06.041Z","caller":"logging/config.go:96","msg":"Successfully created the logger.","knative.dev/jsonconfig":"{\n  \"level\": \"info\",\n  \"development\": false,\n  \"outputPaths\": [\"stdout\"],\n  \"errorOutputPaths\": [\"stderr\"],\n  \"encoding\": \"json\",\n  \"encoderConfig\": {\n    \"timeKey\": \"ts\",\n    \"levelKey\": \"level\",\n    \"nameKey\": \"logger\",\n    \"callerKey\": \"caller\",\n    \"messageKey\": \"msg\",\n    \"stacktraceKey\": \"stacktrace\",\n    \"lineEnding\": \"\",\n    \"levelEncoder\": \"\",\n    \"timeEncoder\": \"iso8601\",\n    \"durationEncoder\": \"\",\n    \"callerEncoder\": \"\"\n  }\n}\n"}
{"level":"info","ts":"2019-01-29T20:50:06.041Z","caller":"logging/config.go:97","msg":"Logging level set to info"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_POD=nodejs-runtime-00001-deployment-6588cc7dcf-vbgz9","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_CONFIGURATION=nodejs-runtime","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_NAMESPACE=default","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_REVISION=nodejs-runtime-00001","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_AUTOSCALER=autoscaler","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_AUTOSCALER_PORT=8080","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:43","msg":"SERVING_AUTOSCALER_PORT=8080","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:33","msg":"CONTAINER_CONCURRENCY=0","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:43","msg":"CONTAINER_CONCURRENCY=0","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:33","msg":"REVISION_TIMEOUT_SECONDS=300","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:43","msg":"REVISION_TIMEOUT_SECONDS=300","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:33","msg":"USER_PORT=8080","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.042Z","logger":"queueproxy","caller":"util/env.go:43","msg":"USER_PORT=8080","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:50:06.043Z","logger":"queueproxy","caller":"queue/main.go:291","msg":"Initializing OpenCensus Prometheus exporter.","commit":"4d198db","knative.dev/key":"default/nodejs-runtime-00001","knative.dev/pod":"nodejs-runtime-00001-deployment-6588cc7dcf-vbgz9"}
{"level":"info","ts":"2019-01-29T20:50:06.043Z","logger":"queueproxy","caller":"queue/main.go:306","msg":"Connecting to autoscaler at ws://autoscaler.knative-serving:8080","commit":"4d198db","knative.dev/key":"default/nodejs-runtime-00001","knative.dev/pod":"nodejs-runtime-00001-deployment-6588cc7dcf-vbgz9"}
{"level":"error","ts":"2019-01-29T20:50:07.043Z","logger":"queueproxy","caller":"queue/main.go:114","msg":"Error while sending stat{error 25 0  connection has not yet been established}","commit":"4d198db","knative.dev/key":"default/nodejs-runtime-00001","knative.dev/pod":"nodejs-runtime-00001-deployment-6588cc7dcf-vbgz9","stacktrace":"main.statReporter\n\t/usr/local/google/home/mattmoor/go/src/github.com/knative/serving/cmd/queue/main.go:114"}
{"level":"error","ts":"2019-01-29T20:50:08.044Z","logger":"queueproxy","caller":"queue/main.go:114","msg":"Error while sending stat{error 25 0  connection has not yet been established}","commit":"4d198db","knative.dev/key":"default/nodejs-runtime-00001","knative.dev/pod":"nodejs-runtime-00001-deployment-6588cc7dcf-vbgz9","stacktrace":"main.statReporter\n\t/usr/local/google/home/mattmoor/go/src/github.com/knative/serving/cmd/queue/main.go:114"}

```
</details>

```bash
curl -H "Host: nodejs-runtime.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run -v
```
<details>
  <summary>Curl: POST: No data</summary> 
  
```  
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 80 (#0)
> POST /run HTTP/1.1
> Host: nodejs-runtime.default.example.com
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Type: application/json
>
< HTTP/1.1 403 Forbidden
< content-length: 48
< content-type: application/json; charset=utf-8
< date: Tue, 29 Jan 2019 20:57:05 GMT
< etag: W/"30-+gHjsIukRjW6jTSR7UO2SHXnxZc"
< server: envoy
< x-envoy-upstream-service-time: 7923
< x-powered-by: Express
<
* Connection #0 to host localhost left intact
{"error":"System not ready, status is running."}
```
</details>

```bash
kubectl logs nodejs-runtime-00001-deployment-6588cc7dcf-vk646 -c user-container
```
<details>
  <summary>Logs 'queue-proxy'</summary> 
  
```
Hello World from NodeJS runtime
DEBUGGER: Config:
{ port: 8080, apiHost: undefined, allowConcurrent: undefined }
DEBUGGER: Config:
{ [EventEmitter: app]
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  defaultConfiguration: [Function: defaultConfiguration],
  lazyrouter: [Function: lazyrouter],
  handle: [Function: handle],
  use: [Function: use],
  route: [Function: route],
  engine: [Function: engine],
  param: [Function: param],
  set: [Function: set],
  path: [Function: path],
  enabled: [Function: enabled],
  disabled: [Function: disabled],
  enable: [Function: enable],
  disable: [Function: disable],
  acl: [Function],
  bind: [Function],
  checkout: [Function],
  connect: [Function],
  copy: [Function],
  delete: [Function],
  get: [Function],
  head: [Function],
  link: [Function],
  lock: [Function],
  'm-search': [Function],
  merge: [Function],
  mkactivity: [Function],
  mkcalendar: [Function],
  mkcol: [Function],
  move: [Function],
  notify: [Function],
  options: [Function],
  patch: [Function],
  post: [Function],
  propfind: [Function],
  proppatch: [Function],
  purge: [Function],
  put: [Function],
  rebind: [Function],
  report: [Function],
  search: [Function],
  source: [Function],
  subscribe: [Function],
  trace: [Function],
  unbind: [Function],
  unlink: [Function],
  unlock: [Function],
  unsubscribe: [Function],
  all: [Function: all],
  del: [Function],
  render: [Function: render],
  listen: [Function: listen],
  request: IncomingMessage { app: [Circular] },
  response: ServerResponse { app: [Circular] },
  cache: {},
  engines: {},
  settings:
   { 'x-powered-by': true,
     etag: 'weak',
     'etag fn': [Function: generateETag],
     env: 'development',
     'query parser': 'extended',
     'query parser fn': [Function: parseExtendedQueryString],
     'subdomain offset': 2,
     'trust proxy': false,
     'trust proxy fn': [Function: trustNone],
     view: [Function: View],
     views: '/nodejsAction/views',
     'jsonp callback name': 'callback' },
  locals:
   [Object: null prototype] {
     settings:
      { 'x-powered-by': true,
        etag: 'weak',
        'etag fn': [Function: generateETag],
        env: 'development',
        'query parser': 'extended',
        'query parser fn': [Function: parseExtendedQueryString],
        'subdomain offset': 2,
        'trust proxy': false,
        'trust proxy fn': [Function: trustNone],
        view: [Function: View],
        views: '/nodejsAction/views',
        'jsonp callback name': 'callback' } },
  mountpath: '/' }
DEBUGGER: Starting the server
[Function: start]
DEBUGGER: Config:
{ [EventEmitter: app]
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  defaultConfiguration: [Function: defaultConfiguration],
  lazyrouter: [Function: lazyrouter],
  handle: [Function: handle],
  use: [Function: use],
  route: [Function: route],
  engine: [Function: engine],
  param: [Function: param],
  set: [Function: set],
  path: [Function: path],
  enabled: [Function: enabled],
  disabled: [Function: disabled],
  enable: [Function: enable],
  disable: [Function: disable],
  acl: [Function],
  bind: [Function],
  checkout: [Function],
  connect: [Function],
  copy: [Function],
  delete: [Function],
  get: [Function],
  head: [Function],
  link: [Function],
  lock: [Function],
  'm-search': [Function],
  merge: [Function],
  mkactivity: [Function],
  mkcalendar: [Function],
  mkcol: [Function],
  move: [Function],
  notify: [Function],
  options: [Function],
  patch: [Function],
  post: [Function],
  propfind: [Function],
  proppatch: [Function],
  purge: [Function],
  put: [Function],
  rebind: [Function],
  report: [Function],
  search: [Function],
  source: [Function],
  subscribe: [Function],
  trace: [Function],
  unbind: [Function],
  unlink: [Function],
  unlock: [Function],
  unsubscribe: [Function],
  all: [Function: all],
  del: [Function],
  render: [Function: render],
  listen: [Function: listen],
  request: IncomingMessage { app: [Circular] },
  response: ServerResponse { app: [Circular] },
  cache: {},
  engines: {},
  settings:
   { 'x-powered-by': true,
     etag: 'weak',
     'etag fn': [Function: generateETag],
     env: 'development',
     'query parser': 'extended',
     'query parser fn': [Function: parseExtendedQueryString],
     'subdomain offset': 2,
     'trust proxy': false,
     'trust proxy fn': [Function: trustNone],
     view: [Function: View],
     views: '/nodejsAction/views',
     'jsonp callback name': 'callback',
     port: 8080 },
  locals:
   [Object: null prototype] {
     settings:
      { 'x-powered-by': true,
        etag: 'weak',
        'etag fn': [Function: generateETag],
        env: 'development',
        'query parser': 'extended',
        'query parser fn': [Function: parseExtendedQueryString],
        'subdomain offset': 2,
        'trust proxy': false,
        'trust proxy fn': [Function: trustNone],
        view: [Function: View],
        views: '/nodejsAction/views',
        'jsonp callback name': 'callback',
        port: 8080 } },
  mountpath: '/' }
DEBUGGER: Config:
{ [EventEmitter: app]
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  defaultConfiguration: [Function: defaultConfiguration],
  lazyrouter: [Function: lazyrouter],
  handle: [Function: handle],
  use: [Function: use],
  route: [Function: route],
  engine: [Function: engine],
  param: [Function: param],
  set: [Function: set],
  path: [Function: path],
  enabled: [Function: enabled],
  disabled: [Function: disabled],
  enable: [Function: enable],
  disable: [Function: disable],
  acl: [Function],
  bind: [Function],
  checkout: [Function],
  connect: [Function],
  copy: [Function],
  delete: [Function],
  get: [Function],
  head: [Function],
  link: [Function],
  lock: [Function],
  'm-search': [Function],
  merge: [Function],
  mkactivity: [Function],
  mkcalendar: [Function],
  mkcol: [Function],
  move: [Function],
  notify: [Function],
  options: [Function],
  patch: [Function],
  post: [Function],
  propfind: [Function],
  proppatch: [Function],
  purge: [Function],
  put: [Function],
  rebind: [Function],
  report: [Function],
  search: [Function],
  source: [Function],
  subscribe: [Function],
  trace: [Function],
  unbind: [Function],
  unlink: [Function],
  unlock: [Function],
  unsubscribe: [Function],
  all: [Function: all],
  del: [Function],
  render: [Function: render],
  listen: [Function: listen],
  request: IncomingMessage { app: [Circular] },
  response: ServerResponse { app: [Circular] },
  cache: {},
  engines: {},
  settings:
   { 'x-powered-by': true,
     etag: 'weak',
     'etag fn': [Function: generateETag],
     env: 'development',
     'query parser': 'extended',
     'query parser fn': [Function: parseExtendedQueryString],
     'subdomain offset': 2,
     'trust proxy': false,
     'trust proxy fn': [Function: trustNone],
     view: [Function: View],
     views: '/nodejsAction/views',
     'jsonp callback name': 'callback',
     port: 8080 },
  locals:
   [Object: null prototype] {
     settings:
      { 'x-powered-by': true,
        etag: 'weak',
        'etag fn': [Function: generateETag],
        env: 'development',
        'query parser': 'extended',
        'query parser fn': [Function: parseExtendedQueryString],
        'subdomain offset': 2,
        'trust proxy': false,
        'trust proxy fn': [Function: trustNone],
        view: [Function: View],
        views: '/nodejsAction/views',
        'jsonp callback name': 'callback',
        port: 8080 } },
  mountpath: '/',
  _router:
   { [Function: router]
     params: {},
     _params: [],
     caseSensitive: false,
     mergeParams: undefined,
     strict: false,
     stack: [ [Layer], [Layer], [Layer] ] } }
DEBUGGER: Config:
{ [EventEmitter: app]
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  defaultConfiguration: [Function: defaultConfiguration],
  lazyrouter: [Function: lazyrouter],
  handle: [Function: handle],
  use: [Function: use],
  route: [Function: route],
  engine: [Function: engine],
  param: [Function: param],
  set: [Function: set],
  path: [Function: path],
  enabled: [Function: enabled],
  disabled: [Function: disabled],
  enable: [Function: enable],
  disable: [Function: disable],
  acl: [Function],
  bind: [Function],
  checkout: [Function],
  connect: [Function],
  copy: [Function],
  delete: [Function],
  get: [Function],
  head: [Function],
  link: [Function],
  lock: [Function],
  'm-search': [Function],
  merge: [Function],
  mkactivity: [Function],
  mkcalendar: [Function],
  mkcol: [Function],
  move: [Function],
  notify: [Function],
  options: [Function],
  patch: [Function],
  post: [Function],
  propfind: [Function],
  proppatch: [Function],
  purge: [Function],
  put: [Function],
  rebind: [Function],
  report: [Function],
  search: [Function],
  source: [Function],
  subscribe: [Function],
  trace: [Function],
  unbind: [Function],
  unlink: [Function],
  unlock: [Function],
  unsubscribe: [Function],
  all: [Function: all],
  del: [Function],
  render: [Function: render],
  listen: [Function: listen],
  request: IncomingMessage { app: [Circular] },
  response: ServerResponse { app: [Circular] },
  cache: {},
  engines: {},
  settings:
   { 'x-powered-by': true,
     etag: 'weak',
     'etag fn': [Function: generateETag],
     env: 'development',
     'query parser': 'extended',
     'query parser fn': [Function: parseExtendedQueryString],
     'subdomain offset': 2,
     'trust proxy': false,
     'trust proxy fn': [Function: trustNone],
     view: [Function: View],
     views: '/nodejsAction/views',
     'jsonp callback name': 'callback',
     port: 8080 },
  locals:
   [Object: null prototype] {
     settings:
      { 'x-powered-by': true,
        etag: 'weak',
        'etag fn': [Function: generateETag],
        env: 'development',
        'query parser': 'extended',
        'query parser fn': [Function: parseExtendedQueryString],
        'subdomain offset': 2,
        'trust proxy': false,
        'trust proxy fn': [Function: trustNone],
        view: [Function: View],
        views: '/nodejsAction/views',
        'jsonp callback name': 'callback',
        port: 8080 } },
  mountpath: '/',
  _router:
   { [Function: router]
     params: {},
     _params: [],
     caseSensitive: false,
     mergeParams: undefined,
     strict: false,
     stack: [ [Layer], [Layer], [Layer], [Layer] ] } }
DEBUGGER: Config:
{ [EventEmitter: app]
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  defaultConfiguration: [Function: defaultConfiguration],
  lazyrouter: [Function: lazyrouter],
  handle: [Function: handle],
  use: [Function: use],
  route: [Function: route],
  engine: [Function: engine],
  param: [Function: param],
  set: [Function: set],
  path: [Function: path],
  enabled: [Function: enabled],
  disabled: [Function: disabled],
  enable: [Function: enable],
  disable: [Function: disable],
  acl: [Function],
  bind: [Function],
  checkout: [Function],
  connect: [Function],
  copy: [Function],
  delete: [Function],
  get: [Function],
  head: [Function],
  link: [Function],
  lock: [Function],
  'm-search': [Function],
  merge: [Function],
  mkactivity: [Function],
  mkcalendar: [Function],
  mkcol: [Function],
  move: [Function],
  notify: [Function],
  options: [Function],
  patch: [Function],
  post: [Function],
  propfind: [Function],
  proppatch: [Function],
  purge: [Function],
  put: [Function],
  rebind: [Function],
  report: [Function],
  search: [Function],
  source: [Function],
  subscribe: [Function],
  trace: [Function],
  unbind: [Function],
  unlink: [Function],
  unlock: [Function],
  unsubscribe: [Function],
  all: [Function: all],
  del: [Function],
  render: [Function: render],
  listen: [Function: listen],
  request: IncomingMessage { app: [Circular] },
  response: ServerResponse { app: [Circular] },
  cache: {},
  engines: {},
  settings:
   { 'x-powered-by': true,
     etag: 'weak',
     'etag fn': [Function: generateETag],
     env: 'development',
     'query parser': 'extended',
     'query parser fn': [Function: parseExtendedQueryString],
     'subdomain offset': 2,
     'trust proxy': false,
     'trust proxy fn': [Function: trustNone],
     view: [Function: View],
     views: '/nodejsAction/views',
     'jsonp callback name': 'callback',
     port: 8080 },
  locals:
   [Object: null prototype] {
     settings:
      { 'x-powered-by': true,
        etag: 'weak',
        'etag fn': [Function: generateETag],
        env: 'development',
        'query parser': 'extended',
        'query parser fn': [Function: parseExtendedQueryString],
        'subdomain offset': 2,
        'trust proxy': false,
        'trust proxy fn': [Function: trustNone],
        view: [Function: View],
        views: '/nodejsAction/views',
        'jsonp callback name': 'callback',
        port: 8080 } },
  mountpath: '/',
  _router:
   { [Function: router]
     params: {},
     _params: [],
     caseSensitive: false,
     mergeParams: undefined,
     strict: false,
     stack: [ [Layer], [Layer], [Layer], [Layer], [Layer] ] } }
[wrapEndpoint] exception caught Cannot read property 'run' of undefined
Internal system error: System not ready, status is running.
```
</details>

```bash
curl -H "Host: nodejs-runtime.default.example.com" -d "@data.json" -H "Content-Type: application/json" http://localhost/init -v
```
<details>
  <summary>Curl: @data.json</summary> 

```
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 80 (#0)
> POST /init HTTP/1.1
> Host: nodejs-runtime.default.example.com
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 663
>
* upload completely sent off: 663 out of 663 bytes
< HTTP/1.1 403 Forbidden
< content-length: 56
< content-type: application/json; charset=utf-8
< date: Tue, 29 Jan 2019 20:04:19 GMT
< etag: W/"38-Sg5y02pHkWZIQfMXMpDIFTitATw"
< server: envoy
< x-envoy-upstream-service-time: 8429
< x-powered-by: Express
<
* Connection #0 to host localhost left intact
{"error":"Cannot initialize the action more than once."}
```
<details>
  
```bash
curl -H "Host: nodejs-runtime.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run -v
```
<details>
  <summary>Curl: POST: No data</summary> 
  
```  
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 80 (#0)
> POST /run HTTP/1.1
> Host: nodejs-runtime.default.example.com
> User-Agent: curl/7.54.0
> Accept: */*
> Content-Type: application/json
>
< HTTP/1.1 403 Forbidden
< content-length: 48
< content-type: application/json; charset=utf-8
< date: Tue, 29 Jan 2019 20:10:41 GMT
< etag: W/"30-+gHjsIukRjW6jTSR7UO2SHXnxZc"
< server: envoy
< x-envoy-upstream-service-time: 8094
< x-powered-by: Express
<
* Connection #0 to host localhost left intact
{"error":"System not ready, status is running."}
```
</details>

```bash
kubectl get pods nodejs-runtime-00001-deployment-78c4bc59bd-plc6q -o yaml
```
<details>
  <summary>get pods</summary> 

```
apiVersion: v1
kind: Pod
metadata:
  annotations:
    sidecar.istio.io/inject: "true"
    sidecar.istio.io/status: '{"version":"2153b4a1c36b2db7abd8141cba9723db658c4a56673d25af8d1d18641270f3a2","initContainers":["istio-init"],"containers":["istio-proxy"],"volumes":["istio-envoy","istio-certs"],"imagePullSecrets":null}'
    traffic.sidecar.istio.io/includeOutboundIPRanges: '*'
  creationTimestamp: "2019-01-29T20:10:34Z"
  generateName: nodejs-runtime-00001-deployment-78c4bc59bd-
  labels:
    app: nodejs-runtime-00001
    pod-template-hash: 78c4bc59bd
    serving.knative.dev/configuration: nodejs-runtime
    serving.knative.dev/configurationGeneration: "1"
    serving.knative.dev/configurationMetadataGeneration: "1"
    serving.knative.dev/revision: nodejs-runtime-00001
    serving.knative.dev/revisionUID: 1c04cbb0-2356-11e9-9d1c-025000000001
    serving.knative.dev/service: nodejs-runtime
  name: nodejs-runtime-00001-deployment-78c4bc59bd-plc6q
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: nodejs-runtime-00001-deployment-78c4bc59bd
    uid: 4bddcc28-2356-11e9-9d1c-025000000001
  resourceVersion: "49755"
  selfLink: /api/v1/namespaces/default/pods/nodejs-runtime-00001-deployment-78c4bc59bd-plc6q
  uid: efa632b2-2401-11e9-9d1c-025000000001
spec:
  containers:
  - env:
    - name: PORT
      value: "8080"
    - name: K_REVISION
      value: nodejs-runtime-00001
    - name: K_CONFIGURATION
      value: nodejs-runtime
    - name: K_SERVICE
      value: nodejs-runtime
    image: index.docker.io/pritidesai/nodejs-runtime@sha256:108a992bba41d130e04ef54540dfa2522bfa3d67493336b402999f5046faceaf
    imagePullPolicy: Always
    lifecycle:
      preStop:
        httpGet:
          path: quitquitquit
          port: 8022
          scheme: HTTP
    name: user-container
    ports:
    - containerPort: 8080
      name: user-port
      protocol: TCP
    resources:
      requests:
        cpu: 400m
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: FallbackToLogsOnError
    volumeMounts:
    - mountPath: /var/log
      name: varlog
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: default-token-29mpx
      readOnly: true
  - env:
    - name: SERVING_NAMESPACE
      value: default
    - name: SERVING_CONFIGURATION
      value: nodejs-runtime
    - name: SERVING_REVISION
      value: nodejs-runtime-00001
    - name: SERVING_AUTOSCALER
      value: autoscaler
    - name: SERVING_AUTOSCALER_PORT
      value: "8080"
    - name: CONTAINER_CONCURRENCY
      value: "0"
    - name: REVISION_TIMEOUT_SECONDS
      value: "300"
    - name: SERVING_POD
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    - name: SERVING_LOGGING_CONFIG
      value: |
        {
          "level": "info",
          "development": false,
          "outputPaths": ["stdout"],
          "errorOutputPaths": ["stderr"],
          "encoding": "json",
          "encoderConfig": {
            "timeKey": "ts",
            "levelKey": "level",
            "nameKey": "logger",
            "callerKey": "caller",
            "messageKey": "msg",
            "stacktraceKey": "stacktrace",
            "lineEnding": "",
            "levelEncoder": "",
            "timeEncoder": "iso8601",
            "durationEncoder": "",
            "callerEncoder": ""
          }
        }
    - name: SERVING_LOGGING_LEVEL
      value: info
    - name: USER_PORT
      value: "8080"
    image: gcr.io/knative-releases/github.com/knative/serving/cmd/queue@sha256:fc49125cb29f7bb2de2c4d6bd51153ce190cb522cf42df59898147d2074885cc
    imagePullPolicy: IfNotPresent
    lifecycle:
      preStop:
        httpGet:
          path: quitquitquit
          port: 8022
          scheme: HTTP
    name: queue-proxy
    ports:
    - containerPort: 8012
      name: queue-port
      protocol: TCP
    - containerPort: 8022
      name: queueadm-port
      protocol: TCP
    - containerPort: 9090
      name: queue-metrics
      protocol: TCP
    readinessProbe:
      failureThreshold: 3
      httpGet:
        path: health
        port: 8022
        scheme: HTTP
      periodSeconds: 1
      successThreshold: 1
      timeoutSeconds: 1
    resources:
      requests:
        cpu: 25m
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: default-token-29mpx
      readOnly: true
  - args:
    - proxy
    - sidecar
    - --configPath
    - /etc/istio/proxy
    - --binaryPath
    - /usr/local/bin/envoy
    - --serviceCluster
    - nodejs-runtime-00001
    - --drainDuration
    - 45s
    - --parentShutdownDuration
    - 1m0s
    - --discoveryAddress
    - istio-pilot.istio-system:15007
    - --discoveryRefreshDelay
    - 1s
    - --zipkinAddress
    - zipkin.istio-system:9411
    - --connectTimeout
    - 10s
    - --statsdUdpAddress
    - istio-statsd-prom-bridge.istio-system:9125
    - --proxyAdminPort
    - "15000"
    - --controlPlaneAuthPolicy
    - NONE
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    - name: POD_NAMESPACE
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.namespace
    - name: INSTANCE_IP
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: status.podIP
    - name: ISTIO_META_POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    - name: ISTIO_META_INTERCEPTION_MODE
      value: REDIRECT
    image: docker.io/istio/proxyv2:1.0.2
    imagePullPolicy: IfNotPresent
    lifecycle:
      preStop:
        exec:
          command:
          - sh
          - -c
          - sleep 20; until curl -s localhost:15000/clusters | grep "inbound|80|"
            | grep "rq_active" | grep "rq_active::0"; do sleep 1; done;
    name: istio-proxy
    resources:
      requests:
        cpu: 10m
    securityContext:
      procMount: Default
      readOnlyRootFilesystem: true
      runAsUser: 1337
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /etc/istio/proxy
      name: istio-envoy
    - mountPath: /etc/certs/
      name: istio-certs
      readOnly: true
  dnsPolicy: ClusterFirst
  enableServiceLinks: true
  initContainers:
  - args:
    - -p
    - "15001"
    - -u
    - "1337"
    - -m
    - REDIRECT
    - -i
    - '*'
    - -x
    - ""
    - -b
    - 8080, 8012, 8022, 9090,
    - -d
    - ""
    image: docker.io/istio/proxy_init:1.0.2
    imagePullPolicy: IfNotPresent
    name: istio-init
    resources: {}
    securityContext:
      capabilities:
        add:
        - NET_ADMIN
      procMount: Default
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
  nodeName: docker-desktop
  priority: 0
  restartPolicy: Always
  schedulerName: default-scheduler
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 300
  tolerations:
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
  volumes:
  - emptyDir: {}
    name: varlog
  - name: default-token-29mpx
    secret:
      defaultMode: 420
      secretName: default-token-29mpx
  - emptyDir:
      medium: Memory
    name: istio-envoy
  - name: istio-certs
    secret:
      defaultMode: 420
      optional: true
      secretName: istio.default
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: "2019-01-29T20:10:36Z"
    status: "True"
    type: Initialized
  - lastProbeTime: null
    lastTransitionTime: "2019-01-29T20:10:41Z"
    status: "True"
    type: Ready
  - lastProbeTime: null
    lastTransitionTime: "2019-01-29T20:10:41Z"
    status: "True"
    type: ContainersReady
  - lastProbeTime: null
    lastTransitionTime: "2019-01-29T20:10:34Z"
    status: "True"
    type: PodScheduled
  containerStatuses:
  - containerID: docker://2a13d8fa9bbf5b525987e0862db535c514e58f7d79022783439b945d666187f9
    image: istio/proxyv2:1.0.2
    imageID: docker-pullable://istio/proxyv2@sha256:54e206530ba6ca9b3820254454e01b7592e9f986d27a5640b6c03704b3b68332
    lastState: {}
    name: istio-proxy
    ready: true
    restartCount: 0
    state:
      running:
        startedAt: "2019-01-29T20:10:39Z"
  - containerID: docker://436dd20709ade17e98c57eaa9736fe39473a3cfad4b0126aa2afa3889f5cc35b
    image: sha256:6cb5d12d6ec5e0f951a54fa344c9646fbb96287fb6b0129388b75a6342b67157
    imageID: docker-pullable://gcr.io/knative-releases/github.com/knative/serving/cmd/queue@sha256:fc49125cb29f7bb2de2c4d6bd51153ce190cb522cf42df59898147d2074885cc
    lastState: {}
    name: queue-proxy
    ready: true
    restartCount: 0
    state:
      running:
        startedAt: "2019-01-29T20:10:38Z"
  - containerID: docker://9fd5928296cc4d59b19fef70b66f8cbdab6a0f4a1409545d19de44f0314def22
    image: pritidesai/nodejs-runtime@sha256:108a992bba41d130e04ef54540dfa2522bfa3d67493336b402999f5046faceaf
    imageID: docker-pullable://pritidesai/nodejs-runtime@sha256:108a992bba41d130e04ef54540dfa2522bfa3d67493336b402999f5046faceaf
    lastState: {}
    name: user-container
    ready: true
    restartCount: 0
    state:
      running:
        startedAt: "2019-01-29T20:10:38Z"
  hostIP: 192.168.65.3
  initContainerStatuses:
  - containerID: docker://5c07aff123165620f1b7f3804660d0548e4cf2c76a7512b393e6ca545118f02f
    image: istio/proxy_init:1.0.2
    imageID: docker-pullable://istio/proxy_init@sha256:e16a0746f46cd45a9f63c27b9e09daff5432e33a2d80c8cc0956d7d63e2f9185
    lastState: {}
    name: istio-init
    ready: true
    restartCount: 0
    state:
      terminated:
        containerID: docker://5c07aff123165620f1b7f3804660d0548e4cf2c76a7512b393e6ca545118f02f
        exitCode: 0
        finishedAt: "2019-01-29T20:10:36Z"
        reason: Completed
        startedAt: "2019-01-29T20:10:36Z"
  phase: Running
  podIP: 10.1.1.28
  qosClass: Burstable
  startTime: "2019-01-29T20:10:34Z"
```
</details>

```bash
kubectl logs nodejs-runtime-00001-deployment-78c4bc59bd-plc6q -c user-container
```
<details>
  <summary>Logs 'user-container'</summary> 

```
Hello World from NodeJS runtime
[wrapEndpoint] exception caught Cannot read property 'run' of undefined
Internal system error: System not ready, status is running.
```
</details>

```bash
kubectl logs nodejs-runtime-00001-deployment-78c4bc59bd-plc6q -c istio-proxy
```
<details>
  <summary>Logs 'istio-proxy'</summary> 
  
```
[2019-01-29 20:10:40.456][18][info][config] external/envoy/source/server/listener_manager_impl.cc:908] all dependencies initialized. starting workers
[2019-01-29T20:10:41.858Z] "POST /run HTTP/1.1" 500 - 0 39 44 43 "192.168.65.3, 127.0.0.1" "curl/7.54.0" "93c1327e-d205-9bcd-af33-b68b411b63ce" "nodejs-runtime.default.example.com" "127.0.0.1:8012"
[2019-01-29T20:10:41.935Z] "POST /run HTTP/1.1" 403 - 0 48 18 9 "192.168.65.3, 127.0.0.1" "curl/7.54.0" "93c1327e-d205-9bcd-af33-b68b411b63ce" "nodejs-runtime.default.example.com" "127.0.0.1:8012"
```
</details>

```bash
kubectl logs nodejs-runtime-00001-deployment-78c4bc59bd-plc6q -c queue-proxy
```
<details>
  <summary>Logs 'queue-proxy': Error!!!</summary> 

```
{"level":"info","ts":"2019-01-29T20:10:38.743Z","caller":"logging/config.go:96","msg":"Successfully created the logger.","knative.dev/jsonconfig":"{\n  \"level\": \"info\",\n  \"development\": false,\n  \"outputPaths\": [\"stdout\"],\n  \"errorOutputPaths\": [\"stderr\"],\n  \"encoding\": \"json\",\n  \"encoderConfig\": {\n    \"timeKey\": \"ts\",\n    \"levelKey\": \"level\",\n    \"nameKey\": \"logger\",\n    \"callerKey\": \"caller\",\n    \"messageKey\": \"msg\",\n    \"stacktraceKey\": \"stacktrace\",\n    \"lineEnding\": \"\",\n    \"levelEncoder\": \"\",\n    \"timeEncoder\": \"iso8601\",\n    \"durationEncoder\": \"\",\n    \"callerEncoder\": \"\"\n  }\n}\n"}
{"level":"info","ts":"2019-01-29T20:10:38.743Z","caller":"logging/config.go:97","msg":"Logging level set to info"}
{"level":"info","ts":"2019-01-29T20:10:38.743Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_POD=nodejs-runtime-00001-deployment-78c4bc59bd-plc6q","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.743Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_CONFIGURATION=nodejs-runtime","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.743Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_NAMESPACE=default","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.743Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_REVISION=nodejs-runtime-00001","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.743Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_AUTOSCALER=autoscaler","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.744Z","logger":"queueproxy","caller":"util/env.go:33","msg":"SERVING_AUTOSCALER_PORT=8080","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.744Z","logger":"queueproxy","caller":"util/env.go:43","msg":"SERVING_AUTOSCALER_PORT=8080","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.744Z","logger":"queueproxy","caller":"util/env.go:33","msg":"CONTAINER_CONCURRENCY=0","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.744Z","logger":"queueproxy","caller":"util/env.go:43","msg":"CONTAINER_CONCURRENCY=0","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.744Z","logger":"queueproxy","caller":"util/env.go:33","msg":"REVISION_TIMEOUT_SECONDS=300","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.744Z","logger":"queueproxy","caller":"util/env.go:43","msg":"REVISION_TIMEOUT_SECONDS=300","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.744Z","logger":"queueproxy","caller":"util/env.go:33","msg":"USER_PORT=8080","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.744Z","logger":"queueproxy","caller":"util/env.go:43","msg":"USER_PORT=8080","commit":"4d198db"}
{"level":"info","ts":"2019-01-29T20:10:38.745Z","logger":"queueproxy","caller":"queue/main.go:291","msg":"Initializing OpenCensus Prometheus exporter.","commit":"4d198db","knative.dev/key":"default/nodejs-runtime-00001","knative.dev/pod":"nodejs-runtime-00001-deployment-78c4bc59bd-plc6q"}
{"level":"info","ts":"2019-01-29T20:10:38.745Z","logger":"queueproxy","caller":"queue/main.go:306","msg":"Connecting to autoscaler at ws://autoscaler.knative-serving:8080","commit":"4d198db","knative.dev/key":"default/nodejs-runtime-00001","knative.dev/pod":"nodejs-runtime-00001-deployment-78c4bc59bd-plc6q"}
{"level":"error","ts":"2019-01-29T20:10:39.746Z","logger":"queueproxy","caller":"queue/main.go:114","msg":"Error while sending stat{error 25 0  connection has not yet been established}","commit":"4d198db","knative.dev/key":"default/nodejs-runtime-00001","knative.dev/pod":"nodejs-runtime-00001-deployment-78c4bc59bd-plc6q","stacktrace":"main.statReporter\n\t/usr/local/google/home/mattmoor/go/src/github.com/knative/serving/cmd/queue/main.go:114"}
{"level":"error","ts":"2019-01-29T20:10:40.746Z","logger":"queueproxy","caller":"queue/main.go:114","msg":"Error while sending stat{error 25 0  connection has not yet been established}","commit":"4d198db","knative.dev/key":"default/nodejs-runtime-00001","knative.dev/pod":"nodejs-runtime-00001-deployment-78c4bc59bd-plc6q","stacktrace":"main.statReporter\n\t/usr/local/google/home/mattmoor/go/src/github.com/knative/serving/cmd/queue/main.go:114"}
```
</details>
