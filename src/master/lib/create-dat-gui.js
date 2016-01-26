'use strict'

var extend = require('util-extend')

module.exports = createDatGUI

function createDatGUI (state, config) {
  var i, j, folder, folderKeys, gui, controllers
  var variable, guiFolder, variableKeys, folderKey
  var variableKey, guiController
  var opts = extend({
    handlers: {}
  }, config)

  gui = new dat.GUI()

  controllers = {}
  folderKeys = Object.keys(config.folders)

  for (i = 0; i < folderKeys.length; i++) {
    folderKey = folderKeys[i]
    folder = config.folders[folderKey]

    if (!folder.variables || folder.hide) continue

    guiFolder = gui.addFolder(folder.name)

    variableKeys = Object.keys(folder.variables)

    for (j = 0; j < variableKeys.length; j++) {
      variableKey = variableKeys[j]
      variable = folder.variables[variableKey]

      // A numerical variable with a range:
      if (variable.range) {
        guiController = guiFolder.add(state, variableKey, variable.range[0], variable.range[1])

        // Set steps, if provided:
        if (variable.step) {
          guiController.step(variable.step)
        }
      }

      // A variable with string values:
      if (variable.values) {
        guiController = guiFolder.add(state, variableKey, variable.values)
      }

      // Assign a folder-level callback for changes:
      if (folder.onChange) {
        guiController.onChange(folder.onChange)
      }

      // A folder-level callback for changes finished:
      if (folder.onFinishChange) {
        guiController.onChange(folder.onFinishChange)
      }

      if (!folder.collapse) {
        guiFolder.open()
      }

    }
  }

  if (config.close) {
    gui.close()
  }
}
