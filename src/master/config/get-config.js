/* global location, window */
'use strict'

var extend = require('util-extend')
var defaults = require('./default-config')
var naca = require('naca-four-digit-airfoil')
var normalizeQueryParams = require('../lib/normalize-query-params')

var config = extend({}, defaults)

extend(config, normalizeQueryParams(location.search, {
  open: ['String'],
  close: ['String'],
  hide: ['String'],
  xmin: 'Number',
  xmax: 'Number',
  ymin: 'Number',
  ymax: 'Number',
  points: 'Boolean',
  collapseConfig: 'Boolean',
  antialiasing: 'Boolean',
  devicePixelRatio: 'Number',
  configSet: 'Integer',
  closeButton: 'Boolean',
  mouseWheel: 'Boolean',
}))

if (naca.isValid(config.naca)) {
  var airfoil = naca.parse(config.naca)
  config.thickness = airfoil.t
  config.camber = airfoil.m
  config.camberLoc = airfoil.p
}

module.exports = config
