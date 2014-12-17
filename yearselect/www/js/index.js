/**
 * SETUP
 */

var width = window.innerWidth
var height = window.innerHeight

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF)

//  create a renderer instance.
var renderer = PIXI.autoDetectRenderer(width, height)

    // add the renderer view element to the DOM
document.body.appendChild(renderer.view)

requestAnimFrame(animate)

function animate() {
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




ttext.filters = [textBlur]

stage.addChild(ttext);
