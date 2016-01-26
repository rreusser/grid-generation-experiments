'use strict'

module.exports = {
  naca: null,
  xmin: -0.6,
  xmax: 1.6,
  ymin: -1.0,
  ymax: 1.0,
  m: 101,
  n: 50,
  thickness: 0.12,
  camber: 0.05,
  camberLoc: 0.4,
  stepInc: 0.001,
  stepStart: 0.002,
  diffusion: 0.002,
  pow: 1.0,
  clustering: 20,
  collapse: [],
  hide: [],
  points: true,
  integrator: 'rk4',
  collapseConfig: false
}
