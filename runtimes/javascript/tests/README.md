# Tests for OpenWhisk NodeJS Runtime using Knative

## Test summary

- Hello World no Parameters
- Hello World with Parameters in requesst body
- Hello World with Params in Service YAML

# Running the Tests

## Runtime creation & deletion

Prior to starting each test, a fresh Runtime container is required since each can only be initialized once (i.e., /init entrypoint called once with a single function source code).  Conversely, the runtime once run with a test needs to be deleted for the next test. Each test indicates which Service YAML you need to "apply" or "delete" to assure a fresh runtime.

## Tests

### Hello World no Parameters

A simple "Hello world" function with no parameters.

#### Initialize the runtime
```bash
kubectl apply -f service.yaml
```
<details>
    <summary>Sample /init output</summary>
    
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

#### /init

```bash
curl -H "Host: nodejs-10-action.default.example.com" -d "@tests/data-with-simple-hello.json" -H "Content-Type: application/json" http://localhost/init
{"OK":true}
```
<details>
    <summary>/init data</summary>
    
```bash
cat tests/data-with-simple-hello.json
{
    "value": {
        "name" : "helloNodeJS",
        "main" : "main",
        "binary": false,
        "code" : "function main() {return {payload: 'Hello'};}"
    }
}
```
</details>

<details>
    <summary>Debug output</summary>

```bash
**************************
DEBUGGER: I am inside service.initCode()
**************************
DEBUGGER: Status is
ready
**************************
DEBUGGER: I am inside NodeActionRunner
**************************
DEBUGGER: callback
{ completed: undefined, next: [Function: next] }
**************************
DEBUGGER: user code runner
NodeActionRunner { userScriptMain: undefined, init: [Function], run: [Function] }
**************************
DEBUGGER: I am inside NodeActionRunner.init
**************************
DEBUGGER: I am inside else condition, evaluating plain JS file, userScriptMain
[Function: main]
**************************
DEBUGGER: userScriptMain
[Function: main]
**************************
DEBUGGER: req.body
{ value:
   { name: 'helloNodeJS',
     main: 'main',
     binary: false,
     code: 'function main() {return {payload: \'Hello\'};}' } }
DEBUGGER: req.url
/init
DEBUGGER: req.method
POST
DEBUGGER: req.params
{}
DEBUGGER: req.query
{}
**************************
DEBUGGER: res
[Function: status]
**************************
DEBUGGER: Returning 200
{ name: 'helloNodeJS',
  main: 'main',
  binary: false,
  code: 'function main() {return {payload: \'Hello\'};}' }
```
</details>

#### /run

```bash
curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run
{"payload":"Hello"};
```

<details>
    <summary>Debug output</summary>
    
```bash
**************************
DEBUGGER: I am inside service.runCode()
**************************
DEBUGGER: Status is
ready
**************************
DEBUGGER: Req is
DEBUGGER: req.body
{}
DEBUGGER: req.url
/run
DEBUGGER: req.method
POST
DEBUGGER: req.params
{}
DEBUGGER: req.query
{}
**************************
DEBUGGER: I am inside doRun
**************************
DEBUGGER: msg from doRun
{}
**************************
DEBUGGER: I am inside NodeActionRunner.run
**************************
DEBUGGER: args
undefined
**************************
DEBUGGER: result
{ payload: 'Hello' }
**************************
DEBUGGER: req.body
{}
DEBUGGER: req.url
/run
DEBUGGER: req.method
POST
DEBUGGER: req.params
{}
DEBUGGER: req.query
{}
**************************
DEBUGGER: res
[Function: status]
XXX_THE_END_OF_A_WHISK_ACTIVATION_XXX
XXX_THE_END_OF_A_WHISK_ACTIVATION_XXX
**************************
DEBUGGER: Result is
{ payload: 'Hello' }
```
</details>

#### Delete the runtime

```bash
kubectl delete -f service.yaml
```

### Hello World with Parameters in request body

#### Initialize the runtime
```bash
kubectl apply -f service.yaml
```

#### /init

```bash
curl -H "Host: nodejs-10-action.default.example.com" -d "@tests/data-with-params-hello-env.json" -H "Content-Type: application/json" http://localhost/init
{"OK":true}
```

<details>
    <summary>/init data</summary>
    
```bash
cat tests/data-with-params-hello-env.json
{
    "value": {
        "name" : "helloNodeJSWithParams",
        "main" : "main",
        "binary": false,
        "code" : "function main() {\n    msg = \"Hello, \" + process.env.__OW_NAME + \" from \" + process.env.__OW_PLACE;\n    console.log(msg)\n    return { payload:  msg };\n}\n"
    }
}
```

<details>
    <summary>Debug output</summary>

