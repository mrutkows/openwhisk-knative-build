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

# Hello World with Params from Env. Test for OpenWhisk NodeJS Runtime using Knative

# Running the Test

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

Depending on the value you set in [builttemplate.yaml](https://github.com/mrutkows/openwhisk-knative-build/blob/master/runtimes/javascript/buildtemplate.yaml) for the ```OW_RUNTIME_PLATFORM``` parameter, you will need to invoke different endpoints to execute the test.

### Running with OW_RUNTIME_PLATFORM set to "knative"

#### Invoke / endpoint on the Service

```
curl -H "Host: nodejs-helloworld-with-params-from-env.default.example.com" -X POST http://localhost/
```

### Running with OW_RUNTIME_PLATFORM set to "openwhisk"

#### Initialize the runtime

Initialize the runtime with the function and other configuration data using the ```/init``` endpoint.

```
curl -H "Host: nodejs-helloworld-with-params-from-env.default.example.com" -d "@init-data-helloworld.json" -H "Content-Type: application/json" http://localhost/init

{"OK":true}
```

#### Run the function

Execute the function using the ```/run``` endpoint.

```
curl -H "Host: nodejs-helloworld-with-params-from-env.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run

{"payload":"Hello Joe from TX!"};
```
