/* global location, window */
'use strict'

var three = require('three')
var show = require('ndarray-show')
var queryString = require('query-string')
var pool = require('ndarray-scratch')
var extend = require('util-extend')
var WorkDispatcher = require('./lib/work-dispatcher')
var Viewport = require('./lib/viewport')
var naca = require('naca-four-digit-airfoil')
var createDatGUI = require('./lib/config')
var drawMesh = require('./lib/draw-mesh')
var equals = require('shallow-equals')

window.ndarray = require('ndarray')

function coerce (data) {return ndarray(data.data, data.shape, data.stride, data.offset)}

var params

params = extend({
  naca: null,
  m: 151,
  n: 50,
}, queryString.parse(location.search))

var dispatcher = new WorkDispatcher('worker-bundle.js')

var config = {
  thickness: 0.12,
  camberMag: 0.15,
  camberLoc: 0.4,
  m: Number(params.m),
  n: Number(params.n),
  diffusion: 0.001,
  stepStart: 0.002,
  stepInc: 0.001,
  clustering: 20,
}

if (naca.isValid(params.naca)) {
  var airfoil = naca.parse(params.naca)
  config.thickness = airfoil.t
  config.camberMag = airfoil.m
  config.camberLoc = airfoil.p
}

var mesh, eta, xi
var meshGeometry
var nOverride

function destroyMesh () {
  meshGeometry && meshGeometry.destroy()
  meshGeometry = null
}

function initializeMesh (cb, force) {
  dispatcher.request('initializeGrid', {
    params: config,
  }, [], force).then(function(result) {

    destroyMesh()

    nOverride = 1
    mesh = coerce(result.mesh)
    eta = coerce(result.eta)

    meshGeometry = drawMesh(v, mesh, nOverride === undefined ? config.n : nOverride)
    v.dirty = true

    cb && cb()
  }).catch(function (error) { })
}

function createMesh (cb, force) {
  if (!mesh) return

  dispatcher.request('createMesh', {
    params: config,
    initial: pool.clone(mesh.pick(0)),
    eta: eta
  }, [], force).then(function(result) {
    meshGeometry && meshGeometry.destroy()
    nOverride = undefined

    mesh = coerce(result.mesh)

    meshGeometry = drawMesh(v, mesh)
    v.dirty = true

    cb && cb()
  }).catch(function (error) { })
}

createDatGUI(config, {
  handlers: {
    airfoil: {
      change: function () {initializeMesh()},
      finish: function () {
        initializeMesh(null, true)
        createMesh(null, true)
      },
    },
    mesh: {
      change: function () {
        createMesh()
      },
      finish: function () {
        createMesh(null, true)
      },
    },
  }
})

var v = new Viewport ('canvas', {
  xmin: -0.6,
  xmax: 1.6,
  ymin: 0.15 - 1,
  ymax: 0.15 + 1,
  aspectRatio: 1,
  devicePixelRatio: window.devicePixelRatio,
  antialias: false,
})

initializeMesh(createMesh)
