/* global location, window */
'use strict'

var Viewport = require('./lib/viewport')
var SimulationController = require('./lib/simulation-controller')
var createDatGui = require('./lib/create-dat-gui')
var datGuiConfig = require('./config/dat-gui-config')
var state = require('./config/query-params')

window.onload = function () {
  setTimeout(initialize, 1)
}

function initialize () {
  var devicePixelRatio = window.devicePixelRatio

  if (window.innerWidth <= 400 && !state.antialiasing) {
    // Fake anti-aliasing for small screens:
    devicePixelRatio *= 2
  }

  var viewport = new Viewport ('canvas', {
    xmin: state.xmin,
    xmax: state.xmax,
    ymin: state.ymin,
    ymax: state.ymax,
    aspectRatio: 1,
    devicePixelRatio: devicePixelRatio,
    antialias: state.antialiasing,
  })

  window.viewport = viewport

  var simulation = new SimulationController('worker-bundle.js', state, viewport)

  createDatGui(state, datGuiConfig(state, simulation))

  simulation.initializeMesh(
    simulation.createMesh
  )
}
