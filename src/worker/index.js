'use strict'

var EventLoop = require('./lib/event-loop')
var WorkerState = require('./lib/worker-state')

var w = new WorkerState()

var eventLoop = new EventLoop({
  handlers: {
    initializeGrid: function (data, cb) {
      w.setState(data.params)
      if (w.needsInitialization) {
        w.initialize()
      }
      cb({
        mesh: w.mesh,
        eta: w.eta,
      })
    },
    createMesh: function (data, cb) {
      w.setState(data.params)

      if (w.needsInitialization) {
        w.initialize()
      }

      w.createMesh(data)

      cb({
        mesh: w.mesh,
        eta: w.eta,
        xi: w.xi,
        n: w.state.n,
        m: w.state.m,
      })
    },
  }
})
