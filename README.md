imgproxy
========

A basic HTTP image proxy server implemented in Node.js.


Deployment
----------

Deployment is a (partly) manual process:

 * launch an (e.g.) EC2 instance with unrestricted access to a port of your
   choice (server listens on `8888` by default)

 * clone the repo:
 ```
 $ git clone git@bitbucket.org:harto/imgproxy.git
 $ #TODO
 ```


Run
---

To start listening on port `8888`:
```
$ node server.js
```

(Set `PORT` to something else as required.)


Development
-----------

Run unit tests:
```
$ npm test
```
or
```
$ yarn test
```

A basic set of system tests can be run against the locally-running service:
```
$ bin/test
```
