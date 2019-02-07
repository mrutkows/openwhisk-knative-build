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

## Intall the BuildTemplate for the NodeJS runtime

```
$ kubectl apply --filename buildtemplate.yaml 
buildtemplate.build.knative.dev/openwhisk-nodejs-runtime created
```

#### Verify BuildTemplate

```
$ kubectl get buildtemplate -o yaml
NAME                       AGE
openwhisk-nodejs-runtime   2h
```

or to see the full resource:
```
$ kubectl get buildtemplate -o yaml
```

<details>
    <summary>Sample output</summary>
    
```
apiVersion: v1
items:
- apiVersion: build.knative.dev/v1alpha1
  kind: BuildTemplate
  metadata:
    annotations:
      kubectl.kubernetes.io/last-applied-configuration {}
    creationTimestamp: "2019-02-07T16:10:46Z"
    generation: 1
    name: openwhisk-nodejs-runtime
    namespace: default
    resourceVersion: "278166"
    selfLink: /apis/build.knative.dev/v1alpha1/namespaces/default/buildtemplates/openwhisk-nodejs-runtime
    uid: ed5bb6e0-2af2-11e9-a25d-025000000001
  spec:
    generation: 1
    parameters:
    - description: name of the image to be tagged and pushed
      name: TARGET_IMAGE_NAME
    - default: latest
      description: tag the image before pushing
      name: TARGET_IMAGE_TAG
    - description: name of the dockerfile
      name: DOCKERFILE
    - default: "false"
      description: flag to indicate debug mode should be on/off
      name: OW_DEBUG
    - description: name of the action
      name: OW_ACTION_NAME
    - description: JavaScript source code to be evaluated
      name: OW_ACTION_CODE
    - default: main
      description: name of the function in the "__OW_ACTION_CODE" to call as the action
        handler
      name: OW_ACTION_MAIN
    - default: "false"
      description: flag to indicate zip function, for zip actions, "__OW_ACTION_CODE"
        must be base64 encoded string
      name: OW_ACTION_BINARY
    steps:
    - args:
      - -c
      - |
        cat <<EOF >> ${DOCKERFILE}
          ENV __OW_DEBUG "${OW_DEBUG}"
          ENV __OW_ACTION_NAME "${OW_ACTION_NAME}"
          ENV __OW_ACTION_CODE "${OW_ACTION_CODE}"
          ENV __OW_ACTION_MAIN "${OW_ACTION_MAIN}"
          ENV __OW_ACTION_BINARY "${OW_ACTION_BINARY}"
        EOF
      command:
      - /busybox/sh
      image: gcr.io/kaniko-project/executor:debug
      name: add-ow-env-to-dockerfile
    - args:
      - --destination=${TARGET_IMAGE_NAME}:${TARGET_IMAGE_TAG}
      - --dockerfile=${DOCKERFILE}
      image: gcr.io/kaniko-project/executor:latest
      name: build-openwhisk-nodejs-runtime
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```
</details>
    
## Building a Knative service using the NodeJS BuildTemplate

TBD

## Running the test cases

### Testcase structure

<table cellpadding="8">
  <tbody>
    <tr valign="top" align="left">
      <th width="180">Name</th>
      <th width="180">Knative Build</th>
      <th width="180">Knative Service</th>
      <th width="300">Description</th>
      <th width="300">Parameters</th>
    </tr>
    <tr align="left" valign="top">
      <td><sub><a href="">helloworld</a></sub></td>
      <td><sub><a href="tests/helloworld/build-helloworld.yaml">build-helloworld.yaml</a></sub></td>
      <td><sub><a href="tests/helloworld/service-helloworld.yaml">service-helloworld.yaml</a></sub></td>
      <td><sub>A simple "Hello world" function with no parameters.</sub></td>
      <td><sub><i>None</i></sub></td>        
    </tr>
    <tr align="left" valign="top">
      <td><sub><a href="">TBD</a></sub></td>
      <td><sub><a href="tests/helloworld/">build-x.yaml</a></sub></td>
      <td><sub><a href="tests/helloworld/">service-x.yaml</a></sub></td>
      <td><sub>TBD</sub></td>
      <td><sub>TBD</sub></td>      
    </tr>
    <tr align="left" valign="top">
      <td><sub><a href="">TBD</a></sub></td>
      <td><sub><a href="tests/helloworld/">build-x.yaml</a></sub></td>
      <td><sub><a href="tests/helloworld/">service-x.yaml</a></sub></td>
      <td><sub>TBD</sub></td>
      <td><sub>TBD</sub></td>        
    </tr>
    <tr align="left" valign="top">
      <td><sub><a href="">TBD</a></sub></td>
      <td><sub><a href="tests/helloworld/">build-x.yaml</a></sub></td>
      <td><sub><a href="tests/helloworld/">service-x.yaml</a></sub></td>
      <td><sub>TBD</sub></td>
      <td><sub>TBD</sub></td>        
    </tr>
    <tr align="left" valign="top">
      <td><sub><a href="">TBD</a></sub></td>
      <td><sub><a href="tests/helloworld/">build-x.yaml</a></sub></td>
      <td><sub><a href="tests/helloworld/">service-x.yaml</a></sub></td>
      <td><sub>TBD</sub></td>
      <td><sub>TBD</sub></td>       
    </tr>
  </tbody>
</table>   

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

TBD
