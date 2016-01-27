'use strict'

var WorkDispatcher = require('./work-dispatcher')
var drawMesh = require('./draw-mesh')
var drawPoints = require('./draw-points')
var coerce = require('../../lib/ndarray-coerce')

module.exports = SimulationController

function SimulationController (code, config, viewport) {
  var dispatcher = new WorkDispatcher('worker-bundle.js')

  var mesh, eta, xi
  var meshGeometry
  var pointGeometry

  this.destroyGeometry = function destroyGeometry () {
    meshGeometry && meshGeometry.destroy()
    meshGeometry = null

    pointGeometry && pointGeometry.destroy()
    pointGeometry = null
  },

  this.initializeMesh = function initializeMesh (cb, force) {
    dispatcher.request('initializeGrid', {
      params: config,
    }, [], force).then(function(result) {

      mesh = coerce(result.mesh)
      eta = coerce(result.eta)

      cb && cb()
    }.bind(this)).catch(function (error) {
      if (error) {
        console.error(error)
      }
    })
  }.bind(this),

  this.createMesh = function createMesh (cb, force) {
    if (!mesh) return

    dispatcher.request('createMesh', {
      params: config,
      initial: mesh.pick(0),
      eta: eta
    }, [], force).then(function(result) {
      mesh = coerce(result.mesh)

      this.destroyGeometry()
      meshGeometry = drawMesh(viewport, mesh)
      if (config.points) pointGeometry = drawPoints(viewport, mesh, 1)
      viewport.dirty = true

      cb && cb()
    }.bind(this)).catch(function (error) {
      if (error) {
        console.error(error)
      }
    })
  }.bind(this)

  dispatcher.start()
}
