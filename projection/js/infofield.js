var Infofield = (function() {
    
    function Infofield(name, data) {
        $('#infofields').append('<div id="' + name + '-info" class="infofield"></div>');
        this.el = $('#' + name + '-info');
        this.buildYear = data.buildYear;
        this.data = data.info;
    }

    Infofield.prototype.update = function(currentYear) {
        if (this.buildYear <= currentYear) {
            this.el.addClass('visible');
        }
        else {
            this.el.removeClass('visible');
        }
    };

    return Infofield;

})();
window.Infofield = Infofield;
