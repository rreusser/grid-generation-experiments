/* global location, window */
'use strict'

var queryString = require('query-string')
var extend = require('util-extend')
var initializeMesh = require('./initialize-mesh')
var marchMesh = require('./march-mesh')
var drawMesh = require('./draw-mesh')
var pool = require('ndarray-scratch')
var drawGrid = require('./draw-grid')
var Viewport = require('./viewport')
var linspace = require('ndarray-linspace')
var measure = require('./measure')
var prefixSum = require('ndarray-prefix-sum')
var ops = require('ndarray-ops')

var params = extend({
  naca: '8412',
}, queryString.parse(location.search))

// The grid dimensions. n = around, m = outward
var n = 251
var m = 100

// Allocate the grid:
var mesh = pool.zeros([m, 2, n])

// eta is the independent variable around the o-grid:
var eta = pool.zeros([n + 1])

// xi is the independent variable outward:
var xi = pool.zeros([m])
ops.assign(xi.lo(1), linspace(0.003, m * 0.0002, m - 1))
prefixSum(xi)

// Initialize the inner contour:
measure('initialized',function () {
  initializeMesh(params.naca, eta, mesh.pick(0), n, 10, 10)
})

// March the grid outward:
measure('meshed',function () {
  marchMesh(eta, xi, mesh)
})

function draw (v) {
  drawGrid(v, 0.1, 0.1, '#bbb')

  measure('drawn',function () {
    drawMesh(v, mesh)
  })
}

window.onload = function () {
  new Viewport ('canvas', {
    xmin: -0.1,
    xmax: 1.1,
    aspectRatio: 1,
    draw: draw,
  })
}
