var wsUri = "ws://localhost:8069/"
var websocket

var connect = function() {
	websocket = new WebSocket(wsUri)
	websocket.onopen = onOpen
	websocket.onmessage = onMessage
	websocket.onclose = onClose
}

var decode = function(string, success, error) {
	try {
		var o = JSON.parse(string)
		success(o)
	}
	catch(e) { error(e) }
}

var onOpen = function(evt) { console.log('*') }
var onClose = function(evt) { console.log('x') }

var onMessage = function(evt) {
	//console.log('>', evt.data);
	decode(evt.data, function(action) {
		if(action.type == 'tap') {
			// do stuff
			console.log(action)
			//	{
			//		type: 'tap',
			//		point: [Number 0..3]		<- welcher punkt angetippt wurde. Fuer den prototypen 0 bis 3
			//	}
		}
		if(action.type == 'swipe') {
			// do stuff
			console.log(action)
			//	{
			// 		type: 'swipe',
			// 		direction: 'left'|'right',
			// 		velocity: [Number],			<- weiß noch noicht, ob das genutzt wird. Damit die Jahre bei der anzeige langsam stoppen und nicht abrupt
			// 		step: [Number]				<- wie viele jahre weiter/zurück geblättert werden soll. Wahrscheinlich eher über velocity
			//	}
		}
	}, function(e) {
		console.log('oh noes,\n', e)
	})
}
connect()
