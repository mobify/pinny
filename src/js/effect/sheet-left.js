(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'velocity'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, framework.Velocity);
    }
}(function($, Velocity) {
    return {
        open: function() {
            var coverage = this._coverage();

            this.$pinny
                .css({
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: coverage ? coverage : 'auto',
                    width: coverage ? 'auto' : this.options.coverage,
                    height: 'auto'
                });

            // Force feed the initial value
            Velocity.animate(
                this.$pinny,
                { translateX: [0, '-100%'] },
                {
                    easing: this.options.easing,
                    duration: this.options.duration,
                    display: 'block',
                    complete: this.animation.openComplete.bind(this)
                }
            );
        },
        close: function() {
            Velocity.animate(
                this.$pinny,
                'reverse',
                {
                    begin: this.animation.beginClose.bind(this),
                    easing: this.options.easing,
                    duration: this.options.duration,
                    display: 'none',
                    complete: this.animation.closeComplete.bind(this)
                }
            );
        }
    };
}));
