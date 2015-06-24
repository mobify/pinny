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
        this.polling = false;
        this.iOS7 = $.os.ios && $.os.major === 7;
        this.$window = $(window);
    };

    /**
     * Binds window resize and, for iOS7 devices where the resize event doesn't fire,
     * starts the resize polling that detects when resize is triggered.
     * @private
     */
    EventPolyfill.prototype._start = function() {
        var self = this;

        this.$window.on(this.event, function() {
            self.callback();
        });

        if (this.iOS7) {
            this.polling = true;
            this.previousHeight = this.$window.height();
            this.previousOrientation = this._getOrientation();

            (function pollForResize() {
                if (self.polling) {
                    self.timer = setTimeout(function() {
                        var currentHeight = self.$window.height();
                        var currentOrientation = self._getOrientation();

                        // if we're still in the same orientation as the last time we polled, and if the window has changed height,
                        // fire the callback! The height should have changed significantly, i.e. the address bar popped up.
                        if (self.previousOrientation === currentOrientation && Math.abs(self.previousHeight - currentHeight) > 10) {
                            self.callback();
                        } else {
                            self.previousOrientation = currentOrientation;
                        }

                        self.previousHeight = currentHeight;
                        pollForResize();
                    }, self.interval);
                }
            })();
        }

    };

    /**
     * Unbinds the resize event and, for iOS7 devices, stops the resize polling.
     * @private
     */
    EventPolyfill.prototype._stop = function() {
        this.iOS7 && (this.polling = false);

        this.$window.off(this.event);
    };

    EventPolyfill.prototype._getOrientation = function() {
        return $.orientation.portrait ? 'portrait' : 'landscape';
    };

    EventPolyfill.on = function(event, fn) {
        !instance && (instance = new EventPolyfill(event, fn));

        instance._start();
    };

    EventPolyfill.off = function() {
        instance && instance._stop();
    };

    return EventPolyfill;
}));

