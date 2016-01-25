'use strict'

var ode4 = require('ode-rk4')
var ode2 = require('ode-midpoint')
var ode45 = require('ode45-cash-karp')
var euler = require('ode-euler')
var Derivative = require('./derivative')
var hyperbolicGridDerivative = require('./hyperbolic-grid-derivative')

module.exports = Mesher

function Mesher (eta, xi, mesh, diffusion) {
  var x0, y0, x1, y1, dxdeta, dydeta, d2xdeta2, d2ydeta2, dx, dy, f
  this.mesh = mesh
  this.xi = xi
  this.m = this.mesh.shape[1]
  this.n = this.xi.shape[0]

  this.ddeta = new Derivative(1, this.m, eta.data)
  this.d2deta2 = new Derivative(2, this.m, eta.data)

  this.f = new Float64Array(this.m * 2)
  this.diffusion = diffusion

  // Work arrays
  this.dxdeta = new Float64Array(this.m)
  this.dydeta = new Float64Array(this.m)
  this.d2xdeta2 = new Float64Array(this.m)
  this.d2ydeta2 = new Float64Array(this.m)

  this.deriv = hyperbolicGridDerivative.bind(this)

  this.euler = euler(this.f, this.deriv, 0, 0.1)
  this.rk2 = ode2(this.f, this.deriv, 0, 0.1)
  this.rk4 = ode4(this.f, this.deriv, 0, 0.1)
  this.integrator = this.rk4
  //integrator.dtMinMag = 0.001
  //integrator.dtMaxMag = 0.1
  //integrator.tol = 1e-2
}


Mesher.prototype.march = function () {
  var i, j
  var divs = 20

  for (i = 0; i < this.m; i++) {
    this.f[i] = this.mesh.get(0, i, 0)
    this.f[i + this.m] = this.mesh.get(0, i, 1)
  }

  for (i = 1; i < this.n; i++) {
    var c1 = 1
    var c2 = this.diffusion
    var dx = 1 / this.m

    var dt1 = dx / c1 * 0.1
    var dt2 = Math.sqrt(dx / c2) * 0.002

    var dxi = this.xi.get(i) - this.xi.get(i - 1)

    var divs = Math.floor(Math.max(dxi / dt1, dxi / dt2))

    this.integrator.dt = dxi / divs
    this.integrator.steps(divs)

    for (j = 0; j < this.m; j++) {
      this.mesh.set(i, j, 0, this.f[j])
      this.mesh.set(i, j, 1, this.f[j + this.m])
    }
  }
}
