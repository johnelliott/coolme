var http = require('http');
var fs = require('fs');
var dup = require('./sunnies-stream.js');

var staticServer = require('ecstatic')({ root: __dirname + '/public' });

var server = http.createServer(function(req, res) {
  if (req.method === 'POST') {
    req.pipe(dup()).pipe(res);
  } else {
    req.addListener('end', function () {
      //TODO specify caching if needed and use in dev mode
      staticServer(req, res);
    }).resume();
  }
});

var port = 3000;
console.log('Listen:', port);
server.listen(port);
