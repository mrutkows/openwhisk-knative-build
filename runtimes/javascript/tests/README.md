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
      <th width="33%">Name / Description</th>
      <th width="33%">Knative Resource Templates</th>
      <th width="33%">Runtime Payload Data<br><sub>(e.g., Curl, VSCode, etc.)</sub></th>
    </tr>
    <!-- HelloWorld -->
    <tr align="left" valign="top">
      <td>
        <a href="helloworld">helloworld</a>
        <p><sub>A simple "Hello world" function with no parameters.</sub></p>
      </td>
      <td>
        <ul>
          <li><sub>Build: <a href="helloworld/build.yaml.tmpl">build.yaml.tmpl</a></sub></li>
          <li><sub>Service: <a href="helloworld/build.yaml.tmpl">build.yaml.tmpl</a></sub></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><sub>/init data: <a href="helloworld/data-init.json">data-init.json</a></sub></li>
          <li><sub>/run data: <a href="helloworld/data-run.json">data-run.json</a></sub></li>
        </ul>
      </td>
    </tr>
    <!-- HelloWorld with Params -->
    <tr align="left" valign="top">
      <td>
        <a href="helloworldwithparams">helloworldwithparams</a>
        <p><sub>A simple "Hello world" function with NAME and PLACE parameters passed via params JSON object.</sub></p>
      </td>
      <td>
        <ul>
          <li><sub>Build: <a href="helloworldwithparams/build.yaml.tmpl">build.yaml.tmpl</a></sub></li>
          <li><sub>Service: <a href="helloworldwithparams/service.yaml.tmpl">service.yaml.tmpl</a></sub></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><sub>/init data: <a href="helloworldwithparams/data-init.json">data-init.json</a></sub></li>
          <li><sub>/run data: <a href="helloworldwithparams/data-run.json">data-run.json</a></sub></li>
        </ul>
      </td>
    </tr>
    <!-- HelloWorld with Params from Environment -->
    <tr align="left" valign="top">
      <td>
        <a href="helloworldwithparamsfromenv">helloworldwithparamsfromenv</a>
        <p><sub>A simple "Hello world" function with NAME and PLACE parameters avail. from NodeJS as process environment variables.</sub></p>
      </td>
      <td>
        <ul>
          <li><sub>Build: <a href="helloworldwithparamsfromenv/build.yaml.tmpl">build.yaml.tmpl</a></sub></li>
          <li><sub>Service: <a href="helloworldwithparamsfromenv/service.yaml.tmpl">service.yaml.tmpl</a></sub></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><sub>/init data: <a href="helloworldwithparamsfromenv/data-init.json">data-init.json</a></sub></li>
          <li><sub>/run data: <a href="helloworldwithparamsfromenv/data-run.json">data-run.json</a></sub></li>
        </ul>
      </td>  
    </tr>
    <! =================================================== -->
    <!-- webactionhelloworld -->
    <tr align="left" valign="top">
      <td>
        <a href="webactionhelloworld">webactionhelloworld</a>
        <p><sub></sub></p>
      </td>
      <td>
        <ul>
          <li><sub>Build: <a href="webactionhelloworld/build.yaml.tmpl">build.yaml.tmpl</a></sub></li>
          <li><sub>Service: <a href="webactionhelloworld/service.yaml.tmpl">service.yaml.tmpl</a></sub></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><sub>Knative Payload: <a href="webactionhelloworld/payload-knative-init-run.http">payload-knative-init-run.http</a></sub></li>
          <li><sub>OpenWhisk /init Payload: <a href="webactionhelloworld/payload-openwhisk-init.http">payload-openwhisk-init.http</a></sub></li>
          <li><sub>OpenWhisk /run Payload: <a href="webactionhelloworld/payload-openwhisk-run.http">payload-openwhisk-run.http</a></sub></li>
        </ul>
      </td>  
    </tr>
    <!-- webactionhttpredirect -->
    <tr align="left" valign="top">
      <td>
        <a href="webactionhttpredirect">webactionhttpredirect</a>
        <p><sub></sub></p>
      </td>
      <td>
        <ul>
          <li><sub>Build: <a href="webactionhttpredirect/build.yaml.tmpl">build.yaml.tmpl</a></sub></li>
          <li><sub>Service: <a href="webactionhttpredirect/service.yaml.tmpl">service.yaml.tmpl</a></sub></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><sub>Knative Payload: <a href="webactionhttpredirect/payload-knative-init-run.http">payload-knative-init-run.http</a></sub></li>
          <li><sub>OpenWhisk /init Payload: <a href="webactionhttpredirect/payload-openwhisk-init.http">payload-openwhisk-init.http</a></sub></li>
          <li><sub>OpenWhisk /run Payload: <a href="webactionhttpredirect/payload-openwhisk-run.http">payload-openwhisk-run.http</a></sub></li>
        </ul>
      </td>  
    </tr>
    <!-- webactionjsonparams -->
    <tr align="left" valign="top">
      <td>
        <a href="webactionjsonparams">webactionjsonparams</a>
        <p><sub></sub></p>
      </td>
      <td>
        <ul>
          <li><sub>Build: <a href="webactionjsonparams/build.yaml.tmpl">build.yaml.tmpl</a></sub></li>
          <li><sub>Service: <a href="webactionjsonparams/service.yaml.tmpl">service.yaml.tmpl</a></sub></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><sub>Knative Payload: <a href="webactionjsonparams/payload-knative-init-run.http">payload-knative-init-run.http</a></sub></li>
          <li><sub>OpenWhisk /init Payload: <a href="webactionjsonparams/payload-openwhisk-init.http">payload-openwhisk-init.http</a></sub></li>
          <li><sub>OpenWhisk /run Payload: <a href="webactionjsonparams/payload-openwhisk-run.http">payload-openwhisk-run.http</a></sub></li>
        </ul>
      </td>  
    </tr>
    <!-- webactionsettingcookie -->
    <tr align="left" valign="top">
      <td>
        <a href="webactionsettingcookie">webactionsettingcookie</a>
        <p><sub></sub></p>
      </td>
      <td>
        <ul>
          <li><sub>Build: <a href="webactionsettingcookie/build.yaml.tmpl">TBD</a></sub></li>
          <li><sub>Service: <a href="webactionsettingcookie/service.yaml.tmpl">TBD</a></sub></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><sub>Knative Payload: <a href="webactionsettingcookie/payload-knative-init-run.http">payload-knative-init-run.http</a></sub></li>
          <li><sub>OpenWhisk /init Payload: <a href="webactionsettingcookie/payload-openwhisk-init.http">payload-openwhisk-init.http</a></sub></li>
          <li><sub>OpenWhisk /run Payload: <a href="webactionsettingcookie/payload-openwhisk-run.http">payload-openwhisk-run.http</a></sub></li>
        </ul>
      </td>  
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

