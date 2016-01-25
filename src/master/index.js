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
var drawPoints = require('./lib/draw-points')
var equals = require('shallow-equals')
var coerce = require('../lib/ndarray-coerce')
var defaults = require('./lib/defaults')

var params = extend(defaults, queryString.parse(location.search))

var numericalParams = [
  'thickness', 'camberMag', 'camberLoc', 'm', 'n',
  'diffusion', 'stepStart', 'stepInc', 'clustering',
  'xmin', 'xmax', 'ymin', 'ymax'
]

var config = {}
for (var i = 0; i < numericalParams.length; i++) {
  var param = numericalParams[i]
  config[param] = Number(params[param])
}

var booleanParams = ['points']

for (var i = 0; i < booleanParams.length; i++) {
  var param = booleanParams[i]
  config[param] = params[param] !== 'false'
}

if (naca.isValid(params.naca)) {
  var airfoil = naca.parse(params.naca)
  config.thickness = airfoil.t
  config.camberMag = airfoil.m
  config.camberLoc = airfoil.p
}

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

createDatGUI(config, {
  panels: {
    airfoil: {
      collapse: params.collapse.indexOf('airfoil') !== -1,
      hide: params.hide.indexOf('airfoil') !== -1,
    },
    mesh: {
      collapse: params.collapse.indexOf('mesh') !== -1,
      hide: params.hide.indexOf('mesh') !== -1,
    }
  },
  handlers: {
    airfoil: {
      change: function () {
        initializeMesh(function () {
          createMesh(null, true)
        })
      },
      finish: function () {
        initializeMesh(function () {
          createMesh(null, true)
        })
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
  xmin: config.xmin,
  xmax: config.xmax,
  ymin: config.ymin,
  ymax: config.ymax,
  aspectRatio: 1,
  devicePixelRatio: window.devicePixelRatio,
  antialias: false,
})

initializeMesh(createMesh)
