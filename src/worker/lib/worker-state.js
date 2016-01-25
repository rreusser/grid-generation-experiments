'use strict'

var ndarray = require('ndarray')

var show = require('ndarray-show')
var initializeMesh = require('./initialize-mesh')
var ShallowState = require('./shallow-state')
var ops = require('ndarray-ops')
var Mesher = require('./mesher')
var coerce = require('../../lib//ndarray-coerce')
var linspace = require('ndarray-linspace')
var prefixSum = require('ndarray-prefix-sum')
var ndarray = require('ndarray')

module.exports = WorkerState

function WorkerState () {
  ShallowState.call(this)

  this.on('change', function(changes) {
    if (changes.m ||
        changes.n ||
        changes.thickness ||
        changes.camberMag ||
        changes.camberLoc ||
        changes.clustering) {

      this.needsInitialization = true
    }
    if (changes.m ||
        changes.n ||
        changes.diffusion ||
        changes.stepStart ||
        changes.stepInc ||
        changes.clustering) {
      this.needsMesh = true

    }
  }.bind(this))
}

WorkerState.prototype = Object.create(ShallowState.prototype)

WorkerState.prototype.initialize = function () {
  var m = this.state.m
  var n = this.state.n
  this.mesh = ndarray(new Float32Array(m * n * 3), [n, m, 3])
  this.eta = ndarray(new Float32Array(m + 1), [m + 1])

  initializeMesh({
    t: this.state.thickness,
    m: this.state.camberMag,
    p: this.state.camberLoc,
  }, this.eta, this.mesh.pick(0), m, this.state.clustering, this.state.clustering)

  this.xi = ndarray(new Float32Array(n), [n])

  this.mesher = new Mesher(this.eta, this.xi, this.mesh, this.state.diffusion)

  this.needsInitialization = false
}

WorkerState.prototype.createMesh = function (data) {
  var m = this.state.m
  var n = this.xi.shape[0]

  var dxi = this.state.stepStart
  this.xi.set(0, 0)
  for (var i = 1; i < m; i++) {
    this.xi.set(i, this.xi.get(i - 1) + dxi)
    dxi += this.state.stepInc
  }

  this.mesher.diffusion = this.state.diffusion
  this.mesher.march()

  this.needsMesh = false
}
