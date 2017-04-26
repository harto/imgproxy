const assert = require('chai').assert;
const http = require('http');
const server = require('../lib/server');

describe('server', () => {
  before(() => server.listen(7890));
  after(() => server.close());

  describe('GET /', () => {
    it('returns empty 200 response', () =>
      get('/').
      then((resp) => {
        assert.equal(resp.statusCode, 200);
        assert.isUndefined(resp.body);
      }));
  });

  describe('GET /image', () => {
    it('requires a `url` parameter', () =>
      get('/image').
      then((resp) => {
        assert.equal(resp.statusCode, 400);
        assert.equal(resp.statusMessage, 'missing required parameter: url');
      }));
    it('proxies request for http image', () =>
      get(`/image?url=${encodeURIComponent('http://www.fillmurray.com/20/30')}`).
      then((resp) => {
        assert.equal(resp.statusCode, 200);
        assert.equal(resp.headers['content-type'], 'image/jpeg');
      }));
    it('proxies request for https image', () =>
      get(`/image?url=${encodeURIComponent('https://www.fillmurray.com/20/30')}`).
      then((resp) => {
        assert.equal(resp.statusCode, 200);
        assert.equal(resp.headers['content-type'], 'image/jpeg');
      }));
    it('handles invalid domain', () =>
      get(`/image?url=${encodeURIComponent('http://')}`).
      then((resp) => {
        assert.equal(resp.statusCode, 500);
      }));
    it('rejects non-http(s) URLs', () =>
      get(`/image?url=${encodeURIComponent('ftp://speedtest.tele2.net/1KB.zip')}`).
      then((resp) => {
        assert.equal(resp.statusCode, 400);
        assert.equal(resp.statusMessage, 'invalid protocol: ftp');
      }));
    // it('handles multiple concurrent connections');
    // it('streams responses');
  });

  describe('nonexistent endpoint', () => {
    it('generates 404 response', () =>
      get('/foo').
      then((resp) => {
        assert.equal(resp.statusCode, 404);
      }));
  });
});

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:7890${path}`, resp => {
      resolve(resp);
    });
  });
}
