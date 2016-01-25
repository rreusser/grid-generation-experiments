'use strict'

var show = require('ndarray-show')
var three = require('three')

module.exports = function drawPoints (v, mesh, n) {
  var i, j, ind1, ind2, k1, k2
  n = n || mesh.shape[0]
  var m = mesh.shape[1]

  var geometry = new three.BufferGeometry()
  var data = mesh.data.subarray(0, 3 * n * m)
  geometry.addAttribute('position', new three.BufferAttribute(data, 3))

  var material = new three.PointsMaterial( { color: 0x0044ff, size: 8, sizeAttenuation: false} );
  var mesh = new three.Points(geometry, material)
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
