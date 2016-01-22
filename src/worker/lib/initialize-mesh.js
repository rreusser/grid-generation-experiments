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
var show = require('ndarray-show')

module.exports = initializeMesh

function initializeMesh (code, eta, xy, n, ratio1, ratio2) {
  var x = xy.pick(null, 0)
  var y = xy.pick(null, 1)
  var airfoil = naca(code)

  var sUpper = function(x) {
    return arcLength([airfoil.xUpper, airfoil.yUpper], 0, Math.max(1e-15, x), 1e-6, 1, 25)
  }

  var sLower = function(x) {
    return arcLength([airfoil.xLower, airfoil.yLower], 0, Math.max(1e-15, x), 1e-6, 1, 25)
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
      return sLower(x) > l
    }, 0, 1, 1e-8)
  }

  var i
  var nt = Math.floor((n + 2) / 2)

  var tUpper = eta.hi(nt)
  incdec(tUpper, 0, upperLength, nt, ratio1, ratio2)

  var tLower = eta.lo(nt - 1).hi(nt)
  incdec(tLower, upperLength, upperLength + lowerLength, nt, ratio1, ratio2)

  for (i = 0; i < nt; i++) {
    var s = tUpper.get(nt - i - 1)
    var xx = findUpper(s)
    x.set(i, airfoil.xUpper(xx))
    y.set(i, airfoil.yUpper(xx))
  }

  for (i = 1; i < nt; i++) {
    var s = tLower.get(i) - upperLength
    var xx = findLower(s)
    x.set(nt + i - 1, airfoil.xLower(xx))
    y.set(nt + i - 1, airfoil.yLower(xx))
  }

  eta.set(n, eta.get(n - 1) +
             Math.sqrt(Math.pow(x.get(n - 1) - x.get(0), 2) +
             Math.pow(y.get(n - 1) - y.get(0), 2)))
}

