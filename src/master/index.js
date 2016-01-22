/* global location, window */
'use strict'

var three = require('three')
var show = require('ndarray-show')
var queryString = require('query-string')
var pool = require('ndarray-scratch')
var extend = require('util-extend')
var WorkDispatcher = require('./lib/work-dispatcher')
var Viewport = require('./viewport')
var naca = require('naca-four-digit-airfoil')
var createDatGUI = require('./lib/config')
var drawMesh = require('./draw-mesh')
var equals = require('shallow-equals')

window.ndarray = require('ndarray')

function coerce (data) {return ndarray(data.data, data.shape, data.stride, data.offset)}

var params

params = extend({
  naca: '2412',
  m: 151,
  n: 80,
}, queryString.parse(location.search))
var airfoil = naca.parse(params.naca)

var dispatcher = new WorkDispatcher('worker-bundle.js')

var config = {
  thickness: airfoil.t,
  camberMag: airfoil.m,
  camberLoc: airfoil.p,
  m: Number(params.m),
  n: Number(params.n),
  diffusion: 0.001,
  stepStart: 0.002,
  stepEnd: 0.02,
  clustering: 20,
}

var previousConfig
function storeConfig () {
  previousConfig = Object.assign({}, config)
}

var mesh, eta, xi
var meshGeometry
var nOverride

function initializeMesh (cb) {
  //if (equals(config, previousConfig)) return

  dispatcher.request('initializeGrid', config).then(function(result) {
    meshGeometry && meshGeometry.destroy()
    nOverride = 1
    mesh = coerce(result.mesh)
    eta = coerce(result.eta)

    meshGeometry = drawMesh(v, mesh, nOverride === undefined ? config.n : nOverride)
    v.dirty = true
    storeConfig()

    cb && cb()
  }).catch(function (error) {
    //console.warn(error)
  })
}

function createMesh (cb) {
  //if (equals(config, previousConfig)) return
  if (!mesh) return

  config.initial = pool.clone(mesh.pick(0))
  config.eta = eta
  var n = config.n

  dispatcher.request('createMesh', config /*, [config.initial.data.buffer]*/).then(function(result) {
    meshGeometry && meshGeometry.destroy()
    nOverride = undefined

    mesh = coerce(result.mesh)

    meshGeometry = drawMesh(v, mesh, n)
    v.dirty = true
    storeConfig()

    cb && cb()
  }).catch(function (error) {
    //console.warn(error)
  })
}

createDatGUI(config, {
  handlers: {
    airfoil: {
      change: function () {initializeMesh()},
      finish: function () {
        initializeMesh()
        createMesh()
      },
    },
    m: {
      change: function () {initializeMesh()},
      finish: function () {
        initializeMesh()
        createMesh()
      },
    },
    mesh: {
      change: function () {createMesh()}
    },
  }
})

var v = new Viewport ('canvas', {
  xmin: -0.1,
  xmax: 1.1,
  ymin: 0.05,
  ymax: 0.05,
  aspectRatio: 1,
  devicePixelRatio: window.devicePixelRatio,
  antialias: false,
})

initializeMesh(createMesh)
