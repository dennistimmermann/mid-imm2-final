var Building = (function() {
    
    function Building(name, data) {
        $('#buildings').append('<div id="' + name + '-building" class="building"></div>');
        this.buildingEl = $('#' + name + '-building');
        this.data = data;

        if (data.info) {
            $('#infofields').append('<div id="' + name + '-infofield" class="infofield"><video class="opening hidden" width="450" height="360" nocontrols><source src="videos/infofield_opening.mp4" type="video/mp4"></video><div class="open hidden"><img src="images/infofield_open.png"></div><video class="closing hidden" nocontrols><source src="videos/infofield_closing.mp4" type="video/mp4"></video></div>');
            this.infoEl = $('#' + name + '-infofield');
            this.infofield = this.infoEl.find('.open');
            this.openingVideo = this.infoEl.find('video.opening');
            this.closingVideo = this.infoEl.find('video.closing');
            this.state = 0;
        }
    }

    Building.prototype.update = function(currentYear) {
        if (this.data.info && this.data.buildYear === currentYear) {
            // this.openingVideo.removeClass('hidden');
            // this.openingVideo.get(0).play();
            // console.log(this.openingVideo.get(0).currentTime);
            if (this.state === 0) {
                this.infofield.addClass('hidden');
                this.openingVideo.removeClass('hidden');
                this.openingVideo.get(0).currentTime = 0;
                this.openingVideo.get(0).play();
                console.log(this.openingVideo.get(0).currentTime)
                this.state = 1;
            }
            else if (this.state === 1 && this.openingVideo.get(0).currentTime >= this.openingVideo.get(0).duration) {
                this.openingVideo.addClass('hidden');
                this.infofield.removeClass('hidden');
                this.openingVideo.get(0).currentTime = 0;
                this.state = 2;
            }
            else if (this.state === 3) {
                this.closingVideo.get(0).currentTime = 0;
                this.infofield.addClass('hidden');
                this.closingVideo.get(0).play();
                this.closingVideo.removeClass('hidden');
                this.state = 4;
            }
            else if (this.state === 4 && this.closingVideo.get(0).currentTime >= this.closingVideo.get(0).duration) {
                this.infofield.addClass('hidden');
                this.closingVideo.addClass('hidden');
                this.infofield.removeClass('hidden');
                this.closingVideo.get(0).currentTime = 0;
                this.state = 0;
            }
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

    return Building;

})();
window.Building = Building;
