/* global location, window */
'use strict'

//var createFit = require('canvas-fit')
//var queryString = require('query-string')
//var extend = require('util-extend')
//var mesh = require('./create-mesh')
var pool = require('ndarray-scratch')

var v, Viewport = require('./viewport')

//var params = extend({
  //naca: '2412',
  //c: 1
//}, queryString.parse(location.search))


//var n = 100
//var xy = pool.zeros([n, 2])
//var x = xy.pick(null,0)
//var y = xy.pick(null,1)
//var mesh = mesh(params.naca, x, y, n, 10)

//var c = params.c

//var airfoil = naca(params.naca, Number(c))

window.onload = function () {
  v = new Viewport ('canvas', -1, 1, -1, 1)
}
