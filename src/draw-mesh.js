'use strict'

var show = require('ndarray-show')

module.exports = function drawMesh (v, mesh) {

  var x, y, xy, i, j
  var n = mesh.shape[2]
  var m = mesh.shape[0]
  var ctx = v.ctx

  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'
  for (j = 0; j < m; j++) {
    ctx.beginPath()
    xy = mesh.pick(j)
    x = xy.pick(0)
    y = xy.pick(1)

    ctx.moveTo(v.x2i(x.get(0)), v.y2j(y.get(0)))
    for (i = 0; i < n; i++) {
      ctx.lineTo(v.x2i(x.get(i)), v.y2j(y.get(i)))
    }
    ctx.lineTo(v.x2i(x.get(0)), v.y2j(y.get(0)))
    ctx.stroke()
  }

  for (i = 0; i < n; i++) {
    x = mesh.pick(null, 0, i)
    y = mesh.pick(null, 1, i)

    ctx.beginPath()
    ctx.moveTo(v.x2i(x.get(0)), v.y2j(y.get(0)))
    for (j = 0; j < m; j++) {
      ctx.lineTo(v.x2i(x.get(j)), v.y2j(y.get(j)))
    }
    ctx.stroke()
  }
}
