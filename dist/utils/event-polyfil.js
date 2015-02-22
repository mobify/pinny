(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'deckard'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework);
    }
}(function($) {
    var instance;

    var EventPolyfill = window.EventPolyfill = function(event, callback) {
        this.event = event;
        this.callback = callback;
        this.interval = 1000;
        this.iOS7 = $.os.ios && $.os.major === 7;
        this.$window = $(window);
        this.previousHeight = this.$window.height();
        this.previousOrientation = this.getOrientation();

        this.iOS7 && this.start();

        this.$window.on(this.event, this.fn);
    };

    EventPolyfill.prototype.start = function() {
        var self = this;

        (function pollForResize() {
            self.timer = setTimeout(function() {
                var currentHeight = self.$window.height();
                var currentOrientation = self.getOrientation();

                if (self.previousOrientation === currentOrientation && Math.abs(self.previousHeight - currentHeight) > 10) {
                    console.log('triggering resize event')
                    self.previousHeight = currentHeight;
                    self.$window.trigger(self.event);
                } else {
                    self.previousOrientation = currentOrientation;
                }

                pollForResize();
            }, self.interval);
        })();
    };

    EventPolyfill.prototype.stop = function() {
        this.iOS7 && clearTimeout(this.timer);

        this.$window.off(this.event);
    };

    EventPolyfill.prototype.getOrientation = function() {
        return $.orientation.portrait ? 'portrait' : 'landscape';
    };

    EventPolyfill.on = function(event, fn) {
        if (!instance) {
            instance = new EventPolyfill(event, fn);
        }
    };

    EventPolyfill.off = function() {
        instance && instance.stop();
    };

    return EventPolyfill;
}));

