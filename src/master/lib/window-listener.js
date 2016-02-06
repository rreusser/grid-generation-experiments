'use strict'

var EventEmitter = require('event-emitter')

module.exports = WindowListener

function WindowListener () {
  EventEmitter(this)

  window.addEventListener('message', this.handleMessage.bind(this), false)
}


WindowListener.prototype.handleMessage = function (event) {
  if (!event.data) return

  var type = event.data.event
  var data = event.data.data

  if (type) {
    this.emit(type, data)
  }
}


