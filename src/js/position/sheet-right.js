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
                    right: 0,
                    left: coverage ? coverage : 'auto',
                    width: coverage ? 'auto' : this.options.coverage,
                    height: 'auto'
                });

            // Force feed the initial value
            Velocity.animate(this.$pinny, { translateX: ['100%', '100%'] }, 0);
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
