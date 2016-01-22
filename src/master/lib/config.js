'use strict'

var extend = require('util-extend')

module.exports = createDatGUI

function createDatGUI (state, config) {
  var opts = extend({
    handlers: {}
  }, config)

  var gui = new dat.GUI()
  var airfoilConfig = gui.addFolder('Airfoil')
  var thicknessController = airfoilConfig.add(state, 'thickness', 0, 0.5).step(0.01)
  var camberMagController = airfoilConfig.add(state, 'camberMag', -0.5, 0.5).step(0.01)
  var camberLocController = airfoilConfig.add(state, 'camberLoc', 0, 1).step(0.01)
  airfoilConfig.open()

  var meshConfig = gui.addFolder('Mesh')
  var mController = meshConfig.add(state, 'm', 11, 151).step(1)
  var nController = meshConfig.add(state, 'n', 3, 300).step(1)
  var diffusionController = meshConfig.add(state, 'diffusion', 0.00001, 0.003)
  var stepStartController = meshConfig.add(state, 'stepStart', 0.0001, 0.02)
  var stepEndController = meshConfig.add(state, 'stepEnd', 0.0001, 1.0)
  var clusteringController = meshConfig.add(state, 'clustering', 1, 50)
  meshConfig.open()

  var airfoilHandlers = config.handlers.airfoil
  if (airfoilHandlers.change) {
    thicknessController.onChange(airfoilHandlers.change)
    camberMagController.onChange(airfoilHandlers.change)
    camberLocController.onChange(airfoilHandlers.change)
    clusteringController.onChange(airfoilHandlers.change)
  }

  if (airfoilHandlers.finish) {
    thicknessController.onFinishChange(function () {
      airfoilHandlers.finish()
    })

    camberMagController.onFinishChange(airfoilHandlers.finish)
    camberLocController.onFinishChange(airfoilHandlers.finish)
    clusteringController.onFinishChange(airfoilHandlers.finish)
  }

  if (config.handlers.m) {
    if (config.handlers.m.change) {
      mController.onChange(config.handlers.m.change)
    }
    if (config.handlers.m.finish) {
      mController.onFinishChange(config.handlers.m.finish)
    }
  }

  if (config.handlers.mesh) {
    if (config.handlers.mesh.change) {
      nController.onChange(config.handlers.mesh.change)
      diffusionController.onChange(config.handlers.mesh.change)
      stepStartController.onChange(config.handlers.mesh.change)
      stepEndController.onChange(config.handlers.mesh.change)
    }
    if (config.handlers.mesh.finish) {
      nController.onFinishChange(config.handlers.mesh.finish)
      diffusionController.onFinishChange(config.handlers.mesh.finish)
      stepStartController.onFinishChange(config.handlers.mesh.finish)
      stepEndController.onFinishChange(config.handlers.mesh.finish)
    }
  }

}
