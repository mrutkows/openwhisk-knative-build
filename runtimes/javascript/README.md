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

## Pre-requisites

Complete the pre-requisites and Knative installation and configuration instructions in the top-level [README](../../README.md) for this repository.

### Verify your Kubernetes & Knative pods are running

Verify **kube-system**, **istio-system**, and **knative-xxx** pods are all **Running**
```
$ kubectl get pods --all-namespaces 
```
<details>
    <summary>Sample output</summary>
    
```
$ kubectl get pods --all-namespaces 
NAMESPACE          NAME                                            READY   STATUS      RESTARTS   AGE
istio-system       cluster-local-gateway-547467ccf6-p8n72          1/1     Running     1          8d
istio-system       istio-citadel-7d64db8bcf-m7gsj                  1/1     Running     0          8d
istio-system       istio-cleanup-secrets-8lzj4                     0/1     Completed   0          8d
istio-system       istio-egressgateway-6ddf4c8bd6-2dxhc            1/1     Running     1          8d
istio-system       istio-galley-7dd996474-pdd6h                    1/1     Running     1          8d
istio-system       istio-ingressgateway-84b89d647f-cxrwx           1/1     Running     1          8d
istio-system       istio-pilot-86bb4fcbbd-5ns5q                    2/2     Running     0          8d
istio-system       istio-pilot-86bb4fcbbd-vd2xr                    2/2     Running     0          8d
istio-system       istio-pilot-86bb4fcbbd-zstrw                    2/2     Running     0          8d
istio-system       istio-policy-5c4d9ff96b-559db                   2/2     Running     1          8d
istio-system       istio-sidecar-injector-6977b5cf5b-94hj5         1/1     Running     0          8d
istio-system       istio-statsd-prom-bridge-b44b96d7b-kzkzc        1/1     Running     0          8d
istio-system       istio-telemetry-7676df547f-jp952                2/2     Running     1          8d
istio-system       knative-ingressgateway-75644679c7-c2kxj         1/1     Running     1          8d
knative-build      build-controller-658d64d9bd-6qp2c               1/1     Running     0          8d
knative-build      build-webhook-6bb747665f-v8nk2                  1/1     Running     1          8d
knative-eventing   eventing-controller-cfbb757bd-czx99             1/1     Running     0          8d
knative-eventing   in-memory-channel-controller-75d6cc4b77-6c8st   1/1     Running     1          8d
knative-eventing   in-memory-channel-dispatcher-c89db8bb8-phlxw    2/2     Running     7          8d
knative-eventing   webhook-5fbb8dbcc7-nhwp5                        1/1     Running     0          8d
knative-serving    activator-69b8474d6b-58hh2                      2/2     Running     1          8d
knative-serving    autoscaler-6579b57774-cvvzj                     2/2     Running     1          8d
knative-serving    controller-66cd7d99df-hgswh                     1/1     Running     0          8d
knative-serving    webhook-6d9568d-czt8m                           1/1     Running     0          8d
knative-sources    controller-manager-0                            1/1     Running     1          8d
kube-system        coredns-86c58d9df4-ms8qs                        1/1     Running     0          8d
kube-system        coredns-86c58d9df4-x29vt                        1/1     Running     0          8d
kube-system        etcd-docker-desktop                             1/1     Running     3          8d
kube-system        kube-apiserver-docker-desktop                   1/1     Running     3          8d
kube-system        kube-controller-manager-docker-desktop          1/1     Running     5          8d
kube-system        kube-proxy-mltsm                                1/1     Running     0          8d
kube-system        kube-scheduler-docker-desktop                   1/1     Running     5          8d
```
</details>

## Build and Deploy the OpenWhisk Runtime Build Template

### Configure 'service.yaml'

Replace `{DOCKER_USERNAME}` with your own docker username in `service.yaml`.

If you wish to run repeated tests you MAY set an environment variable and use ```sed``` to replace the ```${DOCKER_USERNAME}``` within any of the test's Kubernetes Service YAML files as follows:

```
export DOCKER_USERNAME="myusername"
sed 's/${DOCKER_USERNAME}/'"$DOCKER_USERNAME"'/' service.yaml.tmpl > service.yaml
```

### Deploy the runtime

```bash
kubectl apply -f service.yaml
```

## Setup

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
