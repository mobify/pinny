(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'velocity'
        ], factory);
    } else {
        factory(window.Zepto || window.jQuery);
    }
}(function($, Velocity) {
    return {
        open: function() {
            var coverage;

            if (this._isPercent(this.options.coverage)) {
                coverage = this._coverageCalc(this.options.coverage) + '%';
            }

            this.$pinny
                .css({
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: coverage ? coverage : 'auto',
                    height: 'auto',
                    width: coverage ? 'auto' : this.options.coverage
                });

            // Forcefeed the initial value
            Velocity.animate(this.$pinny, { translateX: ['-100%', '-100%'] }, 0);
            Velocity.animate(
                this.$pinny,
                { translateX: 0 },
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
