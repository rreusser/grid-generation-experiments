'use strict'

module.exports = function(config, simulation) {
  var ret

  function onChange () {
    simulation.initializeMesh(function () {
      simulation.createMesh(null, true)
    })
  }

  function onFinish () {
    simulation.createMesh()
  }

  function viewOption (name, type) {
    return config[type].indexOf(name) !== -1
  }

  switch(config.configSet) {
  case 1:
    ret = {
      items: [{
        variables: {
          camber: { range: [0.0, 0.3] },
          alpha: { range: [0, 1] },
        }
      }],
      onChange: onChange,
      onFinishChange: onFinish,
    }
    break;
  default:
    ret = {
      items: [{
        folder: 'Airfoil',
        variables: {
          thickness:    { range: [0, 0.5],      step: 0.01 },
          camber:       { range: [-0.5, 0.5],   step: 0.01 },
          camberLoc:    { range: [0, 1],        step: 0.01 },
          clustering:   { range: [1, 50],       step: 1    },
          m:            { range: [11, 201],     step: 1    },
        },
        close: viewOption('airfoil','close'),
        open: viewOption('airfoil','open'),
        hide: viewOption('airfoil','hide'),
      },
      {
        folder: 'Mesh',
        variables: {
          n:            { range: [1, 300], step: 1},
          diffusion:    { range: [0.00001, 0.005] },
          stepStart:    { range: [0.0001, 0.02] },
          stepInc:      { range: [0, 0.01] },
          integrator: {
            values: {
              'Euler': 'euler',
              'Midpoint': 'rk2',
              'Runge-Kutta 4': 'rk4'
            }
          },
        },
        close: viewOption('mesh','close'),
        open: viewOption('mesh','open'),
        hide: viewOption('mesh','hide'),
      }],
      onChange: onChange,
      onFinishChange: onFinish,
    }
  }

  ret.collapse = config.collapseConfig

  return ret
}
