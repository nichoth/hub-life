var wswarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hub = signalhub('my-app-name', [
    'https://hub-world.herokuapp.com/'
])

var swarm = wswarm(hub)

swarm.on('peer', function (stream, id) {
    console.log('CONNECTED to a new peer', id)
    console.log('.peers', swarm.peers)
})

