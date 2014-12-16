var Building = (function() {
    
    function Building(name, data) {
        $('#buildings').append('<div id="' + name + '-building" class="building"></div>');
        if (data.info) {
            $('#infofields').append('<div id="' + name + '-infofield" class="infofield"><video class="opening" width="450" height="360" nocontrols><source src="videos/infofield_opening.mp4" type="video/mp4"></video><div class="open hidden"></div><video class="closing hidden" nocontrols><source src="videos/infofield_closing.mp4" type="video/mp4"></video></div>');
            this.infoEl = $('#' + name + '-infofield');
            this.infoEl.find('.opening').get(0).play();
        }
        this.buildingEl = $('#' + name + '-building');
        this.data = data;
    }

    Building.prototype.update = function(currentYear) {
        if (this.data.buildYear <= currentYear) {
            this.buildingEl.addClass('visible');
        }
        else {
            this.buildingEl.removeClass('visible');
        }
    };

    return Building;

})();
window.Building = Building;
