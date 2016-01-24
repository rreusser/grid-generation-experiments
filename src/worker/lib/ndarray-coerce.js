'use strict'

var ndarray = require('ndarray')

module.exports = coerce

function coerce (data) {
  return ndarray(
    data.data,
    data.shape,
    data.stride,
    data.offset
  )
}
