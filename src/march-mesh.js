'use strict'

var ode4 = require('ode-rk4')
var ode45 = require('ode45-cash-karp')
var euler = require('ode-euler')
var Derivative = require('./derivative')

var coeffs = require('./compute-periodic-derivative-coefficients')

module.exports = marchMesh

function marchMesh (eta, xi, mesh) {
  var x0, y0, x1, y1, i, j, dxdeta, dydeta, d2xdeta2, d2ydeta2, dx, dy, f
  var n = mesh.shape[2]
  var m = xi.shape[0]

  var ddeta = new Derivative(1, n, eta.data)
  var d2deta2 = new Derivative(2, n, eta.data)

  f = new Float64Array(n * 2)

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
  var divs = 5

  for (i = 0; i < n; i++) {
    f[i    ] = mesh.get(0, 0, i)
    f[i + n] = mesh.get(0, 1, i)
  }

  for (i = 1; i < m; i++) {
    this.integrator.dt = (xi.get(i) - xi.get(i - 1)) / divs
    this.integrator.steps(divs)

    for (j = 0; j < n; j++) {
      mesh.set(i, 0, j, f[j])
      mesh.set(i, 1, j, f[j + n])
    }
  }
}
