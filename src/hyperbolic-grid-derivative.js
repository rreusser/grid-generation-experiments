'use strict'

module.exports = hyperbolicGridDerivative

function hyperbolicGridDerivative (yp, y) {
  var i, dx, dy

  this.ddeta.compute(this.dxdeta, this.dydeta, y, 0, y, this.n)
  this.d2deta2.compute(this.d2xdeta2, this.d2ydeta2, y, 0, y, this.n)

  for (i = 0; i < this.n; i++) {
    dx = this.dxdeta[i]
    dy = this.dydeta[i]
    var ds2 = dx * dx + dy * dy
    var coeff =  - 1 / ds2
    yp[i         ] = - coeff * dy + this.d2xdeta2[i] * 0.001
    yp[i + this.n] =   coeff * dx + this.d2ydeta2[i] * 0.001
  }

}
