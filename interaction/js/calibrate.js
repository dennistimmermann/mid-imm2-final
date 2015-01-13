// config
var file = 'config.json'
var samplesize = 50

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
	up: {
		min: {
			left: [],
			right: [],
		},
		max: {
			left: [],
			right: []
		}//,
		//scaling: 0
	},
	down: {
		min: {
			left: [],
			right: []
		},
		max: {
			left: [],
			right: []
		}//,
		//scaling: 0
	},
	common: {
		min: {
			left: [],
			right: [],
			avg: [],
		},
		max: {
			left: [],
			right: [],
			avg: []
		}
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
  step = "ask left one"
  serialPort.on('data', function(rec) {
    //console.log('data received: ' + rec);
    var vals = rec.split(":")

    var up = vals[0]|0
    var down = vals[1]|0
    var common = vals[2]|0
    //console.log(rec)

    if(step == "ask left one") {
		step = "wait"
		prompts.question("touch the LEFT side of the slider with ONE finger and press return", function (glasses) {
			count = 0
	    	step = "get left one"
	    })
	}
	if(step == "ask left three") {
		step = "wait"
		prompts.question("touch the LEFT side of the slider with THREE fingers and press return", function (glasses) {
			count = 0
	    	step = "get left three"
	    })
	}
	else if(step == "ask right one") {
		step = "wait"
		prompts.question("touch the RIGHT side of the slider with ONE finger and press return", function (glasses) {
			count = 0
	    	step = "get right one"
	    })
	}
	else if(step == "ask right three") {
		step = "wait"
		prompts.question("touch the RIGHT side of the slider with THREE fingers and press return", function (glasses) {
			count = 0
	    	step = "get right three"
	    })
	}
	else if(step == "calculate") {

		config.up.min.left = avg(values.up.min.left)
		config.up.min.right = avg(values.up.min.right)
		config.up.max.left = avg(values.up.max.left)
		config.up.max.right = avg(values.up.max.right)

		config.down.min.left = avg(values.down.min.left)
		config.down.min.right = avg(values.down.min.right)
		config.down.max.left = avg(values.down.max.left)
		config.down.max.right = avg(values.down.max.right)

		config.common.min.left = avg(values.common.min.left)
		config.common.min.right = avg(values.common.min.right)
		config.common.max.left = avg(values.common.max.left)
		config.common.max.right = avg(values.common.max.right)

		config.common.min.avg = (config.common.min.left+config.common.min.right)/2
		config.common.max.avg = (config.common.max.left+config.common.max.right)/2

		config.up.scaling = (config.up.min.left+config.up.min.right)/(config.up.max.left+config.up.max.right)
		config.down.scaling = (config.down.min.left+config.down.min.right)/(config.down.max.left+config.down.max.right)

		console.log("up:", config.up)
		console.log("down:", config.down)
		console.log("common:", config.common)

		jf.writeFileSync(file, config)
		console.log("config done")
		serialPort.close()
		process.exit();
	}
    else if (step == "get left one") {
    	values.up.min.left.push(up)
    	values.down.min.left.push(down)
    	values.common.min.left.push(common)

		count++
    	if(count >= samplesize) {
    		step = "ask left three"
    	}

    }
    else if(step == "get right one") {
    	values.up.min.right.push(up)
    	values.down.min.right.push(down)
    	values.common.min.right.push(common)

		count++
    	if(count >= samplesize) {
    		step = "ask right three"
    	}
    }
    else if (step == "get left three") {
    	values.up.max.left.push(up)
    	values.down.max.left.push(down)
    	values.common.max.left.push(common)

		count++
    	if(count >= samplesize) {
    		step = "ask right one"
    	}

    }
    else if(step == "get right three") {
    	values.up.max.right.push(up)
    	values.down.max.right.push(down)
    	values.common.max.right.push(common)

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
