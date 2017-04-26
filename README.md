imgproxy
========

A basic HTTP image proxy server implemented in Node.js.


Provisioning/deployment
-----------------------

Deployment is a mostly manual process:

First, launch an (e.g.) EC2 instance with unrestricted access to a port of your
choice (server listens on `8888` by default).

SSH into the server, and run the following (assuming Ubuntu distro):
```
$ git clone https://bitbucket.org/harto/imgproxy.git
$ cd imgproxy
$ bin/setup-ubuntu
```


Run
---

To start listening on port `8888`:
```
$ npm start
```

(Set `PORT` to something else as required.)

In "production", you could try this:
```
$ nohup npm start &
```


Development
-----------

Run unit tests:
```
$ npm test
```

A basic set of system tests can be run against a locally-running instance:
```
$ bin/test
```
