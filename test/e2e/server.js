'use strict';

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

  return http.createServer(function(req, res) {
    if (req.url === '/favicon.ico') {
      res.statusCode = 204;
      return res.end();
    }
    middleware(req, res, function(err) {
      if (err) {
        res.statusCode = 500;
        res.end(err.toString());
        return;
      }

      staticServer(req, res, function(staticErr) {
        if (staticErr) {
          res.statusCode = staticErr.status || 500;
          res.end(staticErr.message);
          return;
        }

        indexServer(req, res, function() {
          res.statusCode = 404;
          res.end('Not Found');
        });
      });
    });
  });
};
