# Tests for OpenWhisk NodeJS Runtime using Knative

## Test summary

- Hello World no Parameters
- Hello World with Parameters in requesst body
- Hello World with Params in Service YAML

# Running the Tests

## Runtime creation & deletion

Prior to starting each test, a fresh Runtime container is required since each can only be initialized once (i.e., /init entrypoint called once with a single function source code).  Conversely, the runtime once run with a test needs to be deleted for the next test. Each test indicates which Service YAML you need to "apply" or "delete" to assure a fresh runtime.

## Tests

