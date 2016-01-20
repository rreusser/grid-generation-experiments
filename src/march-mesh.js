'use strict'

var show = require('ndarray-show')
var ndarray = require('ndarray')
var pool = require('ndarray-scratch')
var periodicDerivative = require('./periodic-derivative')
var ops = require('ndarray-ops')
var ode4 = require('ode-rk4')
var ode45 = require('ode45-cash-karp')
var euler = require('ode-euler')
var Derivative = require('./derivative')

var coeffs = require('./compute-periodic-derivative-coefficients')

module.exports = marchMesh

function hypDeriv (yp, y) {
  var dx, dy

  this.ddeta.compute(this.dxdeta, this.dydeta, y, 0, y, this.n)
  this.d2deta2.compute(this.d2xdeta2, this.d2ydeta2, y, 0, y, this.n)

  var i
  for (i = 0; i < this.n; i++) {
    dx = this.dxdeta[i]
    dy = this.dydeta[i]
    var ds2 = dx * dx + dy * dy
    var coeff =  - 1 / ds2
    yp[i         ] = - coeff * dy + this.d2xdeta2[i] * 0.0005
    yp[i + this.n] =   coeff * dx + this.d2ydeta2[i] * 0.0005
  }

}

function marchMesh (eta, xi, mesh) {
  var x0, y0, x1, y1, i, j, dxdeta, dydeta, d2xdeta2, d2ydeta2, dx, dy, f
  var n = mesh.shape[2]
  var m = xi.shape[0]

  var ddeta = new Derivative(1, n, eta.data)
  var d2deta2 = new Derivative(2, n, eta.data)

  f = new Float64Array(n * 2)
  for (i = 0; i < n; i++) {
    f[i    ] = mesh.get(0, 0, i)
    f[i + n] = mesh.get(0, 1, i)
  }

  // Work arrays
  dxdeta = new Float64Array(n)
  dydeta = new Float64Array(n)
  d2xdeta2 = new Float64Array(n)
  d2ydeta2 = new Float64Array(n)

  var deriv = hypDeriv.bind({
    ddeta: ddeta,
    d2deta2: d2deta2,
    dxdeta: dxdeta,
    dydeta: dydeta,
    d2xdeta2: d2xdeta2,
    d2ydeta2: d2ydeta2,
    n: n,
  })

  var integrator = ode4(f, deriv, 0, 0.1)
  //integrator.dtMinMag = 0.001
  //integrator.dtMaxMag = 0.1
  //integrator.tol = 1e-2
  var divs = 4

  for (i = 1; i < m; i++) {
    integrator.dt = (xi.get(i) - xi.get(i - 1)) / divs
    console.log('dt = ',integrator.dt)
    integrator.steps(divs)

    for (j = 0; j < n; j++) {
      mesh.set(i, 0, j, f[j])
      mesh.set(i, 1, j, f[j + n])
    }
  }
}
