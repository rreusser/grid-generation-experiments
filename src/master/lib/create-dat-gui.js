'use strict'

var extend = require('util-extend')

module.exports = createDatGUI


function createVariable (gui, state, name, definition, onChange, onFinishChange) {
  var i, controller

  // A numerical variable with a range:
  if (definition.range) {
    controller = gui.add(state, name, definition.range[0], definition.range[1])

    // Set steps, if provided:
    if (definition.step) {
      controller.step(definition.step)
    }
  }

  // A definition with string values:
  if (definition.values) {
    controller = gui.add(state, name, definition.values)
  }

  onChange.push(definition.onChange)
  onFinishChange.push(definition.onFinishChange)

  for (i = 0; i < onChange.length; i++) {
    if (onChange[i]) {
      controller.onChange(onChange[i])
    }
  }

  for (i = 0; i < onFinishChange.length; i++) {
    if (onFinishChange[i]) {
      controller.onFinishChange(onFinishChange[i])
    }
  }
}

function createVariables (gui, state, items, onChange, onFinishChange) {
  var i, key
  var keys = Object.keys(items.variables)
  for (i = 0; i < keys.length; i++) {
    key = keys[i]
    createVariable(gui, state, key, items.variables[key],
      [onChange, items.onChange],
      [onFinishChange, items.onFinishChange]
    )
  }
}

function createFolder (gui, state, item, onChange, onFinishChange) {
  var folder = gui.addFolder(item.folder)
  if (item.open) {
    folder.open()
  }
  if (item.close) {
    folder.close()
  }
  createVariables(folder, state, item, onChange, onFinishChange)
}

function createDatGUI (state, config) {
  var i, j, folder, folderKeys, gui, controllers
  var variable, guiFolder, variableKeys, folderKey
  var variableKey, guiController
  var opts = extend({
    handlers: {}
  }, config)

  gui = new dat.GUI()

  controllers = {}

  for (i = 0; i < config.items.length; i++) {
    var item = config.items[i]
    if (item.hide) continue
    if (item.folder) {
      createFolder(gui, state, item, config.onChange, config.onFinishChange)
    } else {
      createVariables(gui, state, item, config.onChange, config.onFinishChange)
    }
  }

  if (config.collapse) {
    gui.close()
  }

  console.log(state)
  if (state.closeButton === false) {
    gui.__closeButton.style.display = 'none'
  }

  return gui
}
