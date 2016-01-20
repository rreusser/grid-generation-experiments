'use strict'

var stencil = require('finite-difference-stencil')

module.exports = computePeriodicDerivativeCoefficients

function computePeriodicDerivativeCoefficients (num, n, t, betaL, alpha, betaR, cL, bL, a, bR, cR) {
  var i, dt, im, ip, dtm1, dtp1, dtm2, dtp2, shift
  var im2, im1, ip1, ip2

  for (i = 0; i < n; i++) {
    im2 = (i - 2 + n) % n
    im1 = (i - 1 + n) % n
    ip1 = (i + 1) % n
    ip2 = (i + 2) % n

    dtp1 = t[i + 1] - t[i]

    shift = (i === n - 1) ? n : 0
    dtp2 = t[i + 2 - shift] -  t[i + 1 - shift]

    shift = (i === 0) ? n : 0
    dtm1 = t[i - 1 + shift] - t[i + shift]

    shift = (i < 2) ? n : 0
    dtm2 = t[i - 2 + shift] - t[i - 1 + shift]

    var points = [dtm1, dtp1, dtm1 + dtm2, dtm1, 0, dtp1, dtp1 + dtp2]

    stencil(num, points, 2)

    betaL[i] = points[0]
    alpha[i] = 1
    betaR[i] = points[1]
    cL[i] = points[2]
    bL[i] = points[3]
    a[i] = points[4]
    bR[i] = points[5]
    cR[i] = points[6]
  }
}

