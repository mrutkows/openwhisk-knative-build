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

# Tests for OpenWhisk NodeJS Runtime using Knative

## Test summary

<table cellpadding="8">
  <tbody>
    <tr valign="top" align="left">
      <th width="180">Name</th>
      <th width="180">Knative Build</th>
      <th width="180">Knative Service</th>
      <th width="300">init data</th>
      <th width="300">Description</th>
    </tr>
    <tr align="left" valign="top">
      <td><sub><a href="helloworld">helloworld</a></sub></td>
      <td><sub><a href="helloworld/build.yaml.tmpl">build.yaml.tmpl</a></sub></td>
      <td><sub><a href="helloworld/service.yaml.tmpl">service-helloworld.yaml</a></sub></td>
      <td><sub><a href="helloworld/init-data-helloworld.json">init-data-helloworld.json</a></sub></td>
      <td><sub>A simple "Hello world" function with no parameters.</sub></td>
    </tr>
    <tr align="left" valign="top">
      <td><sub><a href="helloworldwithparams">helloworldwithparams</a></sub></td>
      <td><sub><a href="helloworldwithparams/build.yaml.tmpl">build.yaml.tmpl</a></sub></td>
      <td><sub><a href="helloworldwithparams/service.yaml.tmpl">service-helloworld.yaml</a></sub></td>
      <td><sub><a href="helloworldwithparams/init-data-helloworld.json">init-data-helloworld.json</a></sub></td>
      <td><sub>A simple "Hello world" function with NAME and PLACE parameters passed via params JSON object.</sub></td>
    </tr>
    <tr align="left" valign="top">
      <td><sub><a href="helloworldwithparamsfromenv">helloworldwithparamsfromenv</a></sub></td>
      <td><sub><a href="helloworldwithparamsfromenv/build.yaml.tmpl">build.yaml.tmpl</a></sub></td>
      <td><sub><a href="helloworldwithparamsfromenv/service.yaml.tmpl">service-helloworld.yaml</a></sub></td>
      <td><sub><a href="helloworldwithparamsfromenv/init-data-helloworld.json">init-data-helloworld.json</a></sub></td>
      <td><sub>A simple "Hello world" function with NAME and PLACE parameters avail. from NodeJS as process environment variables.  </sub></td>
    </tr>
  </tbody>
</table>   

# Running the Tests

This is the typical process for running each of the tests under this directory.

### Pre-requisite

```
kubectl get buildtemplate
NAME                       CREATED AT
openwhisk-nodejs-runtime   10m
```

### Configure and Deploy Build YAML 

```
export DOCKER_USERNAME="myusername"
sed 's/${DOCKER_USERNAME}/'"$DOCKER_USERNAME"'/' build.yaml.tmpl > build.yaml
kubectl apply -f build.yaml
```

### Configure and Deploy Service YAML

```
export DOCKER_USERNAME="myusername"
sed 's/${DOCKER_USERNAME}/'"$DOCKER_USERNAME"'/' service.yaml.tmpl > service.yaml
kubectl apply -f service.yaml
```

## Running the Test

Depending on the value you set in [buildtemplate.yaml](../buildtemplate.yaml) for the ```OW_RUNTIME_PLATFORM``` parameter, you will need to invoke different endpoints to execute the test.

### Running with OW_RUNTIME_PLATFORM set to "knative"

#### Invoke '/' endpoint on the Service

If your function requires no input data on the request:

```
curl -H "Host: <hostname>" -X POST http://localhost/
```

otherwise, you can supply the request data and ```Content-Type``` on the command. For example, you can pass in JSON data to your function:

```
curl -H "Host: <hostname>" -d '{"value": {"name": "Joe", "place": "TX"}}' -H "Content-Type: application/json" http://localhost/
```

### Running with OW_RUNTIME_PLATFORM set to "openwhisk"

#### Initialize the runtime

Initialize the runtime with the function and other configuration data using the ```/init``` endpoint.

```
curl -H "Host: <hostname>" -d "@<request-init-data-filename>.json" -H "Content-Type: application/json" http://localhost/init
```

#### Run the function

Execute the function using the ```/run``` endpoint.

with no request data:

```
curl -H "Host: <hostname>" -X POST http://localhost/run
```

or with request data and its ```Content-Type```:

```
curl -H "Host: <hostname>" -d "@<request-run-data-filename>" -H "Content-Type: <content-type>" -X POST http://localhost/run
```

## Runtime creation & deletion

Prior to starting each test, a fresh Runtime container is required since (by default) each can only be initialized once (i.e., /init entrypoint called once with a single function source code).  Conversely, the runtime once run with a test needs to be deleted for the next test. Each test indicates which Service YAML you need to "apply" or "delete" to assure a fresh runtime.
