'use strict'

var createFit = require('canvas-fit')
var extend = require('util-extend')

module.exports = viewport

function viewport (id, options) {
  var opts = extend({
    xmin: -1,
    xmax: 1,
    ymin: -1,
    ymax: 1,
    aspectRatio: undefined,
    draw: null,
  }, options || {})

  this.setAspectRatio(opts.aspectRatio)
  this.setBounds(opts.xmin, opts.xmax, opts.ymin, opts.ymax)
  this.draw = opts.draw

  this.attach(id)
  this.resize()
  this.draw && this.draw(this)
}

viewport.prototype.resize = function () {
  this.fit()
  this.width = canvas.width
  this.height = canvas.height
  this.applyAspectRatio()
  this.computeScale()
  this.ctx = this.canvas.getContext('2d')
}

viewport.prototype.attach = function (id) {
  this.canvas = document.getElementById(id)
  this.fit= createFit(this.canvas)
  this.fit.scale = window.devicePixelRatio
  this.ctx = this.canvas.getContext('2d')

  window.addEventListener('resize', function() {
    this.resize()
    this.draw && this.draw(this)
  }.bind(this), false)
}

viewport.prototype.setAspectRatio = function (aspectRatio) {
  this.aspectRatio = aspectRatio
}

viewport.prototype.applyAspectRatio = function () {
  if (!this.aspectRatio || !this.width || !this.height) return

  var dx = 0.5 * (this.xmax - this.xmin)
  var yc = 0.5 * (this.ymax + this.ymin)
  var dy = dx * this.aspectRatio * this.height / this.width
  this.ymin = yc - dy
  this.ymax = yc + dy

}

viewport.prototype.setBounds = function (xmin, xmax, ymin, ymax) {
  this.xmin = xmin
  this.xmax = xmax
  this.ymin = ymin
  this.ymax = ymax

  this.applyAspectRatio()
  this.computeScale()
}
viewport.prototype.computeScale = function () {
  this.iscale = this.width / (this.xmax - this.xmin)
  this.jscale = this.height / (this.ymin - this.ymax)
}

viewport.prototype.computeAspectRatio = function () {
  return Math.abs((this.xmax - this.xmin) / (this.ymax - this.ymin))
}

viewport.prototype.x2i = function (x) {
  return (x - this.xmin) * this.iscale
}

viewport.prototype.y2j = function (y) {
  return (y - this.ymax) * this.jscale
}

viewport.prototype.dx2di = function (dx) {
  return dx * this.jscale
}

viewport.prototype.dy2dj = function (dy) {
  return dy * this.jscale
}
