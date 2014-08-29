(function(factory) {
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
            var $window = $(window);
            var coverage = this._coverage(2);

            this.$pinny
                .css({
                    top: coverage ? coverage : ($window.height() - this.$pinny.height()) / 2,
                    bottom: coverage ? coverage : ($window.height() - this.$pinny.height()) / 2,
                    right: coverage ? coverage : ($window.width() - this.$pinny.width()) / 2,
                    left: coverage ? coverage : ($window.width() - this.$pinny.width()) / 2,
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
