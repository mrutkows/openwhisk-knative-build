# Tests for OpenWhisk NodeJS Runtime using Knative

## Test summary

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
      <td><sub><a href="tests/helloworld/build.yaml.tmpl">build.yaml.tmpl</a></sub></td>
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

# Running the Tests

## Runtime creation & deletion

Prior to starting each test, a fresh Runtime container is required since (by default) each can only be initialized once (i.e., /init entrypoint called once with a single function source code).  Conversely, the runtime once run with a test needs to be deleted for the next test. Each test indicates which Service YAML you need to "apply" or "delete" to assure a fresh runtime.
