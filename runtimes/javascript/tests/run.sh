#!/bin/sh

curl -H "Host: nodejs-10-action.default.example.com" -d "@data-with-simple-hello.json" -H "Content-Type: application/json" http://localhost/init

curl -H "Host: nodejs-10-action.default.example.com" -H "Content-Type: application/json" -X POST http://localhost/run