```bash
**************************
DEBUGGER: I am inside service.initCode()
**************************
DEBUGGER: Status is
ready
**************************
DEBUGGER: I am inside NodeActionRunner
**************************
DEBUGGER: callback
{ completed: undefined, next: [Function: next] }
**************************
DEBUGGER: user code runner
NodeActionRunner { userScriptMain: undefined, init: [Function], run: [Function] }
**************************
DEBUGGER: I am inside NodeActionRunner.init
**************************
DEBUGGER: I am inside else condition, evaluating plain JS file, userScriptMain
[Function: main]
**************************
DEBUGGER: userScriptMain
[Function: main]
**************************
DEBUGGER: req.body
{ value:
   { name: 'helloNodeJSWithParams',
     main: 'main',
     binary: false,
     code: 'function main() {\n    msg = "Hello, " + process.env.__OW_NAME + " from " + process.env.__OW_PLACE;\n    console.log(msg)\n    return { payload:  msg };\n}\n' } }
DEBUGGER: req.url
/init
DEBUGGER: req.method
POST
DEBUGGER: req.params
{}
DEBUGGER: req.query
{}
**************************
DEBUGGER: res
[Function: status]
**************************
DEBUGGER: Returning 200
{ name: 'helloNodeJSWithParams',
  main: 'main',
  binary: false,
  code: 'function main() {\n    msg = "Hello, " + process.env.__OW_NAME + " from " + process.env.__OW_PLACE;\n    console.log(msg)\n    return { payload:  msg };\n}\n' }
```
</details>

#### /run

```bash
curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST -d '{ "name": "Amy", "place": "Spain" }'  http://localhost/run
{"payload":"Hello, Amy from Spain"}
```

<details>
    <summary>Debug output</summary>

