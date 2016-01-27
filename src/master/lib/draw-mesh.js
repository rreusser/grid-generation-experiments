'use strict'

var show = require('ndarray-show')
var three = require('three')

module.exports = function drawMesh (v, mesh, options) {
  var i, j, ind1, ind2, k1, k2
  var n = mesh.shape[0]
  var m = mesh.shape[1]

  var indices = new Uint16Array(n * m * 2 + m * (n - 1) * 2)

  var c = 0
  for (j = 0; j < n; j++ ){
    for (i = 0; i < m; i++) {
      ind1 = j * m + i
      ind2 = j * m + (i + 1) % m
      indices[c++] = ind1
      indices[c++] = ind2
    }
  }

  for (i = 0; i < m; i++) {
    for (j = 0; j < n - 1; j++ ){
      ind1 = j * m + i
      ind2 = (j + 1) * m + i
      indices[c++] = ind1
      indices[c++] = ind2
    }
  }

  var geometry = new three.BufferGeometry()
  geometry.addAttribute('position', new three.BufferAttribute(mesh.data, 3))
  geometry.setIndex(new three.BufferAttribute(indices, 1))

  var material = new three.MeshBasicMaterial( { color: 0x000000 } );
  var mesh = new three.LineSegments(geometry, material)
  var node = new three.Object3D()
  node.add(mesh)
  v.scene.add(node)

  return {
    geometry: geometry,
    destroy: function () {
      geometry.dispose()
      node.remove(mesh)
      v.scene.remove(node)
    }
  }
}
