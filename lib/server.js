const http = require('http');
const https = require('https');
const parseQuery = require('querystring').parse;
const parseUrl = require('url').parse;

module.exports = http.createServer(handle);

function handle(req, resp) {
  let url = parseUrl(req.url);

  switch(url.pathname) {
    case '/':
      resp.writeHead(200);
      resp.end();
      break;

    case '/image':
      let params = parseQuery(url.query);
      let imageUrl = params.url;
      if (!imageUrl) {
        return badRequest('missing required parameter: url', resp);
      }
      proxyImageRequest(imageUrl, resp);
      break;

    default:
      resp.writeHead(404);
      resp.end();
  }
}

function proxyImageRequest(imageUrl, resp) {
  let url = parseUrl(imageUrl);

  let protocol = url.protocol.replace(/:$/, '');
  let client = clientForProtocol(protocol);
  if (!client) {
    return badRequest(`invalid protocol: ${protocol}`, resp);
  }

  let req = client.get(url, (upstreamResp) => {
    // TODO: some basic validation:
    // - Content-Type
    // - ?

    resp.writeHead(upstreamResp.statusCode, upstreamResp.headers);
    // TODO: set buffer max size?
    upstreamResp.pipe(resp);
  });

  req.on('error', (e) => {
    // TODO: some of these should probably result in HTTP 400,
    // e.g. user supplies image URL with a nonexistent domain
    //console.error(`request error: ${e.message}`);
    resp.writeHead(500, e.message);
    resp.end();
  });

  req.end();
}

function clientForProtocol(protocol) {
  return protocol === 'http' ? http :
    protocol === 'https' ? https :
    null;
}

function badRequest(message, resp) {
  resp.writeHead(400, message);
  return resp.end();
}
