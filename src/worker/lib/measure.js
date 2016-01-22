'use strict'

module.exports = measure

function measure (name, cb) {
  var t1, t2
  t1 = window.performance.now()
  cb()
  t2 = window.performance.now()
  console.info(name+' in '+Math.floor(t2-t1)+'ms')
}
