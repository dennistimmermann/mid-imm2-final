var file = 'configp3.json';

var jf = require( 'jsonfile' );
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var config = {};
config = jf.readFileSync( file );

var serialPort = new SerialPort( config.port, {
    baudrate: 57600,
    parser: serialport.parsers.readline( '\n' )
} );

var rl = require( 'readline' );
var prompts = rl.createInterface( process.stdin, process.stdout );

var _ = require( 'lodash' );

//
// HELPERS
//

/**
 * weighted average
 */
var wmean = require( 'compute-wmean' ),
    sampleSize = 100,
    weighting = 1.1;

/**
 * determine touch
 */
var isTouched = function(up, down, common) {
    if (config.threshold + common > Math.min( config.common.min.left, config.common.min.right ) &&
        config.threshold + up > Math.min( config.up.min.left, config.up.min.right ) &&
        config.threshold + down > Math.min( config.down.min.left, config.down.min.right )) {
        return true;
    }
    return false;
};

/**
 * get scaling value
 */
var scaling = function(common) {
    return;
};




var last = 0;
var velocity = 0;
var greatest = 0;
var count = 0;

var past = {};
past.values = [];
past.weights = [];
past.add = function(v) {
    this.values.push( v );
    if (this.values.length > sampleSize) {
        this.values.shift();
    }
};

for (var i = 0; i < sampleSize; i++) {
    past.values.push( 0 );
    past.weights.push( Math.pow( 2, i * weighting ) );
}

serialPort.on( 'open', function() {
    console.log( 'arduino connected' );
    serialPort.on( 'data', function(rec) {
        //console.log('data received: ' + rec);

        var values = rec.split( ':' );
        var a = [];

        values.forEach( function(e, i, arr) {
            a.push( e | 0 );
        } );

        past.add( a );

        console.log( a );

        // var commonScaling = (config.common.min.avg - current.common) / (config.common.min.avg - config.common.max.avg) * 2

        // var scaledUp = current.up - ( commonScaling * (1 - config.up.scaling) * current.up)
        // var scaledDown = current.down - ( commonScaling * (1 - config.down.scaling) * current.down)


        // var positionUp = ( scaledUp - config.up.min.left)/(config.up.min.right-config.up.min.left)
        // var positionDown = ( scaledDown - config.down.min.right)/(config.down.min.right-config.down.min.left)

        // var position = (positionUp+(1-positionDown))/2

        //var frLeft = (leftMean-config.left.min)/(config.left.max-config.left.min)
        //var frRight = (rightMean-config.right.min)/(config.right.max-config.right.min)

        //var frAll = (frLeft+(1-frRight))/2

        //console.log(isTouched(current.up, current.down, current.common), "\t", current.up, "\t", commonScaling, "\t", scaledUp)
        //console.log(isTouched(current.up, current.down, current.common), commonScaling, position, positionUp, positionDown)




        //    if(left > config.left.min && right > config.right.min) {

        //    }

        //    try{
        //     var data = JSON.parse(rec)

        //     var val = 0;

        //     if(data.left > 0 && data.right > 0) {
        //     	val = data.left-data.right-last
        //     }
        //     last = data.left - data.right

        //     if(!isNaN(val)) {
        //     	past.add(val);
        //     }
        // } catch(e) {
        // 	console.log("error: e")
        // }

        //console.log(wmean(past.values, past.weights))



    } );
    // serialPort.write("ls\n", function(err, results) {
    //   console.log('err ' + err);
    //   console.log('results ' + results);
    // });
    serialPort.on( 'close', function() {
        console.log( 'lost connection to arduino' );
    } );
} );

var WebSocketServer = require( 'ws' ).Server;
var wss = new WebSocketServer( {
    port: 8069
} );

var app = {};

app.clients = [];

app.sendTap = function() {
    var o = {};
    o.type = 'tap';
};

app.sendSwipe = function() {
    var o = {};
    o.type = 'swipe';
};


wss.on( 'connection', function(ws) {
    // in a connection
    //
    console.log( '*' );
    //ws.send(JSON.stringify({type:'tap', point: 0}))

    var timer = setInterval( function() {
        //console.log(wmean(past.values, past.weights))
        var current = past.values[past.values.length - 1];
        var delay = past.values[past.values.length - 6];
        var touch = '.';


        velocity = velocity / 1.2; //Math.pow(velocity, 1.1)

        if (isTouched( delay.up, delay.down, delay.common ) && isTouched( current.up, current.down, current.common )) {
            touch = 'O';
        }

        var commonScaling = (config.common.min.avg - current.common) / (config.common.min.avg - config.common.max.avg) * 2;

        var scaledUp = current.up - (commonScaling * (1 - config.up.scaling) * current.up);
        var scaledDown = current.down - (commonScaling * (1 - config.down.scaling) * current.down);


        var positionUp = (scaledUp - config.up.min.left) / (config.up.min.right - config.up.min.left);
        var positionDown = (scaledDown - config.down.min.right) / (config.down.min.right - config.down.min.left);

        var position = (positionUp + (1 - positionDown)) / 2;

        if (last != -1) {
            if (Math.abs( position - last ) > 0.05) {
                if (touch == 'O') {
                    velocity = position - last;
                }

            }
        }
        if (touch == 'O') {
            last = position;
        } else {
            last = -1;
            //velocity = velocity/1.5;
        }

        if (Math.abs( velocity ) < 0.00001) {
            velocity = 0;
        }

        if (Math.abs( velocity ) > Math.abs( greatest ) && count > 50) {
            greatest = velocity;
        }
        count++;
        if (touch == 'O') {
            ws.send( JSON.stringify( {
                type: 'swipe',
                velocity: velocity * -5
            } ) );
        }
        //console.log(touch, positionUp, positionDown, commonScaling)
        console.log( current.up - config.up.max.left, current.down - config.down.max.left, current.common - config.common.max.avg );
        //console.log(touch, Math.min(frLeft, 1-frRight), velocity)
    }, 50 );

    ws.on( 'message', function(m) {
        console.log( 'received: %s', m );
    } );


} );


////////////////////
///
///
// var timer = setInterval(function() {
// 	//console.log(wmean(past.values, past.weights))
// 	var data = past.values[past.values.length-1]
// 	var touch = "."

// 	velocity = velocity/1.1

// 	if(data.left > config.left.min && data.right > config.right.min) {
// 		touch = "O"
// 	}

// 	var frLeft = (data.left-config.left.min)/(config.left.max-config.left.min)
// 	var frRight = (data.right-config.right.min)/(config.right.max-config.right.min)

// 	var frAll = (frLeft+(1-frRight))/2


// 		if(last != -1) {
// 			if(Math.abs(frAll - last) > 0.05 ) {
// 				if(touch == "O") {
// 					velocity = frAll - last
// 				}

// 				last = frAll
// 			}
// 		}


// 	if(Math.abs(velocity) < 0.00001) {
// 		velocity = 0
// 	}

// 	if(Math.abs(velocity) > Math.abs(greatest) && count > 50) {
// 		greatest = velocity
// 	}
// 	count++
// 	console.log(touch, greatest, velocity)
// },25)
