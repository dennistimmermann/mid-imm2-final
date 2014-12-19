/**
 * SETUP
 */

var width = window.innerWidth
var height = window.innerHeight

//var time = 0
var start = null
var time = 0

var entities = {}

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
    renderer.render(stage)

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

for(var y = 1980; y <= 2014; y++) {

	var o = {}

	o.blur = new PIXI.BlurFilter()
	o.text = new PIXI.Text(' '+y+' ', {
		font: "64px Roboto",
		fill: "red"
	})

	o.text.anchor.set(0.5, 0.25)
	o.text.filters = [o.blur]

	o.text.x = yearContainer.getLocalBounds().width
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

	updateText(yearContainer)
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

var ttext = new PIXI.Text(' 2014 ', {
	font: "50px Roboto",
	fill: "red"
})

ttext.anchor.set(0.5, 0.5)

var textBlur = new PIXI.BlurFilter()

document.addEventListener('mousemove', function(e) {
	ttext.position.set(e.clientX, height/2)

	ttext.alpha = 1-Math.abs(width/2 - e.clientX)/(width/2)

	var scale = 1.5-Math.abs(width/2 - e.clientX)/(width/2)
	ttext.scale.set(scale, scale)

	textBlur.blur = Math.abs(width/2 - e.clientX) * 0.03
})

var triangle = function() {
	var duration = 2000
	var direction = 0
	var rotation = 0

	var update = function() {

	}

	return
}


ttext.filters = [textBlur]

stage.addChild(ttext);


/**
 * triangle stuff
 */


var triangleContainer = new PIXI.DisplayObjectContainer()
var graphics = new PIXI.Graphics()
var graphics2 = new PIXI.Graphics()

var intcont = new PIXI.DisplayObjectContainer()

// graphics.beginFill(0x00FF00)
// //graphics.drawPolygon([0,0, -40,70, 40,70])
// graphics.drawPolygon([0,0, 0,80, 70,40])
// graphics.endFill()

// graphics.beginFill(0x0000FF)
// graphics.drawPolygon([-0.28867,-0.5, -0.28867,0.5, 0.57735,0])
// graphics.endFill()

// graphics2.beginFill(0x00FFFF)
// graphics2.drawPolygon([-0.28867,-0.5, -0.28867,0.5, 0.57735,0])
// graphics2.endFill()

graphics.beginFill(0x0000FF)
graphics.drawPolygon([0,-0.5, 0,0.5, 0.86602,0])
graphics.endFill()

graphics2.beginFill(0x00FFFF)
graphics2.drawPolygon([0,-0.5, 0,0.5, 0.86602,0])
graphics2.endFill()

// graphics2.pivot.set(-0.57735,0)
//graphics2.pivot.set(.61,0)
//graphics2.position.set(0.288675, 0)



// graphics.pivot.set(0,30)
//graphics.position.set(5,5)
intcont.addChild(graphics2)

//intcont.rotation = Math.PI/3
intcont.x = 0.28867
//intcont.pivot.set(-0.57735,0)

graphics.addChild(intcont)

triangleContainer.addChild(graphics)

triangleContainer.position.set(100,100)
triangleContainer.scale.set(80,80)

stage.addChild(triangleContainer)

var cols = 5
var rows = 5
var cells = []
var counter = 0

for(var i = 0; i < cols; i++) {
	for(var j = 0; j < rows; j++) {
		counter++
		cells.push({id: counter, available: false, drawn: false})
	}
}

cells = _.shuffle(cells)
cells[0].available = true

var nextPosition = function() {
	var side, up, down

	var e = _.find(cells, function(o) {
		return o.available == true && o.drawn == false
	})

	if(typeof e != "object") {
		return false
	}

	if(e.id%2) {
		side = _.find(cells, function(o) { return o.id == e.id-rows})
	} else {
		side = _.find(cells, function(o) { return o.id == e.id+rows})
	}

	//get neighbor on top edge
	if(e.id%rows != 1) {
		up = _.find(cells, function(o) { return o.id == e.id-1})
	}

	//get neighbor on bottom edge
	if(e.id%rows != 0) {
		down = _.find(cells, function(o) { return o.id == e.id+1})
	}

	side && (side.available = true)
	up && (up.available = true)
	down && (down.available = true)

	e.drawn = true
	console.log(e.id)

	cells = _.shuffle(cells)
	return e
}

var drawRectangle = function(parent) {
	var e = nextPosition()

	if(!e) return;

	var container = new PIXI.DisplayObjectContainer()
	var graphic = new PIXI.Graphics()

	graphic.beginFill(0x0000FF)
	graphic.drawPolygon([0,-0.5, 0,0.5, 0.86602,0])
	graphic.endFill()
}


//console.log(cells.length)

// _.sample(cells).available = true

// for(var k = 0; k < cells.length; k++) {
// 	var now = _.sample(_.where(cells, {available: true, drawn: false}))
// 	console.log(now)

// 	//get neighbor on vertical edge
// 	if(now.id%2) {
// 		_.where(cells, {id: now.id-rows}).available = true
// 	} else {
// 		_.where(cells, {id: now.id+rows}).available = true
// 	}

// 	//get neighbor on top edge
// 	if(now.id%rows != 1) {
// 		_.where(cells, {id: now.id-1}).available = true
// 	}

// 	//get neighbor on bottom edge
// 	if(now.id%rows != 0) {
// 		_.where(cells, {id: now.id+1}).available = true
// 	}
// 	now.drawn = true
// 	console.log(now.id)
// }

// for(var k = 0; k < cells.length; k++) {
// 	var now = _.sample(_.where(cells, {available: true, drawn: false}))
// 	console.log(now)

// 	//get neighbor on vertical edge
// 	if(now.id%2) {
// 		_.where(cells, {id: now-rows}).available = true
// 	} else {
// 		_.where(cells, {id: now+rows}).available = true
// 	}

// 	//get neighbor on top edge
// 	if(now.id%rows != 1) {
// 		_.where(cells, {id: now-1}).available = true
// 	}

// 	//get neighbor on bottom edge
// 	if(now.id%rows != 0) {
// 		_.where(cells, {id: now+1}).available = true
// 	}
// 	now.drawn = true
// 	console.log(now.id)
// }
