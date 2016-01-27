'use strict'

module.exports = hyperbolicGridDerivative

function hyperbolicGridDerivative (yp, y) {
  var i, dx, dy

  this.ddeta.compute(this.dxdeta, this.dydeta, y, 0, y, this.m)
  this.d2deta2.compute(this.d2xdeta2, this.d2ydeta2, y, 0, y, this.m)

  for (i = 0; i < this.m; i++) {
    dx = this.dxdeta[i]
    dy = this.dydeta[i]
    var ds2 = dx * dx + dy * dy
    var coeff =  - 1 / Math.pow(ds2, this.power)
    yp[i         ] = - coeff * dy + this.d2xdeta2[i] * this.diffusion
    yp[i + this.m] =   coeff * dx + this.d2ydeta2[i] * this.diffusion
  }

}
