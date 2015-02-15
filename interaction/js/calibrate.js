// config
var file = 'config.json';
var samplesize = 5000;

// imports

var jf = require( 'jsonfile' );
var sp = require( 'serialport' );
var SerialPort = sp.SerialPort;
var _ = require( 'lodash' );

var rl = require( 'readline' );
var prompts = rl.createInterface( process.stdin, process.stdout );

// vars

var config = {};
var step = 'idle';
var count = 0;

var min = [0,0,0,0,0,0,0,0,0];
var max = [0,0,0,0,0,0,0,0,0];

var last = []
var skip = false;

config = jf.readFileSync( file );

// mainloop

var serialPort = new SerialPort( config.port, {
    baudrate: 57600,
    parser: sp.parsers.readline( '\n' )
} );

console.log( 'waiting for arduino...' );

serialPort.on( 'open', function() {
    console.log( '...arduino connected' );
    step = 'ask low';
    serialPort.on( 'data', function(rec) {
        //console.log('data received: ' + rec);
        var vals = rec.split( ':' );

        if(vals.length != 9) {
        	console.log("skip");
        	return;
        }

        for (var i = 0; i < 9; i++) {
            vals[i] = vals[i] | 0;
        }
        //console.log(rec)

        if (step == 'ask low') {
            step = 'wait';
            prompts.question( 'dont touch anything', function(glasses) {
                count = 0;
                step = 'get low';
            } );
        }
        if (step == 'ask high') {
            step = 'wait';
            prompts.question( 'swype around on the slider', function(glasses) {
                count = 0;
                step = 'get high';
            } );
        } else if (step == 'calculate') {

            config.min = min;
            config.max = max;

            console.log( 'min:', min );
            console.log( 'max:', max );

            jf.writeFileSync( file, config );
            console.log( 'config done' );
            serialPort.close();
            process.exit();
        } else if (step == 'get low') {

        	console.log(vals);

            for (var i = 0; i < 9; i++) {
                min[i] = (min[i] + vals[i]) / 2;
            }

            count++;
            if (count >= samplesize) {
                step = 'ask high';
            }

        } else if (step == 'get high') {

        	console.log(vals);

            for (var i = 0; i < 9; i++) {
                max[i] = Math.max( max[i], vals[i] );
            }

            count++;
            if (count >= samplesize) {
                step = 'calculate';
            }
        }
    } );

    serialPort.on( 'close', function() {
        console.log( 'lost connection to arduino :(' );
    } );
} );

// helpers

var avg = function(arr) {
    return _.reduce( arr, function(memo, num) {
            return memo + num;
        }, 0 ) / arr.length;
};
