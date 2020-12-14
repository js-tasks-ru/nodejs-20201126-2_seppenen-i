const url = require('url');
const http = require('http');
const path = require('path');
var fs = require('fs'); 

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  var slashSeparator = url.parse(req.url).pathname.split('/').length - 1;
  if (slashSeparator > 1) {
      //console.log('I am here!');
      res.statusCode = 400;
      res.end('Folders is not implemented');
      return;
  }

  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('No such file');
  }

  switch (req.method) {
    case 'GET':
      var readStream = fs.createReadStream(filepath);

      readStream.on('error', function() {
        res.statusCode = 500;
        res.end();
      })

      readStream.pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
