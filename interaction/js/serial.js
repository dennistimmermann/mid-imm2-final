var serialport = require("serialport");
var SerialPort = serialport.SerialPort
var serialPort = new SerialPort("/dev/tty.usbmodem1414331", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

var _ = require("lodash")
var mean = function (arr)
{
	return _.reduce(arr, function(memo, num)
	{
		return memo + num;
	}, 0) / arr.length;
}


var wmean = require( 'compute-wmean' )
  , sampleSize = 20
  , weighting = 0.5

var last = 0;

var past = {}
past.values = []
past.weights = []
past.add = function(v) {
	this.values.push(v)
	if(this.values.length > sampleSize) {
		this.values.shift()
	}
}

for ( var i = 0; i < sampleSize; i++ ) {
    past.values.push(0)
    past.weights.push(Math.pow(2, i*weighting))
}

serialPort.on("open", function () {
  console.log('arduino connected');
  serialPort.on('data', function(rec) {
    //console.log('data received: ' + rec);

    try{
	    var data = JSON.parse(rec)

	    var val = 0;

	    if(data.left > 0 && data.right > 0) {
	    	val = data.left-data.right-last
	    }
	    last = data.left - data.right

	    if(!isNaN(val)) {
	    	past.add(val);
	    }
	} catch(e) {
		console.log("error: e")
	}

    //console.log(wmean(past.values, past.weights))



  });
  // serialPort.write("ls\n", function(err, results) {
  //   console.log('err ' + err);
  //   console.log('results ' + results);
  // });
  serialPort.on('close', function() {
    console.log('lost connection to arduino');
  });
});


var timer = setInterval(function() {
	console.log(wmean(past.values, past.weights))
},50)
