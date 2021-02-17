var wswarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hub = signalhub('my-app-name', [
    'https://hub-world.herokuapp.com/'
])

// -------------------------------------

import { render } from 'preact'
import { html } from 'htm/preact'
import { useState } from 'preact/hooks'

// --------------------------------------

var swarm = wswarm(hub)

console.log('peers here', swarm.peers)

swarm.on('peer', function (stream, id) {
    console.log('CONNECTED to a new peer', id)
    console.log('.peers', swarm.peers)
})

function App () {
    var [msgs, setMsgs] = useState([])

    function addMsg (ev) {
        ev.preventDefault()
        var msg = ev.target.elements.newMsg.value
        var newMsgs = msgs.concat([msg])
        setMsgs(newMsgs)
    }

    return html`
        ${msgs.map(msg => {
            return html`<p class="msg">${msg}</p>`
        })}

        <form class="msg-input" onSubmit=${addMsg}>
            <textarea id="newMsg" name="newMsg" cols="44" rows="12"></textarea>
            <div>
                <input type="submit" value="new message" />
            </div>
        </form>
    `
}

render(html`<${App} />`, document.getElementById('content'));
