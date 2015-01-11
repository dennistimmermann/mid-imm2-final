// config
var file = 'config.json'
var samplesize = 250

// imports

var jf = require('jsonfile')
var sp = require("serialport");
var SerialPort = sp.SerialPort
var _ = require("lodash")

var rl = require("readline");
var prompts = rl.createInterface(process.stdin, process.stdout);

// vars

var config = {}
var step = "idle"
var count = 0;

var values = {
	left: {
		min: [],
		max: []
	},
	right: {
		min: [],
		max: []
	}
}

config = jf.readFileSync(file)

// mainloop

var serialPort = new SerialPort(config.port, {
  baudrate: 57600,
  parser: sp.parsers.readline("\n")
});

console.log("waiting for arduino...")

serialPort.on("open", function () {
  console.log('...arduino connected');
  step = "ask left"
  serialPort.on('data', function(rec) {
    //console.log('data received: ' + rec);
    var vals = rec.split(":")
    //console.log(rec)

    if(step == "ask left") {
		step = "wait left"
		prompts.question("touch the LEFT side of the slider and press return", function (glasses) {
			count = 0
	    	step = "get left"
	    })
	}
	else if(step == "ask right") {
		step = "wait right"
		prompts.question("touch the RIGHT side of the slider and press return", function (glasses) {
			count = 0
	    	step = "get right"
	    })
	}
	else if(step == "calculate") {

		config.left.min = avg(values.left.min)
		config.left.max = avg(values.left.max)
		config.right.min = avg(values.right.min)
		config.right.max = avg(values.right.max)
		console.log("lmin:", config.left.min, "lmax:", config.left.max, "rmin:", config.right.min, "rmax:", config.right.max)

		jf.writeFileSync(file, config)
		console.log("config done")
		serialPort.close()
		process.exit();
	}
    else if (step == "get left") {
    	values.left.max.push(vals[0]|0)
    	values.right.min.push(vals[1]|0)

		count++
    	if(count >= samplesize) {
    		step = "ask right"
    	}

    }
    else if(step == "get right") {
    	values.left.min.push(vals[0]|0)
    	values.right.max.push(vals[1]|0)

		count++
    	if(count >= samplesize) {
    		step = "calculate"
    	}
    }
  })

  serialPort.on('close', function() {
    console.log('lost connection to arduino :(')
  })
})

// helpers

var avg = function (arr){
	return _.reduce(arr, function(memo, num){
		return memo + num;
	}, 0) / arr.length;
}
