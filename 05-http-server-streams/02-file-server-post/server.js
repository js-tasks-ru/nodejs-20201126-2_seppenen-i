const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");
const LimitSizeStream = require( './LimitSizeStream' );

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

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('File already exists!');
    return;
  }

  switch (req.method) {
    case 'POST':
      var writeStream = fs.createWriteStream(filepath);
      var limitStream = new LimitSizeStream({limit: (1000000)});

      req.pipe( limitStream ).pipe( writeStream );

      limitStream.on('error', function(err) {
        
        if (err.code == 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
        } else {
          res.statusCode = 500;
        }
        res.end(err.code);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        return;
      });

      writeStream.on('error', function() {

        fs.unlinkSync(filepath);

        res.statusCode = 500;
        res.end();
      });

      writeStream.on('finish', function() {

        res.statusCode = 201;
        res.end("File is succesfully created");
        return;
      });

      req.on('error', function() {
        
        fs.unlinkSync(filepath);

        res.statusCode = 500;
        res.end();
        //writeStream.destroy();
        return;
      });

      req.on('aborted', function() {
        fs.unlinkSync(filepath);
        
        res.statusCode = 500;
        res.end();
        //writeStream.destroy();
        return;
        });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
