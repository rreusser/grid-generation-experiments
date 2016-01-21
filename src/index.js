/* global location, window */
'use strict'

var three = require('three')
var show = require('ndarray-show')
var queryString = require('query-string')
var extend = require('util-extend')
var initializeMesh = require('./initialize-mesh')
var drawMesh = require('./draw-mesh')
var pool = require('ndarray-scratch')
var drawGrid = require('./draw-grid')
var Viewport = require('./viewport')
var linspace = require('ndarray-linspace')
var measure = require('./measure')
var prefixSum = require('ndarray-prefix-sum')
var Mesher = require('./mesher')
var ops = require('ndarray-ops')

var params, m, n, mesh, eta, xi, mesher

params = extend({
  naca: '8412',
}, queryString.parse(location.search))

// The grid dimensions. n = around, m = outward
n = 151
m = 80

// Allocate the grid:
mesh = pool.zeros([m, n, 3], 'float32')

// eta is the independent variable around the o-grid:
eta = pool.zeros([n + 1], 'float32')

// xi is the independent variable outward:
xi = pool.zeros([m], 'float32')
ops.assign(xi.lo(1), linspace(0.002, m / 50 * 0.0250, m - 1))
prefixSum(xi)

// Initialize the inner contour:
measure('initialized',function () {
  initializeMesh(params.naca, eta, mesh.pick(0), n, 20, 20)
})

measure('initialized mesher',function () {
  mesher = new Mesher(eta, xi, mesh)
})

measure('meshed',function () {
  mesher.march()
})



var v = new Viewport ('canvas', {
  xmin: -0.1,
  xmax: 1.1,
  ymin: 0.05,
  ymax: 0.05,
  aspectRatio: 1,
  devicePixelRatio: window.devicePixelRatio,
  antialias: false,
})

measure('drawn',function () {
  drawMesh(v, mesh)
  v.dirty = true
})

window.onunload = function () {
  pool.free(mesh)
  pool.free(eta)
  pool.free(xi)
}
