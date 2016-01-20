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
var show = require('ndarray-show')
var linspace = require('ndarray-linspace')

var params = extend({
  naca: '8412',
}, queryString.parse(location.search))

var i
var n = 251
var m = 100
var mesh = pool.zeros([m, 2, n])
var eta = pool.zeros([n + 1])
var dxi = linspace(0.003, m / 50 * 0.01, m)
var xi = pool.zeros([m])

var sum = 0
for (i = 0; i < m; i++) {
  xi.set(i, sum)
  sum += dxi.get(i)
}
initializeMesh(params.naca, eta, mesh.pick(0), n, 10, 10)

marchMesh(eta, xi, mesh)

function draw (v) {
  drawGrid(v, 0.1, 0.1, '#bbb')
  drawMesh(v, mesh)
}

window.onload = function () {
  new Viewport ('canvas', {
    xmin: -0.1,
    xmax: 1.1,
    aspectRatio: 1,
    draw: draw,
  })

}
