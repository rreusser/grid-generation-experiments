var State = require('../src/worker/lib/worker-state.js')

var state = new State({
  size: 2,
})


state.on('change', function (changes) {
  console.log('changes:', changes)
})

state.set({size: 4, z: 2})
state.set({size: 4, z: 2})
