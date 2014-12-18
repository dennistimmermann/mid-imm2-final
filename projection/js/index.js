var currentYear = 1903;
var buildings = [];
var infofields = [];

function changeYear(year) {
    currentYear = year;
    for (var i = 0; i < buildings.length; i++) {
        if (buildings[i].data && buildings[i].active === true) {
            buildings[i].state = 3;
        }
    }
}

$(document).ready(function() {
    $.getJSON('data.json', function(json) {
        $.each(json, function(i, data) {
            var building = new Building(data.name, data);
            buildings.push(building);
        });

        // setTimeout(function() {
        //     changeYear(2014);
        // }, 10000);

        // setTimeout(function() {
        //     changeYear(2008);
        // }, 15000);

        var interval = setInterval(function() {
            for (var i = 0; i < buildings.length; i++) {
                buildings[i].update(currentYear);
            }
        }, /*41*/1000);
    });
});
