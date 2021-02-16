var signalhub = require('signalhub')
var hub = signalhub('my-app-name', [
    'https://hub-world.herokuapp.com/'
])

hub.subscribe('my-channel')
    .on('data', function (message) {
        console.log('new message received', message)
    })

hub.broadcast('my-channel', { hello: 'world' })

