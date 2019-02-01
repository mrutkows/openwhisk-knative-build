#!/bin/sh

curl -H "Host: nodejs-10-action.default.example.com" -d "@data-with-simple-hello.json" -H "Content-Type: application/json" http://localhost/init

curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run



curl -H "Host: nodejs-10-action.default.example.com" -d "@data-with-params-hello.json" -H "Content-Type: application/json" http://localhost/init

curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run

curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -d '{ "name": "Amy", "place": "USA" }' http://localhost/run



curl -H "Host: nodejs-10-action.default.example.com" -d "@data-with-default-params-hello.json" -H "Content-Type: application/json" http://localhost/init

curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run

curl -H "Host: nodejs-10-action.default.example.com" -d "@data-with-date.json" -H "Content-Type: application/json" http://localhost/init

curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run


curl -H "Host: nodejs-10-action.default.example.com" -d "@data-with-env.json" -H "Content-Type: application/json" http://localhost/init

curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run

curl -H "Host: nodejs-10-action.default.example.com" -d "@data-with-date-web.json" -H "Content-Type: application/json" http://localhost/init

curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run

