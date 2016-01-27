/* global location, window */
'use strict'

var Viewport = require('./lib/viewport')
var SimulationController = require('./lib/simulation-controller')
var createDatGui = require('./lib/create-dat-gui')
var datGuiConfig = require('./config/dat-gui-config')

var config = require('./config/query-params')

var viewport = new Viewport ('canvas', {
  xmin: config.xmin,
  xmax: config.xmax,
  ymin: config.ymin,
  ymax: config.ymax,
  aspectRatio: 1,
  devicePixelRatio: window.devicePixelRatio * (Modernizr.touchevents ? 2 : 1),
  antialias: false,
})

var simulation = new SimulationController('worker-bundle.js', config, viewport)

simulation.initializeMesh(
  simulation.createMesh
)

createDatGui(config, datGuiConfig(config, simulation))

