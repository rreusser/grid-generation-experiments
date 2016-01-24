'use strict'

module.exports = WorkerState

var shallowEquals = require('shallow-equals')
var EventEmitter = require('event-emitter')

function shallowDiff (a, b) {
  var diffs = {}
  for (var key in b) {
    if (b.hasOwnProperty(key) && a[key] !== b[key]) {
      diffs[key] = [a[key], b[key]]
    }
  }
  for (var key in a) {
    if (a.hasOwnProperty(key) && a[key] !== b[key]) {
      diffs[key] = [a[key], b[key]]
    }
  }
  return diffs
}

function WorkerState (initialState) {
  EventEmitter(this)

  this.state = Object.assign({}, initialState)
}

WorkerState.prototype.setState = function (newState) {
  var diffs = shallowDiff(newState, this.state)
  Object.assign(this.state, newState)
  if (Object.keys(diffs).length > 0) {
    this.emit('change', diffs)
  }
}


