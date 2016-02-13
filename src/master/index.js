/* global location, window */
'use strict'

var Viewport = require('./lib/viewport')
var SimulationController = require('./lib/simulation-controller')
var createDatGui = require('./lib/create-dat-gui')
var datGuiConfig = require('./config/dat-gui-config')
var WindowListener = require('./lib/window-listener')

var config = require('./config/get-config')
var state = require('./config/get-state')

window.onload = function () {
  setTimeout(initialize, 1)
}

var listener = new WindowListener()

function initialize () {
  var devicePixelRatio = window.devicePixelRatio

  if (window.innerWidth <= 768 && !config.antialiasing) {
    // Fake anti-aliasing for small screens:
    devicePixelRatio *= 2
  }

  var viewport = new Viewport ('canvas', {
    xmin: config.xmin,
    xmax: config.xmax,
    ymin: config.ymin,
    ymax: config.ymax,
    aspectRatio: 1,
    devicePixelRatio: devicePixelRatio,
    antialias: config.antialiasing,
    mouseWheel: config.mouseWheel,
  })

  var simulation = new SimulationController('worker-bundle.min.js', config, state, viewport)

  createDatGui(state, datGuiConfig(config, simulation))

  simulation.initializeMesh(
    simulation.createMesh
  )

  listener.on('visible', function () {
  }).on('occluded', function () {
  }).on('beginFullscreen', function () {
    viewport.attachMouseWheel()
  }).on('endFullscreen', function () {
    viewport.detachMouseWheel()
  })
}
