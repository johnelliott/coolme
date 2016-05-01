var debug = require('debug')('coolme')
var http = require('http');
var fs = require('fs');
var dup = require('./sunnies-stream.js');
var MatStream = require('opencv-image-stream')

var staticServer = require('ecstatic')({ root: __dirname + '/public' });

var server = http.createServer(function(req, res) {
  var matStream = new MatStream()
  var sunnies = dup()
  //all the logs!
  //matStream.on('end', ()=>{ debug('matStream end') })
  //matStream.on('finish', ()=>{ debug('matStream finish') })
  //sunnies.on('end', ()=>{ debug('sunnies end') })
  //sunnies.on('finish', ()=>{ debug('sunnies finish') })

  if (req.method === 'POST') {
    req.pipe(matStream).pipe(sunnies).pipe(res);
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
