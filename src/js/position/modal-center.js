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
            var height = getDimension('height');
            var width = getDimension('width');

            this.$pinny
                .css({
                    top: coverage ? coverage : height,
                    bottom: coverage ? coverage : height,
                    right: coverage ? coverage : width,
                    left: coverage ? coverage : width,
                    width: coverage ? 'auto' : this.options.coverage,
                    height: coverage ? 'auto' : this.options.coverage
                });

            Velocity.animate(
                this.$pinny,
                {
                    scale: [1, 2],
                    opacity: [1, 0]
                },
                {
                    begin: this.animation.begin,
                    easing: this.options.easing,
                    duration: this.options.duration,
                    display: 'block',
                    complete: this.animation.complete
                }
            );
        },
        close: function() {
            Velocity.animate(
                this.$pinny,
                {
                    scale: 0.5,
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
