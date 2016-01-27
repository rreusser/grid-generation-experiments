'use strict'

module.exports = function(config, simulation) {
  return {
    folders: {
      airfoil: {
        name: 'Airfoil',
        variables: {
          thickness:    { range: [0, 0.5],      step: 0.01 },
          camber:       { range: [-0.5, 0.5],   step: 0.01 },
          camberLoc:    { range: [0, 1],        step: 0.01 },
          clustering:   { range: [1, 50],       step: 1    },
          m:            { range: [11, 201],     step: 1    },
        },
        collapse: config.collapsedFolders.indexOf('airfoil') !== -1,
        hide: config.hide.indexOf('airfoil') !== -1,
        onChange: function () {
          simulation.initializeMesh(function () {
            simulation.createMesh(null, true)
          })
        },
        onFinishChange: function () {
          simulation.createMesh()
        },
      },
      mesh: {
        name: 'Mesh',
        variables: {
          n:            { range: [1, 300], step: 1},
          diffusion:    { range: [0.00001, 0.005] },
          pow:          { range: [0.5, 1] },
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
        collapse: config.collapsedFolders.indexOf('mesh') !== -1,
        hide: config.hide.indexOf('mesh') !== -1,
        onChange: function () {
          simulation.initializeMesh(function () {
            simulation.createMesh(null, true)
          })
        },
        onFinishChange: function () {
          simulation.createMesh()
        },
      }
    },
    close: config.collapseConfig
  }
}
