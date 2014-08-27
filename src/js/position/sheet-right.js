(function (factory) {
    if (typeof define === 'function' && define.amd) {
        /*
         In AMD environments, you will need to define an alias
         to your selector engine. i.e. either zepto or jQuery.
         */
        define([
            '$',
            'velocity'
        ], factory);
    } else {
        /*
         Browser globals
         */
        factory(window.Zepto || window.jQuery);
    }
}(function($, Velocity) {
    return {
        open: function() {
            if (this._isPercent(this.options.coverage)) {
                var coverage = this._coverageCalc(this.options.coverage) + '%';
            }

            this.$pinny
                .css({
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: coverage ? coverage : 'auto',
                    height: 'auto',
                    width: coverage ? 'auto' : this.options.coverage
                });
                // Forcefeed the initial value
                Velocity.animate(this.$pinny, { translateX: ['100%', '100%'] }, 0);
                Velocity.animate(
                    this.$pinny,
                    {
                        translateX: 0
                    },
                    {
                        begin: this.animation.begin,
                        easing: this.options.easing,
                        duration: this.options.duration,
                        display: 'flex',
                        complete: this.animation.complete
                    }
                );
        },
        close: function() {
            Velocity.animate(
                this.$pinny,
                'reverse',
                {
                    begin: this.animation.beginClose,
                    easing: this.options.easing,
                    duration: this.options.duration,
                    display: 'none',
                    complete: this.animation.complete
                }
            );
        }
    };
}));
