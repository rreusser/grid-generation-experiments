'use strict'

module.exports = drawGrid

function drawGrid (viewport, dx, dy, color) {
  var i, ii, j, jj, jlo, jhi, ilo, ihi
  var ctx = viewport.ctx
  var istart = Math.ceil(viewport.xmin / dx)
  var iend = Math.ceil(viewport.xmax / dx)
  var jstart = Math.ceil(viewport.ymin / dy)
  var jend = Math.ceil(viewport.ymax / dy)
  var jinc = Math.sign(jend - jstart)
  var iinc = Math.sign(iend - istart)

  ctx.strokeStyle = color || '#bbb'
  ctx.beginPath()
  jlo = viewport.y2j(viewport.ymin)
  jhi = viewport.y2j(viewport.ymax)
  for (ii = istart; ii < iend; ii += iinc) {
    i = viewport.x2i(ii * dx)
    ctx.moveTo(i, jlo)
    ctx.lineTo(i, jhi)
  }

  ilo = viewport.x2i(viewport.xmin)
  ihi = viewport.x2i(viewport.xmax)
  for (jj = jstart; jj * jinc < jend * jinc; jj += jinc) {
    j = viewport.y2j(jj * dy)
    ctx.moveTo(ilo, j)
    ctx.lineTo(ihi, j)
  }
  ctx.stroke()
}
