# OpenWhisk NodeJS Runtime using Knative

## Pre-requisite:

- Clone this repo:

```bash
git clone https://github.com/mrutkows/openwhisk-knative-build.git
cd runtimes/javascript/
```

- Create Docker Secret and Service Account:

```bash
kubectl apply -f docker-secret.yaml
kubectl apply -f service-account.yaml
```

## How to run tests?

#### Hello World Action

Replace `{DOCKER_USERNAME}` with your own docker username in `serivce.yaml`. 

```bash
kubectl apply -f service.yaml
```

Init the action:

```bash
curl -H "Host: nodejs-10-action.default.example.com" -d "@tests/data-with-simple-hello.json" -H "Content-Type: application/json" http://localhost/init
{"OK":true}
```

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

Run:

```bash
curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run
{"payload":"Hello"};
```

Delete:

```bash
kubectl delete -f service.yaml
```

#### Hello World with Params

Initiate service:

```bash
kubectl apply -f service.yaml
```

Init the action:

```bash
curl -H "Host: nodejs-10-action.default.example.com" -d "@tests/data-with-params-hello-env.json" -H "Content-Type: application/json" http://localhost/init
{"OK":true}
```

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

Run:

```bash
curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST -d '{ "name": "Amy", "place": "Spain" }'  http://localhost/run
{"payload":"Hello, Amy from Spain"}
```

Delete:

```bash
kubectl delete -f service.yaml
```

#### Hello World with Params in Service YAML

Initiate service:

Replace `{DOCKER_USERNAME}` with your own docker username in `serivce-with-env.yaml`. 

```bash
kubectl apply -f service-with-env.yaml
```

Initiate the action:

```bash
curl -H "Host: nodejs-10-action.default.example.com" -d "@tests/data-with-params-hello-env-service.json" -H "Content-Type: application/json" http://localhost/init
{"OK":true}
```

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

Run:

```bash
curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run
{"payload":"Hello, Amy from Spain"}
```

Delete:

```bash
kubectl delete -f service-with-env.yaml
```
