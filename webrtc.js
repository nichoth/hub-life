var wswarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hub = signalhub('my-app-name', [
    'https://hub-world.herokuapp.com/'
])
var observ = require('observ')
var struct = require('observ-struct')
var onend = require('end-of-stream')

// -------------------------------------

import { render } from 'preact'
import { html } from 'htm/preact'
import { useState } from 'preact/hooks'

// --------------------------------------

var swarm = wswarm(hub)

var state = struct({
    peers: observ({}),
    msgs: observ([])
})

swarm.on('peer', function (stream, id) {
    console.log('CONNECTED to a new peer', id)
    var _peers = state.peers()
    _peers[id] = stream
    state.peers.set(_peers)

    stream.on('data', function (data) {
        addMsg(data.toString())
    })

    onend(stream, () => {
        var peers = state.peers()
        delete peers[id]
        state.peers.set(peers)
    })
})

function addMsg (msg) {
    var newMsgs = state.msgs().concat([msg])
    state.msgs.set(newMsgs)
}

function App () {
    var [_state, setState] = useState(state())
    state(function onChange (newState) {
        console.log('state change', newState)
        setState(newState)
    })

    function sendMsg (msg) {
        Object.keys(_state.peers).forEach(function (peerId) {
            _state.peers[peerId].write(msg)
        })
    }

    function submitMsg (ev) {
        ev.preventDefault()
        var msg = ev.target.elements.newMsg.value
        addMsg(msg)
        sendMsg(msg)
    }

    return html`
        ${_state.msgs.map(msg => {
            return html`<p class="msg">${msg}</p>`
        })}

        <form class="msg-input" onSubmit=${submitMsg}>
            <textarea id="newMsg" name="newMsg" cols="44" rows="12"></textarea>
            <div>
                <input type="submit" value="new message" />
            </div>
        </form>
    `
}

render(html`<${App} />`, document.getElementById('content'));

