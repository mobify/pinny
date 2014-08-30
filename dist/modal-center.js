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
            var plugin = this;
            var $window = $(window);
            var coverage = this._coverage(2);
            var size = {};
            var getDimension = function(dimension) {
                if (!size[dimension]) {
                    size[dimension] = $window[dimension]() - plugin.$pinny[dimension]() / 2;
                }
                return size[dimension];
            };

            this.$pinny
                .css({
                    top: coverage ? coverage : getDimension('height'),
                    bottom: coverage ? coverage : getDimension('height'),
                    right: coverage ? coverage : getDimension('width'),
                    left: coverage ? coverage : getDimension('width'),
                    width: coverage ? 'auto' : this.options.coverage,
                    height: coverage ? 'auto' : this.options.coverage
                });

            Velocity.animate(this.$pinny, { scale: [2, 2], opacity: [0, 0] }, 0);
            Velocity.animate(
                this.$pinny,
                {
                    scale: 1,
                    opacity: 1
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
                {
                    scale: 0,
                    opacity: 0
                },
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
