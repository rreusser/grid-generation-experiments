'use strict'

var arcLength = require('arc-length')
var bisect = require('bisect')
var incdec = require('./incdec')
var naca = require('naca-four-digit-airfoil')

module.exports = initializeMesh

function initializeMesh (airfoilData, eta, xy, m, ratio1, ratio2) {
  var x = xy.pick(null, 0)
  var y = xy.pick(null, 1)
  var airfoil = naca(airfoilData)

  var sUpper = function(x) {
    return arcLength([airfoil.xUpper, airfoil.yUpper], 0, Math.max(1e-15, x), 1e-2, 1, 10)
  }

  var sLower = function(x) {
    return arcLength([airfoil.xLower, airfoil.yLower], 0, Math.max(1e-15, x), 1e-2, 1, 10)
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
  var nt = Math.floor((m + 2) / 2)

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

  eta.set(m, eta.get(m - 1) +
             Math.sqrt(Math.pow(x.get(m - 1) - x.get(0), 2) +
             Math.pow(y.get(m - 1) - y.get(0), 2)))
}

