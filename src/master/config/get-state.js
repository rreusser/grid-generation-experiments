/* global location, window */
'use strict'

var extend = require('util-extend')
var defaults = require('./default-state')
var naca = require('naca-four-digit-airfoil')
var normalizeQueryParams = require('../lib/normalize-query-params')

var config = extend({}, defaults)

extend(config, normalizeQueryParams(location.search, {
  thickness: 'Number',
  camber: 'Number',
  camberLoc: 'Number',
  m: 'Integer',
  n: 'Integer',
  diffusion: 'Number',
  stepStart: 'Number',
  stepInc: 'Number',
  clustering: 'Number',
  power: 'Number',
  integrator: 'String',
}))

if (naca.isValid(config.naca)) {
  var airfoil = naca.parse(config.naca)
  config.thickness = airfoil.t
  config.camber = airfoil.m
  config.camberLoc = airfoil.p
}

module.exports = config