```bash
**************************
DEBUGGER: I am inside service.runCode()
**************************
DEBUGGER: Status is
ready
**************************
DEBUGGER: Req is
DEBUGGER: req.body
{ name: 'Amy', place: 'Spain' }
DEBUGGER: req.url
/run
DEBUGGER: req.method
POST
DEBUGGER: req.params
{}
DEBUGGER: req.query
{}
**************************
DEBUGGER: I am inside doRun
**************************
DEBUGGER: msg from doRun
{ name: 'Amy', place: 'Spain' }
I am inside foreach, trying to set env. variable
name
__OW_NAME
{ TERM_PROGRAM: 'iTerm.app',
  TERM: 'xterm-256color',
  SHELL: '/bin/bash',
  CLICOLOR: '1',
  TMPDIR: '/var/folders/st/hc0yp8lx7kg3brwb6_y79v_m0000gn/T/',
  Apple_PubSub_Socket_Render: '/private/tmp/com.apple.launchd.GrVGhNFEu0/Render',
  TERM_PROGRAM_VERSION: '3.2.7beta4',
  OLDPWD: '/Users/pritidesai/Documents/goworkspace/src/github.com/mrutkows/openwhisk-knative-build/runtimes/javascript/tests',
  TERM_SESSION_ID: 'w2t0p0:1E34A5F2-6A43-484D-9D4A-538852515A84',
  SDKMAN_PLATFORM: 'Darwin',
  SDKMAN_CURRENT_API: 'https://api.sdkman.io/2',
  USER: 'pritidesai',
  SDKMAN_LEGACY_API: 'https://api.sdkman.io/1',
  SSH_AUTH_SOCK: '/private/tmp/com.apple.launchd.bTEC4hRktz/Listeners',
  __CF_USER_TEXT_ENCODING: '0x1F5:0x0:0x0',
  LSCOLORS: 'GxFxCxDxBxegedabagaced',
  PATH: '/Users/pritidesai/Documents/goworkspace/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/go/bin:/opt/X11/bin:/opt/ImageMagick/bin:/Users/pritidesai/apache-maven-3.3.3/bin:/Users/pritidesai/Downloads/gradle-3.1/bin/:/Users/pritidesai/Downloads/scala-2.12.0/bin/',
  PWD: '/Users/pritidesai/Documents/goworkspace/src/github.com/mrutkows/openwhisk-knative-build/runtimes/javascript',
  JAVA_HOME: '/Library/Java/JavaVirtualMachines/jdk1.8.0_60.jdk/Contents/Home',
  LANG: 'en_US.UTF-8',
  SDKMAN_VERSION: '5.1.5+82',
  ITERM_PROFILE: 'Default',
  XPC_FLAGS: '0x0',
  PS1: '\\n\\[\\033[0;31m\\]\\u \\[\\033[0;35m\\]@ \\[\\033[0;32m\\]\\w\\n \\[\\033[0;34m\\][\\#] -> \\[\\e[00m\\]',
  PS2: '| -> \\[\\e[00m\\]',
  XPC_SERVICE_NAME: '0',
  M2_HOME: '/Users/pritidesai/apache-maven-3.3.3',
  SHLVL: '1',
  HOME: '/Users/pritidesai',
  COLORFGBG: '15;0',
  GOROOT: '/usr/local/go',
  ITERM_SESSION_ID: 'w2t0p0:1E34A5F2-6A43-484D-9D4A-538852515A84',
  LOGNAME: 'pritidesai',
  SDKMAN_DIR: '/Users/pritidesai/.sdkman',
  GOPATH: '/Users/pritidesai/Documents/goworkspace',
  SDKMAN_CANDIDATES_DIR: '/Users/pritidesai/.sdkman/candidates',
  OPENWHISK_HOME: '/Users/pritidesai/Documents/goworkspace/src/github.com/apache/incubator-openwhisk',
  DISPLAY: '/private/tmp/com.apple.launchd.qlaIDAy83r/org.macosforge.xquartz:0',
  COLORTERM: 'truecolor',
  _: '/usr/local/bin/node',
  __OW_NAME: 'Amy' }
I am inside foreach, trying to set env. variable
place
__OW_PLACE
{ TERM_PROGRAM: 'iTerm.app',
  TERM: 'xterm-256color',
  SHELL: '/bin/bash',
  CLICOLOR: '1',
  TMPDIR: '/var/folders/st/hc0yp8lx7kg3brwb6_y79v_m0000gn/T/',
  Apple_PubSub_Socket_Render: '/private/tmp/com.apple.launchd.GrVGhNFEu0/Render',
  TERM_PROGRAM_VERSION: '3.2.7beta4',
  OLDPWD: '/Users/pritidesai/Documents/goworkspace/src/github.com/mrutkows/openwhisk-knative-build/runtimes/javascript/tests',
  TERM_SESSION_ID: 'w2t0p0:1E34A5F2-6A43-484D-9D4A-538852515A84',
  SDKMAN_PLATFORM: 'Darwin',
  SDKMAN_CURRENT_API: 'https://api.sdkman.io/2',
  USER: 'pritidesai',
  SDKMAN_LEGACY_API: 'https://api.sdkman.io/1',
  SSH_AUTH_SOCK: '/private/tmp/com.apple.launchd.bTEC4hRktz/Listeners',
  __CF_USER_TEXT_ENCODING: '0x1F5:0x0:0x0',
  LSCOLORS: 'GxFxCxDxBxegedabagaced',
  PATH: '/Users/pritidesai/Documents/goworkspace/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/go/bin:/opt/X11/bin:/opt/ImageMagick/bin:/Users/pritidesai/apache-maven-3.3.3/bin:/Users/pritidesai/Downloads/gradle-3.1/bin/:/Users/pritidesai/Downloads/scala-2.12.0/bin/',
  PWD: '/Users/pritidesai/Documents/goworkspace/src/github.com/mrutkows/openwhisk-knative-build/runtimes/javascript',
  JAVA_HOME: '/Library/Java/JavaVirtualMachines/jdk1.8.0_60.jdk/Contents/Home',
  LANG: 'en_US.UTF-8',
  SDKMAN_VERSION: '5.1.5+82',
  ITERM_PROFILE: 'Default',
  XPC_FLAGS: '0x0',
  PS1: '\\n\\[\\033[0;31m\\]\\u \\[\\033[0;35m\\]@ \\[\\033[0;32m\\]\\w\\n \\[\\033[0;34m\\][\\#] -> \\[\\e[00m\\]',
  PS2: '| -> \\[\\e[00m\\]',
  XPC_SERVICE_NAME: '0',
  M2_HOME: '/Users/pritidesai/apache-maven-3.3.3',
  SHLVL: '1',
  HOME: '/Users/pritidesai',
  COLORFGBG: '15;0',
  GOROOT: '/usr/local/go',
  ITERM_SESSION_ID: 'w2t0p0:1E34A5F2-6A43-484D-9D4A-538852515A84',
  LOGNAME: 'pritidesai',
  SDKMAN_DIR: '/Users/pritidesai/.sdkman',
  GOPATH: '/Users/pritidesai/Documents/goworkspace',
  SDKMAN_CANDIDATES_DIR: '/Users/pritidesai/.sdkman/candidates',
  OPENWHISK_HOME: '/Users/pritidesai/Documents/goworkspace/src/github.com/apache/incubator-openwhisk',
  DISPLAY: '/private/tmp/com.apple.launchd.qlaIDAy83r/org.macosforge.xquartz:0',
  COLORTERM: 'truecolor',
  _: '/usr/local/bin/node',
  __OW_NAME: 'Amy',
  __OW_PLACE: 'Spain' }
**************************
DEBUGGER: I am inside NodeActionRunner.run
**************************
DEBUGGER: args
undefined
Hello, Amy from Spain
**************************
DEBUGGER: result
{ payload: 'Hello, Amy from Spain' }
**************************
DEBUGGER: req.body
{ name: 'Amy', place: 'Spain' }
DEBUGGER: req.url
/run
DEBUGGER: req.method
POST
DEBUGGER: req.params
{}
DEBUGGER: req.query
{}
**************************
DEBUGGER: res
[Function: status]
XXX_THE_END_OF_A_WHISK_ACTIVATION_XXX
XXX_THE_END_OF_A_WHISK_ACTIVATION_XXX
**************************
DEBUGGER: Result is
{ payload: 'Hello, Amy from Spain' }
```
</details>

