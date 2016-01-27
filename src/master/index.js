/* global location, window */
'use strict'

var Viewport = require('./lib/viewport')
var SimulationController = require('./lib/simulation-controller')
var createDatGui = require('./lib/create-dat-gui')
var datGuiConfig = require('./config/dat-gui-config')

var state = require('./config/query-params')

var viewport = new Viewport ('canvas', {
  xmin: state.xmin,
  xmax: state.xmax,
  ymin: state.ymin,
  ymax: state.ymax,
  aspectRatio: 1,
  devicePixelRatio: state.devicePixelRatio,
  antialias: state.antialiasing,
})

var simulation = new SimulationController('worker-bundle.js', state, viewport)

createDatGui(state, datGuiConfig(state, simulation))

simulation.initializeMesh(
  simulation.createMesh
)
