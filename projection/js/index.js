var currentYear = 1903;
var buildings = [];
var infofields = [];

$(document).ready(function() {
    $.getJSON('data.json', function(json) {
        $.each(json, function(i, data) {
            var building = new Building(data.name, data);
            buildings.push(building);
        });

        setTimeout(function() {
            buildings[0].state = 3;
            console.log(buildings[0]);
        }, 10000);

        // setTimeout(function() {
        //     currentYear = 2008;
        // }, 5000);

        //  setTimeout(function() {
        //     currentYear = 2014;
        // }, 10000);

        var interval = setInterval(function() {
            for (var i = 0; i < buildings.length; i++) {
                buildings[i].update(currentYear);
            }
        }, /*41*/1000);
    });
});
