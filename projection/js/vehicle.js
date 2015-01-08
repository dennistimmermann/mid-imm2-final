var Vehicle = (function() {

    function Vehicle() {
        this.el = $('#vehicle');
        this.el.removeClass('down');
        this.el.removeClass('up');

        for (var i = 0; i < 3; i++) {
            this.el.removeClass('bicycle-' + (i + 1));
            this.el.removeClass('bus-' + (i + 1));
            this.el.removeClass('car-' + (i + 1));
            this.el.removeClass('train-' + (i + 1));
        }

        switch(this._randomInt(1, 2)) {
            case 1: 
                this.y = 1330; 
                this.direction = 'UP'; 
                this.el.css('top', this.y);
                this.el.addClass('up');
                break;
            case 2: 
                this.y = -250; 
                this.direction = 'DOWN'; 
                this.el.css('top', this.y);
                this.el.addClass('down');
                break;
            default: 
                this.direction = 'DOWN';
                this.el.css('top', this.y);
                this.el.addClass('down');
        }

        var vehicleLength = this._randomInt(1, 3);

        switch(this._randomInt(1, 4)) {
            case 1: 
                this.type = 'bicycle'; 
                this.speed = vehicleLength/1.5; 
                this.el.addClass('bicycle-' + vehicleLength); 
                break;
            case 3: 
                this.type = 'bus'; 
                this.speed = (vehicleLength * 2)/1.5; 
                this.el.addClass('bus-' + vehicleLength); 
                break;
            case 2: 
                this.type = 'car'; 
                this.speed = (vehicleLength * 3)/1.5; 
                this.el.addClass('car-' + vehicleLength); 
                break;
            case 4: 
                this.type = 'train'; 
                this.speed = (vehicleLength * 4)/1.5; 
                this.el.addClass('train-' + vehicleLength); 
                break;
            default: 
                this.type = 'bus'; 
                this.speed = (vehicleLength * 2)/1.5; 
                this.el.addClass('bus-' + vehicleLength);
        }

        console.log(this);
    }

    Vehicle.prototype.update = function() {
        if (this.direction === 'UP') {
            this.y -= this.speed;
        }
        
        if (this.direction === 'DOWN') {
            this.y += this.speed;
        }
        this.el.css('top', this.y);
    };

    Vehicle.prototype._randomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return Vehicle;

})();
window.Vehicle = Vehicle;
