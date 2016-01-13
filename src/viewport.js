'use strict'

var createFit = require('canvas-fit')

module.exports = viewport

function viewport (id, xmin, xmax, ymin, ymax) {
  this.setBounds(xmin, xmax, ymin, ymax)
  this.computeAspectRatio()

  this.attach(id)
  this.resize()
}

viewport.prototype.resize = function () {
  this.fit()
  this.width = canvas.width
  this.height = canvas.height
}

viewport.prototype.attach = function (id) {
  this.canvas = document.getElementById(id)
  this.fit= createFit(this.canvas)
  this.fit.scale = window.devicePixelRatio

  window.addEventListener('resize', this.resize.bind(this), false)
}

viewport.prototype.setAspectRatio = function (aspectRatio) {
  this.aspectRatio
}

viewport.prototype.setBounds = function (xmin, xmax, ymin, ymax) {
  this.xmin = xmin
  this.xmax = xmax
  this.ymin = ymin
  this.ymax = ymax

  this.iscale = this.width / (this.xmax - this.xmin)
  this.jscale = this.height / (this.ymax - this.ymin)
}

viewport.prototype.computeAspectRatio = function () {
  this.aspectRatio = Math.abs((this.xmax - this.xmin) / (this.ymax - this.ymin))
  return this.aspectRatio
}

viewport.x2i = function (x) {
  return (x - this.xmin) * this.iscale
}

viewport.y2j = function (y) {
  return (y - this.ymin) * this.jscale
}

viewport.dx2di = function (dx) {
  return dx * this.jscale
}

viewport.dy2dj = function (dy) {
  return dy * this.jscale
}
