'use strict'

var ndarray = require('ndarray')
var rk4 = require('ode-rk4')
var triper = require('solve-periodic-tridiagonal')
var arcLength = require('arc-length')
var bisect = require('bisect')
var pool = require('ndarray-scratch')
var ops = require('ndarray-ops')
var incdec = require('./incdec')
var naca = require('naca-four-digit-airfoil')

module.exports = createMesh

function createMesh (code, x, y, n, ratio) {
  var airfoil = naca(code)

  var sUpper = function(x) {
    return arcLength([airfoil.xUpper, airfoil.yUpper], 0, Math.max(1e-15, x), 1e-4, 1, 15)
  }

  var sLower = function(x) {
    return arcLength([airfoil.xLower, airfoil.yLower], 0, Math.max(1e-15, x), 1e-4, 1, 15)
  }

  var upperLength = sUpper(1)
  var lowerLength = sLower(1)

  var findUpper = function (l) {
    return bisect(function(x) {
      return sUpper(x) > l
    }, 0, 1, 1e-8)
  }

  var findLower = function (l) {
    return bisect(function(x) {
      return sUpper(x) > l
    }, 0, 1, 1e-8)
  }

  var i
  var nt = Math.floor((n + 2) / 2)

  var tUpper = pool.zeros([nt], 'double')
  incdec(tUpper, 0, 1, nt, ratio, ratio)

  var tLower = pool.zeros([nt], 'double')
  incdec(tLower, 0, 1, nt, ratio * lowerLength / upperLength, ratio * lowerLength / upperLength)

  for (i = 0; i < nt; i++) {
    var s = tUpper.get(nt - i - 1) * upperLength
    var xx = findUpper(s)
    x.set(i, airfoil.xUpper(xx))
    y.set(i, airfoil.yUpper(xx))
  }

  for (i = 1; i < nt - 1; i++) {
    var s = tLower.get(i) * lowerLength
    var xx = findLower(s)
    x.set(nt + i - 1, airfoil.xLower(xx))
    y.set(nt + i - 1, airfoil.yLower(xx))
  }

  pool.free(tUpper)
  pool.free(tLower)
}

