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
  var stepIncController = meshConfig.add(state, 'stepInc', 0, 0.01)
  var clusteringController = meshConfig.add(state, 'clustering', 1, 50)
  meshConfig.open()

  var init = config.handlers.airfoil
  if (init.change) {
    thicknessController.onChange(init.change)
    camberMagController.onChange(init.change)
    camberLocController.onChange(init.change)
    clusteringController.onChange(init.change)
  }

  if (init.finish) {
    thicknessController.onFinishChange(init.finish)
    camberMagController.onFinishChange(init.finish)
    camberLocController.onFinishChange(init.finish)
    clusteringController.onFinishChange(init.finish)
  }

  var mesh = config.handlers.mesh
  if (mesh) {
    if (mesh.change) {
      mController.onChange(mesh.change)
      nController.onChange(mesh.change)
      diffusionController.onChange(mesh.change)
      stepStartController.onChange(mesh.change)
      stepIncController.onChange(mesh.change)
    }
    if (mesh.finish) {
      mController.onFinishChange(mesh.finish)
      nController.onFinishChange(mesh.finish)
      diffusionController.onFinishChange(mesh.finish)
      stepStartController.onFinishChange(mesh.finish)
      stepIncController.onFinishChange(mesh.finish)
    }
  }
}
