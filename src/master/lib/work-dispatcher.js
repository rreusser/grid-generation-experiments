'use strict'

var extend = require('util-extend')
var eventEmitter = require('event-emitter')
var guid = require('guid').raw

module.exports = WorkDispatcher

var defaults = {
  handlers: {}
}

function WorkDispatcher (workerCodePath, config) {
  eventEmitter(this)

  var opts = extend({}, defaults)
  extend(opts, config)

  this.handlers = opts.handlers
  this.worker = new Worker(workerCodePath)
  this.worker.postMessage = this.worker.webkitPostMessage || this.worker.postMessage;

  //this.on('request', this.request)

  this.promises = {}
  this.taskCounts = {}
}

WorkDispatcher.prototype.getTaskCount = function (task) {
  if (this.taskCounts[task] === undefined) {
    return 0
  } else {
    return this.taskCounts[task]
  }
}

WorkDispatcher.prototype.incTaskCount = function (task) {
  if (this.taskCounts[task] === undefined) {
    this.taskCounts[task] = 1
  } else {
    this.taskCounts[task]++
  }
}

WorkDispatcher.prototype.decTaskCount = function (task) {
  if (this.taskCounts[task] === undefined) {
    this.taskCounts[task] = 0
  } else {
    this.taskCounts[task]--
  }
}

WorkDispatcher.prototype.request = function (task, data, transfer, force) {
  if (this.getTaskCount(task) > 0 && !force) return Promise.reject()
  var taskId = guid()

  this.incTaskCount(task)

  this.worker.postMessage({
    taskId: taskId,
    task: task,
    data: data
  }, transfer)

  return new Promise(function (resolve, reject) {
    this.promises[taskId] = resolve
  }.bind(this))
}

WorkDispatcher.prototype.start = function (task, data) {
  this.worker.addEventListener('message', function (event) {
    var data = event.data
    var handler = this.handlers[data.task]
    this.decTaskCount(data.task)

    if (handler) {
      handler(data.data)
    }

    var taskId = data.taskId
    var resolve = this.promises[data.taskId]
    delete this.promises[data.taskId]

    resolve && resolve(data.data)
  }.bind(this), false)
}
