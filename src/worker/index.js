'use strict'

var EventLoop = require('./lib/event-loop')
var ndarray = require('ndarray')
var prefixSum = require('ndarray-prefix-sum')
var initializeMesh = require('./lib/initialize-mesh')
var linspace = require('ndarray-linspace')
var ops = require('ndarray-ops')
var Mesher = require('./lib/mesher')
var show = require('ndarray-show')

function coerce (data) {return ndarray(data.data, data.shape, data.stride, data.offset)}

var mesher

var eventLoop = new EventLoop({
  handlers: {
    initializeGrid: function (data, cb) {
      //console.log('Initializing NACA airfoil', data)

      var airfoil = data.airfoil
      var m = data.m
      var n = data.n

      var mesh = ndarray(new Float32Array(n * m * 3), [n, m, 3])
      var eta = ndarray(new Float32Array(m + 1), [m + 1])

      initializeMesh({
        t: data.thickness,
        m: data.camberMag,
        p: data.camberLoc,
      }, eta, mesh.pick(0), m, data.clustering, data.clustering)

      cb({
        mesh: mesh,
        eta: eta,
      })//, [mesh.data.buffer, eta.data.buffer])
    },
    createMesh: function (data, cb) {
      var airfoil = data.airfoil
      var m = data.m
      var n = data.n

      var mesh = ndarray(new Float32Array(n * m * 3), [n, m, 3])
      ops.assign(mesh.pick(0), coerce(data.initial))
      var eta = coerce(data.eta)

      var xi = ndarray(new Float32Array(n), [n])

      ops.assign(xi.lo(1), linspace(data.stepStart, data.stepEnd, n - 1))
      prefixSum(xi)

      mesher = new Mesher(eta, xi, mesh, data.diffusion)

      mesher.march()

      cb({
        mesh: mesher.mesh
      })

    },
  }
})
