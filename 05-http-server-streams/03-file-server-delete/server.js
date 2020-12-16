const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  var slashSeparator = url.parse(req.url).pathname.split('/').length - 1;

  if (slashSeparator > 1) {
      res.statusCode = 400;
      res.end('Folders are not implemented');
      return;
  }

  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('No such file!');
    return;
  }

  switch (req.method) {
    case 'DELETE':
      if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (err) => {
          if (err) {
            res.statusCode = 500;
            res.end("file delete error!");
            return;
          }
        });
        res.statusCode = 200;
        res.end();
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
