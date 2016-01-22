'use strict'

module.exports = EventLoop

var extend = require('util-extend')

var defaults = {
  handlers: {}
}

function EventLoop (config) {
  var opts = extend({}, defaults)
  extend(opts, config)

  this.handlers = opts.handlers

  this.start()
}

EventLoop.prototype.start = function () {
  addEventListener('message', function (event) {
    var taskName = event.data.task
    var taskData = event.data.data
    var taskId = event.data.taskId

    var task = this.handlers[taskName]

    if (task) {
      var result = task(taskData, function (data, transfer) {
        postMessage({
          task: taskName,
          taskId: taskId,
          data: data
        }, transfer)
      })
    }

  }.bind(this))
}
