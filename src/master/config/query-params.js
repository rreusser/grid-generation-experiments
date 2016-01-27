/* global location, window */
'use strict'

var queryString = require('query-string')
var extend = require('util-extend')
var defaults = require('./defaults')
var naca = require('naca-four-digit-airfoil')
var normalizeQueryParams = require('../lib/normalize-query-params')

var config = extend({}, defaults)

extend(config, normalizeQueryParams(location.search, {
  hide: ['String'],
  thickness: 'Number',
  camber: 'Number',
  camberLoc: 'Number',
  m: 'Integer',
  n: 'Integer',
  diffusion: 'Number',
  stepStart: 'Number',
  stepInc: 'Number',
  clustering: 'Number',
  xmin: 'Number',
  xmax: 'Number',
  ymin: 'Number',
  ymax: 'Number',
  pow: 'Number',
  points: 'Boolean',
  collapseConfig: 'Boolean',
  integrator: 'String',
}))

if (Modernizr.touchevents) {
  config.collapsedFolders = (config.collapsedFolders || []).concat(['mesh', 'airfoil'])
}

if (naca.isValid(config.naca)) {
  var airfoil = naca.parse(config.naca)
  config.thickness = airfoil.t
  config.camber = airfoil.m
  config.camberLoc = airfoil.p
}

module.exports = config
