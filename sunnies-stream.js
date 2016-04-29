var stream = require('stream')
module.exports = function() {
  return new stream.Transform({
    transform: function(chunk, encoding, next) {
      console.log('transform running')
      this.push(chunk)
      next()
    },
    flush: function(done) {
      this.push('\n')
      done()
    }
})
}