otherwise, you can supply the request data and ```Content-Type``` on the command and pass the JSON data to your function via data file:

```
curl -H "Host: <hostname>" -d "@data-init-run.json" -H "Content-Type: application/json" http://localhost/
```

### Running with OW_RUNTIME_PLATFORM set to "openwhisk"

#### Initialize the runtime

Initialize the runtime with the function and other configuration data using the ```/init``` endpoint.

```
curl -H "Host: <hostname>" -d "@data-init.json" -H "Content-Type: application/json" http://localhost/init
```

#### Run the function

Execute the function using the ```/run``` endpoint.

with no request data:

```
curl -H "Host: <hostname>" -X POST http://localhost/run
```

or with request data and its ```Content-Type```:

```
curl -H "Host: <hostname>" -d "@data-run.json" -H "Content-Type: <content-type>" -X POST http://localhost/run
```
# Troubleshooting

## Pod will not Terminate

In some cases, you may need to force the pod to be deleted when the normal delete shown below does not work.
```
# Normal service delete
kubectl delete -f service.yaml
```

you will see something like the following for a long period of time:
```
$ kubectl get pods --namespace default

NAME                                                  READY   STATUS      RESTARTS   AGE
nodejs-helloworld-00001-deployment-78c6bfbf4c-8cgtd   2/3     Terminating  0         81s
```

In this case, you can force the pod with your service to delete as follows:
```
kubectl delete pod nodejs-helloworld-00001-deployment-78c6bfbf4c-8cgtd --grace-period=0 --force
```

Also, be sure your service is completely deleted from the system:
```
kubectl delete -f service.yaml
```

<!--
## Runtime creation & deletion

Prior to starting each test, a fresh Runtime container is required since (by default) each can only be initialized once (i.e., /init entrypoint called once with a single function source code).  Conversely, the runtime once run with a test needs to be deleted for the next test. Each test indicates which Service YAML you need to "apply" or "delete" to assure a fresh runtime.
-->
