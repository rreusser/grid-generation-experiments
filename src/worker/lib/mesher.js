'use strict'

var ode4 = require('ode-rk4')
var ode45 = require('ode45-cash-karp')
var euler = require('ode-euler')
var Derivative = require('./derivative')
var hyperbolicGridDerivative = require('./hyperbolic-grid-derivative')

module.exports = Mesher

function Mesher (eta, xi, mesh) {
  var x0, y0, x1, y1, dxdeta, dydeta, d2xdeta2, d2ydeta2, dx, dy, f
  this.mesh = mesh
  this.xi = xi
  this.n = this.mesh.shape[1]
  this.m = this.xi.shape[0]

  var ddeta = new Derivative(1, this.n, eta.data)
  var d2deta2 = new Derivative(2, this.n, eta.data)

  this.f = new Float64Array(this.n * 2)

  // Work arrays
  dxdeta = new Float64Array(this.n)
  dydeta = new Float64Array(this.n)
  d2xdeta2 = new Float64Array(this.n)
  d2ydeta2 = new Float64Array(this.n)

  var deriv = hyperbolicGridDerivative.bind({
    ddeta: ddeta,
    d2deta2: d2deta2,
    dxdeta: dxdeta,
    dydeta: dydeta,
    d2xdeta2: d2xdeta2,
    d2ydeta2: d2ydeta2,
    n: this.n,
  })

  this.integrator = ode4(this.f, deriv, 0, 0.1)
  //integrator.dtMinMag = 0.001
  //integrator.dtMaxMag = 0.1
  //integrator.tol = 1e-2
}


Mesher.prototype.march = function () {
  var i, j
  var divs = 20

  for (i = 0; i < this.n; i++) {
    this.f[i] = this.mesh.get(0, i, 0)
    this.f[i + this.n] = this.mesh.get(0, i, 1)
  }

  for (i = 1; i < this.m; i++) {
    this.integrator.dt = (this.xi.get(i) - this.xi.get(i - 1)) / divs
    this.integrator.steps(divs)

    for (j = 0; j < this.n; j++) {
      this.mesh.set(i, j, 0, this.f[j])
      this.mesh.set(i, j, 1, this.f[j + this.n])
    }
  }
}
