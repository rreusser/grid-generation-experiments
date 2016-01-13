'use strict'

var ops = require('ndarray-ops')

module.exports = incdec

function incdec (out, t1, t2, n, r1, r2) {
  var i, t, dt

  var fac1 = Math.pow(r1, 2 / (n - 2 - n % 2))
  var fac2 = Math.pow(r2, 2 / (n - 2 - n % 2))

  for (i = 0, t = 0, dt = 1; i < n; i++) {
    out.set(i, t)

    t += dt

    if (i < n / 2 - 1 - (n % 2)) {
      dt *= fac1
    }

    if (i >= n / 2 - 1) {
      dt /= fac2
    }
  }

  ops.mulseq(out, (t2 - t1) / out.get(n - 1))
  ops.addseq(out, t1)

  // Just in case you expect floating point equality:
  out.set(0, t1)
  out.set(n - 1, t1)

  return out
}