#### Delete the runtime

```bash
kubectl delete -f service.yaml
```

### Hello World with Params in Service YAML

#### Initialize the runtime

Note: this test requires a a different Kubernetes Service YAML which you must customize.

Replace `{DOCKER_USERNAME}` with your own docker username in `serivce-with-env.yaml`. 

```bash
kubectl apply -f service-with-env.yaml
```

<details>
    <summary>Debug output</summary>

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

#### /init

```bash
curl -H "Host: nodejs-10-action.default.example.com" -d "@tests/data-with-params-hello-env-service.json" -H "Content-Type: application/json" http://localhost/init
{"OK":true}
```

<details>
    <summary>/init data</summary>
```bash
cat tests/data-with-params-hello-env-service.json
{
    "value": {
        "name" : "helloNodeJSWithParams",
        "main" : "main",
        "binary": false,
        "code" : "function main() {\n    msg = \"Hello, \" + process.env.NAME + \" from \" + process.env.PLACE;\n    console.log(msg)\n    return { payload:  msg };\n}\n"
    }
}
```
    </details>
    
<details>
    <summary>Debug output</summary>

```bash
**************************
DEBUGGER: I am inside service.initCode()
**************************
DEBUGGER: Status is
ready
**************************
DEBUGGER: I am inside NodeActionRunner
**************************
DEBUGGER: callback
{ completed: undefined, next: [Function: next] }
**************************
DEBUGGER: user code runner
NodeActionRunner { userScriptMain: undefined, init: [Function], run: [Function] }
**************************
DEBUGGER: I am inside NodeActionRunner.init
**************************
DEBUGGER: I am inside else condition, evaluating plain JS file, userScriptMain
[Function: main]
**************************
DEBUGGER: userScriptMain
[Function: main]
**************************
DEBUGGER: req.body
{ value:
   { name: 'helloNodeJSWithParams',
     main: 'main',
     binary: false,
     code: 'function main() {\n    msg = "Hello, " + process.env.NAME + " from " + process.env.PLACE;\n    console.log(msg)\n    return { payload:  msg };\n}\n' } }
DEBUGGER: req.url
/init
DEBUGGER: req.method
POST
DEBUGGER: req.params
{}
DEBUGGER: req.query
{}
**************************
DEBUGGER: res
[Function: status]
**************************
DEBUGGER: Returning 200
{ name: 'helloNodeJSWithParams',
  main: 'main',
  binary: false,
  code: 'function main() {\n    msg = "Hello, " + process.env.NAME + " from " + process.env.PLACE;\n    console.log(msg)\n    return { payload:  msg };\n}\n' }
```
</details>

#### /run

```bash
curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run
{"payload":"Hello, Amy from Spain"}
```

<details>
    <summary>Debug output</summary>

```bash
**************************
DEBUGGER: I am inside service.runCode()
**************************
DEBUGGER: Status is
ready
**************************
DEBUGGER: Req is
DEBUGGER: req.body
{}
DEBUGGER: req.url
/run
DEBUGGER: req.method
POST
DEBUGGER: req.params
{}
DEBUGGER: req.query
{}
**************************
DEBUGGER: I am inside doRun
**************************
DEBUGGER: msg from doRun
{}
**************************
DEBUGGER: I am inside NodeActionRunner.run
**************************
DEBUGGER: args
undefined
Hello, Amy from Spain
**************************
DEBUGGER: result
{ payload: 'Hello, Amy from Spain' }
**************************
DEBUGGER: req.body
{}
DEBUGGER: req.url
/run
DEBUGGER: req.method
POST
DEBUGGER: req.params
{}
DEBUGGER: req.query
{}
**************************
DEBUGGER: res
[Function: status]
XXX_THE_END_OF_A_WHISK_ACTIVATION_XXX
XXX_THE_END_OF_A_WHISK_ACTIVATION_XXX
**************************
DEBUGGER: Result is
{ payload: 'Hello, Amy from Spain' }
```
</details>
    
#### Delete the runtime

```bash
kubectl delete -f service-with-env.yaml
```
