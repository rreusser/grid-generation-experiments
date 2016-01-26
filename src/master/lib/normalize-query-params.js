'use strict'

var queryString = require('query-string')

module.exports = normalizeQueryParams


function cast (data, type) {
  var typeName, nestedType
  if (Array.isArray(type)) {
    typeName = 'Array'
    nestedType = type[0]
  } else {
    typeName = String(type)
  }

  switch(typeName) {
  case "Number":
    return Number(data)
    break;
  case "Integer":
    return Math.round(Number(data))
    break;
  case "Boolean":
    var strData = String(data).toLowerCase()
    if (strData === 'f' || strData === 'false' || strData === 'n' || strData === 'no') {
      return false
    } else {
      return true
    }
    break;
  case "Array":
    if (Array.isArray(data)) {
      return data.map(function(datum) {
        return cast(datum, nestedType)
      })
    } else {
      return [cast(data, nestedType)]
    }
  default:
  case "String":
    return String(data)
    break;
  }
}

function normalizeQueryParams (str, typeDefs) {
  var i, params, output, keys, key

  output = {}
  params = queryString.parse(str)
  keys = Object.keys(params)

  for (i = 0; i < keys.length; i++) {
    key = keys[i]
    output[key] = cast(params[key], typeDefs[key])
  }

  return output
}
