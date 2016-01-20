'use strict'

var show = require('ndarray-show')
var stencil = require('finite-difference-stencil')
var triper = require('solve-periodic-tridiagonal')

module.exports = periodicDerivative

function periodicDerivative (num, fp, f, t, nf, of, sf) {
  var i, dt, im, ip, dtm1, dtp1, dtm2, dtp2, shift
  var im2, im1, ip1, ip2

  var a = new Float64Array(nf)
  var b = new Float64Array(nf)
  var c = new Float64Array(nf)
  var d = new Float64Array(nf)
  var w = new Float64Array(nf)

  for (i = 0; i < nf; i++) {
    im2 = (i - 2 + nf) % nf
    im1 = (i - 1 + nf) % nf
    ip1 = (i + 1) % nf
    ip2 = (i + 2) % nf

    dtp1 = t[i + 1] - t[i]

    shift = (i === nf - 1) ? nf : 0
    dtp2 = t[i + 2 - shift] -  t[i + 1 - shift]

    shift = (i === 0) ? nf : 0
    dtm1 = t[i - 1 + shift] - t[i + shift]

    shift = (i < 2) ? nf : 0
    dtm2 = t[i - 2 + shift] - t[i - 1 + shift]

    var points = [dtm1, dtp1, dtm1 + dtm2, dtm1, 0, dtp1, dtp1 + dtp2]

    stencil(num, points, 2)

    a[i] = points[0]
    b[i] = 1
    c[i] = points[1]
    fp[i] = points[2] * f[of + sf * im2] +
            points[3] * f[of + sf * im1] +
            points[4] * f[of + sf * i] +
            points[5] * f[of + sf * ip1] +
            points[6] * f[of + sf * ip2]
  }

  triper(nf, a, b, c, fp, w)
}
