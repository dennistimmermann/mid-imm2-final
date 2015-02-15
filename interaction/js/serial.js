var file = 'config.json';

var jf = require( 'jsonfile' );
var serialport = require( 'serialport' );
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

var pastWeight = {};
pastWeight.values = [ [], [], [], [], [], [], [], [], [] ];
pastWeight.add = function(v) {
    this.values.push( v );
    if (this.values.length > 9) {
        this.values.shift();
    }
};

var pastVelocity = {};
pastVelocity.values = [ 0,0,0,0,0,0,0,0,0 ];
pastVelocity.add = function(v) {
    this.values.push( v );
    if (this.values.length > 9) {
        this.values.shift();
    }
};

var lastPosition = NaN;
var saveLastPosition = true;
var sendVelocity = 0;
var skippedPackets = 0;

for (var i = 0; i < sampleSize; i++) {
    past.values.push( 0 );
    past.weights.push( Math.pow( 2, i * weighting ) );
}

serialPort.on( 'open', function() {
    console.log( 'arduino connected' );
    serialPort.on( 'data', function(rec) {
        //console.log('data received: ' + rec);

        var values = rec.split( ':' );

        if(values.length != 9) {
            //console.log("skip");
            skippedPackets++;
            return;
        }

        for (var i = 0; i < 9; i++) {
            values[i] = values[i] | 0;
        }

        past.add(values);

        // var current = {
        //     up: values[0] | 0,
        //     down: values[1] | 0,
        //     common: values[2] | 0
        // };

        //past.add( current );

        //console.log( current );

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

        ws.send( JSON.stringify( {
            type: 'swipe',
            velocity: sendVelocity * -50.0
        } ) );
    }, 50 );

    ws.on( 'message', function(m) {
        console.log( 'received: %s', m );
    } );


} );

var timer = setInterval( function() {
        //console.log(wmean(past.values, past.weights))
        var current = past.values[past.values.length - 1];
        var delay = past.values[past.values.length - 6];
        var touch = '.';


        velocity = velocity / 1.2; //Math.pow(velocity, 1.1)

        var str = [];
        var str2 = "";

        var weight = []
        var vvals = []

        var pos = 0;

        for(var i = 0; i <9; i++) {
            var c = current[i];
            var m = config.min[i];
            var x = config.max[i];

            var th = m*config.threshold;

            var p = (c-(m + th))/(x-m);
            str[i] = " ";
            if(p >= 0.25) {
                str[i] = "░";
            } if(p >= 0.5) {
                str[i] = "▒";
            } if(p >= 0.75) {
                str[i] = "▓";
            } if(p >= 1) {
                str[i] = "█";
            }

            p = Math.max(p, 0);
            p = Math.min(p, 1);
            str2 += p.toFixed(1)+" ";

            weight[i] = p;
            vvals[i] = i/8;

            pos = (p*(i/8)+pos) /2
        }

        pastWeight.add(weight);

        var ps = (isTouched(pastWeight.values[config.hindsight]) && isTouched(weight) )?wmean(vvals, weight):NaN;


        if(!isNaN(lastPosition) && !isNaN(ps) ) {
            if(Math.abs(ps-lastPosition) > config.jitter) {
                saveLastPosition = true;
                velocity = ps-lastPosition;
            } else {
                saveLastPosition = false;
            }
        }

        pastVelocity.add(velocity);

        var t = isTouched(weight)?"!":" ";

        // if(isTouched(weight) && !isNaN(pastVelocity.values[5])) {
        //     sendVelocity = pastVelocity.values[5];
        //     //console.log("wat")
        // } else {
        //     sendVelocity = sendVelocity / 1.2;
        // }

        sendVelocity = Math.abs(velocity-sendVelocity) > config.velocityJitter?velocity:sendVelocity;
        sendVelocity = sendVelocity / 1.2;

        console.log(t, "["+str.join(" ")+"]", "weighting:", str2, "position:", ps.toFixed(3), "velocity:", velocity.toFixed(3), "skipped packets:", skippedPackets);

        if(saveLastPosition || !isNaN(ps)) {
            lastPosition = ps;
        }

    }, 50 );

var isTouched = function(weight) {
    return weight.some(function(e, i, arr) {
        return e >= 0.25;
    })

}
