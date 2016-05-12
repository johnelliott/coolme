var debug = require('debug')('coolme:add-glasses')
var gm = require('gm')
var fs = require('fs')

// $ gm composite -geometry +10+80 glasses.png ./face.jpg 10out.jpg
// $ cat face.jpg | gm composite -monitor -geometry +10+80 glasses.png - -

const glassesPath = './glasses.png'
const glassesOffset = { x: -47, y: 12 } // offset of the static asset to appear centered
const glassesLength = 50 // length in pixels of the lenses center-to-center

module.exports = function(eyes, face, callback) {
  // Use second eye because it's determinisitc when using test image)
  debug('eyesCenter', eyesCenter(eyes))
  debug('eyesLength', eyesLength(eyes))

  const scale = eyesLength(eyes) / glassesLength
  const scalePercentage = Math.floor(100*scale)
  debug('scale', scale)
  debug('scalePercentage', scalePercentage)

  const glassesTarget = eyesCenter(eyes)
  const glassesPosition = {
    x: glassesOffset.x + glassesTarget.x*scale,
    y: glassesOffset.y + glassesTarget.y*scale
  }

  const offset = `+${glassesPosition.x}+${glassesPosition.y}`
  debug('offset', offset)
  // TODO add glasses scaling

  // add glasses
  gm(face, 'face.jpg')
  .composite(glassesPath)
  .geometry(`${scalePercentage}% ${offset}`)
  .toBuffer('JPG', function (err, buffer) {
    if (err) {
      return callback(err);
    }
    //debug('made buffer with sunnies done!', buffer)
    debug('got composite buffer')
    callback(null, buffer)
  })
}


// TODO test the math
function eyesCenter(eyepair) {
  if (eyepair.length !== 2) throw new Error('wrong number of eyes in array')
  const x = (eyepair[0].x + eyepair[1].x) / 2
  const y = (eyepair[0].y + eyepair[1].y) / 2
  return { x, y }
}

// TODO test the math
function eyesLength(eyepair) {
  if (eyepair.length !== 2) throw new Error('wrong number of eyes in array')
  const deltaX = Math.abs(eyepair[0].x - eyepair[1].x)
  const deltaY = Math.abs(eyepair[0].y - eyepair[1].y)
  const length = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
  return length
}
