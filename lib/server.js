const http = require('http');
const https = require('https');
const parseQuery = require('querystring').parse;
const parseUrl = require('url').parse;

module.exports = http.createServer(handle);

function handle(req, resp) {
  let url = parseUrl(req.url);

  switch(url.pathname) {
    case '/':
      writeResponse(resp, 200);
      break;

    case '/image':
      let params = parseQuery(url.query);
      let imageUrl = params.url;
      if (!imageUrl) {
        writeResponse(resp, 400, 'missing required parameter: url');
        return;
      }
      proxyImageRequest(imageUrl, resp);
      break;

    default:
      writeResponse(resp, 404);
  }
}

function proxyImageRequest(imageUrl, resp) {
  let url = parseUrl(imageUrl);

  let protocol = url.protocol.replace(/:$/, '');
  let client = clientForProtocol(protocol);
  if (!client) {
    writeResponse(resp, 400, `invalid protocol: ${protocol}`);
    return;
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
    writeResponse(resp, 500, e.message);
  });

  req.end();
}

function clientForProtocol(protocol) {
  return protocol === 'http' ? http :
    protocol === 'https' ? https :
    null;
}

function writeResponse(resp, code, message) {
  resp.writeHead(code, message);
  resp.end();
}
