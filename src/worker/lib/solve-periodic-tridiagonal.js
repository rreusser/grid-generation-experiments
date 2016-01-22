'use strict'

module.exports = solvePeriodicTridiagonal

function solvePeriodicTridiagonal (n, a, b, c, x, y, w) {
  var i, i1, fac
  var n1 = n - 1
  var n2 = n - 2
  var n3 = n - 3

  if (n < 3) {
    throw new Error('solvePeriodicTridiagonal: cannot operate on system with n < 3 (n = ' + n + ')')
  }

  // Set one of two nonzero components of the work vector
  w[0] = -a[0]

  // Eliminate two systems in parallel:
  for (i = 1; i < n1; i++) {
    i1 = i - 1
    if (b[i1] === 0) {
      return false
    }
    fac = a[i] / b[i1]
    b[i] -= fac * c[i1]
    x[i] -= fac * x[i1]
    y[i] -= fac * y[i1]

    // Would be -=, except we know it's already zero:
    w[i] = -fac * w[i1]
  }

  // Add the second term in the last component of the work vector:
  w[n2] -= c[n2]

  // Back-substitute:
  if (b[n2] === 0) {
    return false
  }
  x[n2] /= b[n2]
  y[n2] /= b[n2]
  w[n2] /= b[n2]

  for (i = n3; i >= 0; i--) {
    i1 = i + 1
    if (b[i] === 0) {
      return false
    }
    x[i] = (x[i] - c[i] * x[i1]) / b[i]
    y[i] = (y[i] - c[i] * y[i1]) / b[i]
    w[i] = (w[i] - c[i] * w[i1]) / b[i]
  }

  // Compute the periodic term:
  x[n1] -= c[n1] * x[0] + a[n1] * x[n2]
  y[n1] -= c[n1] * y[0] + a[n1] * y[n2]
  fac = b[n1] + c[n1] * w[0] + a[n1] * w[n2]
  if (fac === 0) {
    return false
  }
  x[n1] /= fac
  y[n1] /= fac

  // combine the two components of the solution to get the final answer:
  for (i = 0; i < n1; i++) {
    x[i] += w[i] * x[n1]
    y[i] += w[i] * y[n1]
  }

  return true
}
