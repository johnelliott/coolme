var util = require('util')
var stream = require('stream')
var cv = require('opencv')
var debug = require('debug')('coolme:s-stream')

function SunniesTransform() {
  stream.Transform.call(this, {objectMode: true})
  this.tailPromise = Promise.resolve()
}

util.inherits(SunniesTransform, stream.Transform)

SunniesTransform.prototype._transform = function(buf, encoding, callback) {
  var self = this //sry...
  var prom = new Promise(function(resolve, reject) {
    process(buf, function(err, image){
      if (err) {
        reject(err)
        return self.emit('error', err)
      }
      self.push(image)
      callback()
      resolve()
    })
  })
  this.tailPromise = this.tailPromise.then(function() {
    return prom
  })
}

SunniesTransform.prototype._flush = function(callback) {
  this.tailPromise.then(function() {
    callback()
  })
}

// TODO rename and move out
function process(chunk, callback) {
  cv.readImage(chunk, function(err, im){
    if (err) {
      reject(err)
      //throw err
    }
    debug('im', im)
    if (im.width() < 1 || im.height() < 1) throw new Error('image has no size');

    const model = 'node_modules/opencv/data/haarcascade_eye_tree_eyeglasses.xml'
    im.detectObject(model, {}, function(err, eyepairs) {
      if (err) {
        console.error("Error:", err);
        throw err;
      }
      debug('eyepairs', eyepairs)

      for (var i = 0; i < eyepairs.length; i++) {
        var eyepair = eyepairs[i];
        im.ellipse(eyepair.x + eyepair.width / 2,
                   eyepair.y + eyepair.height / 2,
                   eyepair.width / 2,
                   eyepair.height / 2, [0,0,0]);
      }
      callback(null, im.toBuffer())
    })
  })
}

module.exports = function() { return new SunniesTransform() }
