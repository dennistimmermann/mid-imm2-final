var Building = (function() {
    
    function Building(name, data) {
        $('#buildings').append('<div id="' + name + '-building" class="building"><video class="opening hidden" width="450" height="360" nocontrols><source src="videos/' + name + '_opening.mp4" type="video/mp4"></video><video class="closing hidden" width="450" height="360" nocontrols><source src="videos/' + name + '_closing.mp4" type="video/mp4"></video></div>');
        this.buildingEl = $('#' + name + '-building');
        this.openingVideo = this.buildingEl.find('video.opening');
        this.closingVideo = this.buildingEl.find('video.closing');
        this.data = data;
        this.state = 0;
        this.active = false;

        if (data.info) {
            $('#infofields').append('<div id="' + name + '-infofield" class="infofield"><video class="opening hidden" width="450" height="360" nocontrols><source src="videos/infofield_opening_' + this.data.info.faculty + '.mp4" type="video/mp4"></video><div class="open hidden"><img src="images/infofield_open_' + this.data.info.faculty + '.png"><div class="infofield_content"><img class="infofield_icon" src="images/icon_' + name + '.png"><div class="heading"><h2>' + this.data.buildYear + '</h2><h1>' + this.data.info.name + '</h1></div><p>' + this.data.info.text + '</p></div></div><video class="closing hidden" nocontrols><source src="videos/infofield_closing_' + this.data.info.faculty + '.mp4" type="video/mp4"></video></div>');
            this.infoEl = $('#' + name + '-infofield');
            this.infofield = this.infoEl.find('.open');
            this.infofieldOpeningVideo = this.infoEl.find('video.opening');
            this.infofieldClosingVideo = this.infoEl.find('video.closing');
        }
    }

    Building.prototype.update = function(currentYear) {
        if (this.data.info && this.data.buildYear === currentYear) { 
            this.animateIn();
        }

        if (this.data.info && this.data.buildYear !== currentYear) {
            this.animateOut();
        }


        if (this.data.buildYear <= currentYear) {
            this.buildingEl.addClass('visible');

            if (this.data.info) {
                this.infoEl.addClass('visible');
            }
        }
        else {
            this.buildingEl.removeClass('visible');

            if (this.data.info) {
                this.infoEl.removeClass('visible');
            }
        }
    };

    Building.prototype.animateIn = function() {
        if (this.state === 0) {
            this.active = true;
            this.openingVideo.removeClass('hidden');
            this.openingVideo.currentTime = 0;
            this.openingVideo.get(0).play();

            if (this.data.info) {
                this.infofield.addClass('hidden');
                this.infofieldOpeningVideo.removeClass('hidden');
                this.infofieldOpeningVideo.get(0).currentTime = 0;
                this.infofieldOpeningVideo.get(0).play();
            }
            this.state = 1;
        }
        else if (this.state === 1 && this.openingVideo.get(0).currentTime >= this.openingVideo.get(0).duration) {
            if (this.data.info) {
                this.infofield.removeClass('hidden');
                this.infofieldOpeningVideo.addClass('hidden');
                this.infofieldOpeningVideo.get(0).currentTime = 0;
            }
            this.state = 2;
        }
    };

    Building.prototype.animateOut = function() {
        if (this.state === 3) {
            this.closingVideo.get(0).currentTime = 0;
            this.closingVideo.get(0).play();
            this.closingVideo.removeClass('hidden');
            this.openingVideo.addClass('hidden');

            if (this.data.info) {
                this.infofieldClosingVideo.get(0).currentTime = 0;
                this.infofieldClosingVideo.get(0).play();
                this.infofieldClosingVideo.removeClass('hidden');
                this.infofield.addClass('hidden');
            }
            this.state = 4;
        }
        else if (this.state === 4 && this.closingVideo.get(0).currentTime >= this.closingVideo.get(0).duration) {
            this.openingVideo.get(0).currentTime = 0;
            this.closingVideo.addClass('hidden');
            this.openingVideo.addClass('hidden');

            if (this.data.info) {
                this.infofield.addClass('hidden');
                this.infofieldClosingVideo.addClass('hidden');
                this.infofield.addClass('hidden');
                this.infofieldClosingVideo.get(0).currentTime = 0;
            }

            this.state = 0;
            this.active = false;
        }
    };

    return Building;

})();
window.Building = Building;
