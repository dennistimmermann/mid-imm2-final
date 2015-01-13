var currentYear = 1903;
var buildings = [];
var infofields = [];
var vehicle = new Vehicle();
var vehicleInterval = null;
var animation = false;

function changeYear(year) {
    currentYear = year;
    for (var i = 0; i < buildings.length; i++) {
        if (buildings[i].data && buildings[i].active === true) {
            buildings[i].state = 3;
        }
    }
}

function launchVehicle() {
    if ((vehicle.direction === 'DOWN' && vehicle.y > 1380) || (vehicle.direction === 'UP' && vehicle.y < -300)) {
        vehicle = new Vehicle();
        clearInterval(vehicleInterval);
        setInterval(launchVehicle, randomInt(0, 1000));
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function() {
    $.getJSON('data.json', function(json) {
        $.each(json, function(i, data) {
            var building = new Building(data.name, data);
            buildings.push(building);
        });

        vehicleInterval = setInterval(launchVehicle, 100);

        // setTimeout(function() {
        //     changeYear(2014);
        // }, 10000);

        // setTimeout(function() {
        //     changeYear(2008);
        // }, 15000);

        var interval = setInterval(function() {
            animation = false;

            for (var i = 0; i < buildings.length; i++) {
                if (buildings[i].state !== 2) {
                    animation = true;
                }

                buildings[i].update(currentYear);
            }

            vehicle.update();
        }, 40);
    });
});
