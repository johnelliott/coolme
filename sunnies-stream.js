var debug = require('debug')('coolme:s-stream')
var util = require('util')
var stream = require('stream')
var cv = require('opencv')
var addGlasses = require('./lib/add-glasses')

function SunniesTransform() {
  stream.Transform.call(this, {objectMode: true})
  this.tailPromise = Promise.resolve()
}
util.inherits(SunniesTransform, stream.Transform)

const model = 'node_modules/opencv/data/haarcascade_eye_tree_eyeglasses.xml'
SunniesTransform.prototype._transform = function(mat, encoding, callback) {
  var self = this //sry...
  var prom = new Promise(function(resolve, reject) {
    mat.detectObject(model, {}, function(err, eyepairs) {
      if (err) {
        console.error("Error:", err)
        reject(err)
        throw err
      }
      debug('eyepairs', eyepairs.length)

      for (var i = 0; i < eyepairs.length; i++) {
        var eyepair = eyepairs[i];
        mat.ellipse(eyepair.x + eyepair.width / 2,
                   eyepair.y + eyepair.height / 2,
                   eyepair.width / 2,
                   eyepair.height / 2);
      }
      addGlasses(eyepairs, mat.toBuffer(), function(err, buffer) {
        if (err) reject(err);
        self.push(buffer)
        resolve()
      })
      //mat.save(`./${new Date()}-debug-out.jpg`) // debug
      //self.push(mat.toBuffer())
    })
    callback()
  })

  this.tailPromise = this.tailPromise.then(function() {
    debug('prom', prom)
    return prom
  })
}

SunniesTransform.prototype._flush = function(callback) {
  this.tailPromise.then(function() {
    callback()
  })
}

module.exports = function() { return new SunniesTransform() }
