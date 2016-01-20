'use strict'

var coeffs = require('./compute-periodic-derivative-coefficients')
var triper = require('./solve-periodic-tridiagonal')

module.exports = Derivative

function Derivative (num, n, t) {
  this.n = n
  this.num = num

  // Coefficients (not modified):
  this.betaL0 = new Float64Array(n)
  this.alpha0 = new Float64Array(n)
  this.betaR0 = new Float64Array(n)

  // Coefficients (modified on each call to .compute()):
  this.betaL = new Float64Array(n)
  this.alpha = new Float64Array(n)
  this.betaR = new Float64Array(n)
  this.cL = new Float64Array(n)
  this.bL = new Float64Array(n)
  this.a = new Float64Array(n)
  this.bR = new Float64Array(n)
  this.cR = new Float64Array(n)

  // Work vector:
  this.w = new Float64Array(n)

  coeffs(num, n, t, this.betaL0, this.alpha0, this.betaR0, this.cL, this.bL, this.a, this.bR, this.cR)
}

Derivative.prototype.reset = function () {
  this.betaL.set(this.betaL0)
  this.alpha.set(this.alpha0)
  this.betaR.set(this.betaR0)
}

Derivative.prototype.compute = function (xp, yp, x, ox, y, oy) {
  var i, im2, im1, ip1, ip2
  var n = this.n
  this.reset()

  for (i = 0; i < n; i++) {
    im2 = (i - 2 + n) % n
    im1 = (i - 1 + n) % n
    ip1 = (i + 1) % n
    ip2 = (i + 2) % n

    xp[i] =
      this.cL[i] * x[ox + im2] +
      this.bL[i] * x[ox + im1] +
      this.a[i] * x[ox + i] +
      this.bR[i] * x[ox + ip1] +
      this.cR[i] * x[ox + ip2]

    yp[i] =
      this.cL[i] * y[oy + im2] +
      this.bL[i] * y[oy + im1] +
      this.a[i] * y[oy + i] +
      this.bR[i] * y[oy + ip1] +
      this.cR[i] * y[oy + ip2]
  }

  triper(n, this.betaL, this.alpha, this.betaR, xp, yp, this.w)
}
