'use strict'

var three = require('three')
var extend = require('util-extend')
var mouseWheel = require('mouse-wheel')
var mouse = require('mouse-event')
var mouseChange = require('mouse-change')


function Viewport (id, options) {
  var opts = extend({
    xmin: -1,
    xmax: 1,
    ymin: -1,
    ymax: 1,
    aspectRatio: undefined,
    zoomSpeed: 0.01,
    getSize: function () {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
  }, options || {})

  this.dirty = true
  this.getSize = opts.getSize
  this.zoomSpeed = opts.zoomSpeed
  this.canvas = document.getElementById(id)

  window.addEventListener('resize', function() {
    this.resize()
    this.render()
  }.bind(this), false)

  this.renderer = new three.WebGLRenderer({
    antialias: true,
    canvas: this.canvas,
  })

  var size = this.getSize()
  this.width = size.width
  this.height = size.height

  this.mouse = {}

  this.renderer.setClearColor(new three.Color(0xffffff))
  this.renderer.setPixelRatio(window.devicePixelRatio)
  this.renderer.setSize(this.width, this.height)

  this.scene = new three.Scene()
  this.camera = new three.OrthographicCamera(opts.xmin, opts.xmax, opts.ymax, opts.ymin, 0, 1000)

  this.setAspectRatio(opts.aspectRatio)
  this.setBounds(opts.xmin, opts.xmax, opts.ymin, opts.ymax)
  this.applyAspectRatio()

  this.attachMouseWheel()
  this.attachMouseChange()

  var geometry = new three.BufferGeometry()
  geometry.setIndex(new three.BufferAttribute(new Uint16Array([0, 1, 2, 3]), 1))
  geometry.addAttribute('position', new three.BufferAttribute(new Float32Array([-1, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0]), 3))
  var material = new three.MeshBasicMaterial( { color: 0x000000 } );
  var mesh = new three.LineSegments(geometry, material)
  var node = new three.Object3D()
  node.add(mesh)
  this.scene.add(node)

  var render = function () {
    if (this.dirty) {
      this.render()
      this.dirty = false
    }
    requestAnimationFrame(render)
  }.bind(this)

  render()
}
Viewport.prototype.attachMouseChange = function () {
  mouseChange(this.canvas, function(buttons, i, j, mods) {
    this.mouse.i = i
    this.mouse.j = j
    var x = this.camera.left + i * this.xscale
    var y = this.camera.top + j * this.yscale
    var dx = x - this.mouse.x
    var dy = y - this.mouse.y
    this.mouse.x = x
    this.mouse.y = y
    this.mouse.shift = mods.shift
    this.mouse.alt = mods.alt
    this.mouse.control = mods.control
    this.mouse.meta = mods.meta

    if (buttons === 1) {
      this.pan(dx, dy)
    }
  }.bind(this))
}

Viewport.prototype.attachMouseMove = function () {
  window.addEventListener('mousemove', function(ev) {
  }.bind(this))
}

Viewport.prototype.pan = function(dx, dy) {
  this.setBounds(
    this.camera.left - dx,
    this.camera.right - dx,
    this.camera.bottom - dy,
    this.camera.top - dy
  )
}

Viewport.prototype.zoom = function (amount) {
  var dxR = this.camera.right - this.mouse.x
  var dxL = this.camera.left - this.mouse.x
  var dxB = this.camera.bottom - this.mouse.y
  var dxT = this.camera.top - this.mouse.y

  var scalar = Math.exp(amount * this.zoomSpeed)

  this.setBounds(
    this.mouse.x + dxL * scalar,
    this.mouse.x + dxR * scalar,
    this.mouse.y + dxB * scalar,
    this.mouse.y + dxT * scalar
  )
}

Viewport.prototype.attachMouseWheel = function () {
  mouseWheel(this.canvas, this.onMouseWheel.bind(this), true)
}

Viewport.prototype.onMouseWheel = function (dx, dy) {
  this.zoom(dy)
}

Viewport.prototype.render = function () {
  this.renderer.render(this.scene, this.camera)
}

Viewport.prototype.resize = function () {
  var size = this.getSize()
  this.width = size.width
  this.height = size.height

  this.applyAspectRatio()

  this.renderer.setSize(this.width, this.height)
  this.camera.updateProjectionMatrix()
}


Viewport.prototype.setAspectRatio = function (aspectRatio) {
  this.aspectRatio = aspectRatio
}

Viewport.prototype.setBounds = function (xmin, xmax, ymin, ymax) {
  this.dirty = true
  this.camera.left = xmin
  this.camera.right = xmax
  this.camera.bottom = ymin
  this.camera.top = ymax

  this.applyAspectRatio()

  this.computeScale()

  this.mouse.x = this.camera.left + this.mouse.i * this.xscale
  this.mouse.y = this.camera.top + this.mouse.j * this.yscale
}

Viewport.prototype.computeScale = function () {
  this.xscale = (this.camera.right - this.camera.left) / this.width
  this.yscale = (this.camera.bottom - this.camera.top) / this.height
}

Viewport.prototype.applyAspectRatio = function () {
  if (!this.aspectRatio) return

  var dx = 0.5 * (this.camera.right - this.camera.left)
  var yc = 0.5 * (this.camera.bottom + this.camera.top)
  var dy = dx * this.aspectRatio * this.height / this.width
  this.camera.bottom = yc - dy
  this.camera.top = yc + dy

  this.camera.updateProjectionMatrix()
}

var v = new Viewport('canvas', {
  aspectRatio: 1
})
window.v = v
