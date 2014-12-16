"use strict";

/**
 * bridge between imm2 visualisation and arduino interface
 */

var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({port: 8069})

var _ = require('lodash')


var app = {}

app.clients = []

app.sendTap = function() {
	var o = {}
	o.type = 'tap'
}

app.sendSwipe = function() {
	var o = {}
	o.type = 'swipe'
}


wss.on('connection', function(ws) {
	// in a connection
	//
	console.log('*')
	ws.send(JSON.stringify({type:'tap', point: 0}))

	ws.on('message', function(m) {
		console.log('received: %s', m)
	})


})

//do magic
//
//done
