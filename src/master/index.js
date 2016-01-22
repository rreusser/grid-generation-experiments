/* global location, window */
'use strict'

var three = require('three')
var show = require('ndarray-show')
var queryString = require('query-string')
var extend = require('util-extend')

var params

//drawMesh(v, mesh)
//v.dirty = true

params = extend({
  naca: '8412',
}, queryString.parse(location.search))

var worker = new Worker('worker-bundle.js')

window.worker = worker

worker.addEventListener('message', function (args) {
  console.log('response:',args)
}, false)
