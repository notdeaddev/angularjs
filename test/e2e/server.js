const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');
const middlewareFactory = require('./tools').middleware;

module.exports = function createServer() {
  const root = path.resolve(__dirname, '../..');
  const staticServer = serveStatic(root);
  const indexServer = serveIndex(root);
  const middleware = middlewareFactory('/e2e');

  return http.createServer(function (req, res) {
    middleware(req, res, function (err) {
      if (err) {
        res.statusCode = 500;
        res.end(err.toString());
        return;
      }

      staticServer(req, res, function (staticErr) {
        if (staticErr) {
          if (staticErr.status === 404 && /^\/build\/docs\//.test(req.url) && !path.extname(req.url)) {
            req.url = '/build/docs/index-test.html';
            staticServer(req, res, function (err) {
              if (err) {
                res.statusCode = err.status || 500;
                res.end(err.message);
              }
            });
            return;
          }

          res.statusCode = staticErr.status || 500;
          res.end(staticErr.message);
          return;
        }

        indexServer(req, res, function () {
          res.statusCode = 404;
          res.end('Not Found');
        });
      });
    });
  });
};
