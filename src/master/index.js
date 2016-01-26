/* global location, window */
'use strict'

var three = require('three')
var show = require('ndarray-show')
var pool = require('ndarray-scratch')
var WorkDispatcher = require('./lib/work-dispatcher')
var Viewport = require('./lib/viewport')
var createDatGUI = require('./lib/create-dat-gui')
var drawMesh = require('./lib/draw-mesh')
var drawPoints = require('./lib/draw-points')
var equals = require('shallow-equals')
var coerce = require('../lib/ndarray-coerce')

var config = require('./lib/config')

console.log('config =', config)

createDatGUI(config, {
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
        initializeMesh(function () {
          createMesh(null, true)
        })
      },
      onFinishChange: function () {
        createMesh()
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
        initializeMesh(function () {
          createMesh(null, true)
        })
      },
      onFinishChange: function () {
        createMesh()
      },
    }
  },
  close: config.collapseConfig
})

var mesh, eta, xi
var meshGeometry
var pointGeometry
var nOverride

function destroyGeometry () {
  meshGeometry && meshGeometry.destroy()
  meshGeometry = null

  pointGeometry && pointGeometry.destroy()
  pointGeometry = null
}

var dispatcher = new WorkDispatcher('worker-bundle.js')

function initializeMesh (cb, force) {
  dispatcher.request('initializeGrid', {
    params: config,
  }, [], force).then(function(result) {

    //nOverride = 1
    mesh = coerce(result.mesh)
    eta = coerce(result.eta)

    if (false) {
      destroyGeometry()
      meshGeometry = drawMesh(v, mesh, nOverride === undefined ? config.n : nOverride)
      if (config.points) pointGeometry = drawPoints(v, mesh, 1)

      v.dirty = true
    }

    cb && cb()
  }).catch(function (error) {
    //console.log(error)
  })
}

function createMesh (cb, force) {
  if (!mesh) return

  dispatcher.request('createMesh', {
    params: config,
    initial: pool.clone(mesh.pick(0)),
    eta: eta
  }, [], force).then(function(result) {
    //nOverride = undefined

    mesh = coerce(result.mesh)

    destroyGeometry()
    meshGeometry = drawMesh(v, mesh)
    if (config.points) pointGeometry = drawPoints(v, mesh, 1)
    v.dirty = true

    cb && cb()
  }).catch(function (error) {
    //console.log(error)
  })
}

var v = new Viewport ('canvas', {
  xmin: config.xmin,
  xmax: config.xmax,
  ymin: config.ymin,
  ymax: config.ymax,
  aspectRatio: 1,
  devicePixelRatio: window.devicePixelRatio * (Modernizr.touchevents ? 2 : 1),
  antialias: false,
})

initializeMesh(createMesh)
