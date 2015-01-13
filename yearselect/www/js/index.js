var firstyear = 1980
  , lastyear = 2015
  , yearspacing = 200

var width = window.innerWidth
var height = window.innerHeight

//var time = 0
var start = null
var time = 0

var entities = {}
var velocity = 0;

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF)

//  create a renderer instance.
var renderer = PIXI.autoDetectRenderer(width, height)

// add the renderer view element to the DOM
document.body.appendChild(renderer.view)

requestAnimFrame(animate)

function animate(timestamp) {
	if(!start) start = timestamp
	time = timestamp
    // render the stage

    TWEEN.update(timestamp);

    updateText(yearContainer)

    renderer.render(stage)

    if(velocity != 0) {
    	yearContainer.x -=velocity*10
    	updateText(yearContainer)
    }

    velocity = velocity/1.1
    if(Math.abs(velocity) < 0.00001) {
		velocity = 0
	}

    requestAnimFrame(animate)
}

var canvas = document.getElementById('yearcanvas')
//canvas.append(renderer.view)

/**
 * SETUP WEBFONTS
 */

WebFontConfig = {
  google: {
    families: [ 'Roboto', 'Arvo:700italic', 'Podkova:700' ]
  },
  active: function() {
    // do something
    //init();
  }
};
(function() {
    var wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();


/**
 * LOGIC
 */


var yearContainer = new PIXI.DisplayObjectContainer()
var years = []

for(var y = firstyear; y <= lastyear; y++) {

	var o = {}

	o.blur = new PIXI.BlurFilter()
	o.text = new PIXI.Text(' '+y+' ', {
		font: "64px Roboto",
		fill: "red"
	})

	o.text.anchor.set(0.5, 0.25)
	o.text.filters = [o.blur]

	o.text.x = (y - firstyear) * yearspacing
	yearContainer.addChild(o.text)
	years.push(o)
}

yearContainer.y = 100
stage.addChild(yearContainer)

document.addEventListener('keydown', function(e) {
	if(e.keyCode == 37) {
		//left
		yearContainer.x -= 10
	} else if(e.keyCode == 39) {
		//right
		yearContainer.x += 10
	}

	var curpos = (yearContainer.x - width/2)
	var intpos = curpos%yearspacing
	var curyear = Math.round(-1*curpos/yearspacing+firstyear)

	if(intpos > -100) {
		//left
		//curyear = Math.round(-1*curpos/200+firstyear)
		//console.log("right of", )
	} else {
		//right
		//console.log("left of", Math.round(-1*curpos/200+firstyear))
	}
	if(e.keyCode == 38) {
		//center
		console.log(curyear)
		console.log((curyear-firstyear)*yearspacing + width/2)
		yearContainer.x = -1*((curyear-firstyear)*yearspacing - width/2)
	}

	console.log( (yearContainer.x - width/2)%200 )
})

var updateText = function(parent) {
	years.forEach(function(e, i, arr) {
		var scale = 1-Math.abs(width/2 - (e.text.x+parent.x))/(width/2)
		//console.log(e)
		e.text.scale.set(scale, scale)
		e.text.alpha = 1-Math.abs(width/2 - (e.text.x+parent.x))/(width/2)
		e.blur.blur = Math.abs(width/2 - (e.text.x+parent.x)) * 0.05
	})
}

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
			velocity = action.velocity
			//yearContainer.x -=action.velocity*5;
			//updateText(yearContainer)
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


var snaptimer;

var snap = function() {

}


/// demo code
///

var tweens = []
var twi = 0


tweens.push(new TWEEN.Tween( yearContainer ).to( { x: "+300"}, 1500 )
    .easing( TWEEN.Easing.Exponential.InOut ))

tweens.push(new TWEEN.Tween( yearContainer ).to( { x: "-200"}, 1000 )
    .easing( TWEEN.Easing.Exponential.InOut ))

tweens.push(new TWEEN.Tween( yearContainer ).to( { x: "+500"}, 1000 )
    .easing( TWEEN.Easing.Exponential.InOut ))


tweens.push(new TWEEN.Tween( yearContainer ).to( { x: "-3400"}, 2000 )
    .easing( TWEEN.Easing.Exponential.InOut ))


tweens.forEach(function(e, i, arr) {
	if(arr[i+1] != null) {
		var next = arr[i+1]
		e.onComplete(function() {
			next.start()
		})
	}
})

tweens[0].start()

document.addEventListener('keydown', function(e) {



})
