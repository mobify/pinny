(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'velocity'
        ], factory);
    } else {
        var framework = window.jQuery;
        factory(framework, framework.Velocity);
    }
})(function($, Velocity) {
    return function() {
        var plugin = this;
        var coverage = this._coverage();

        this.$pinny
            .css({
                bottom: 0,
                left: 0,
                right: 0,
                top: coverage ? coverage : 'auto',
                height: coverage ? 'auto' : this.options.coverage,
                width: 'auto'
            });

        return {
            open: function() {
                // Force feed the initial value
                Velocity.animate(
                    plugin.$pinny,
                    { translateY: [0, '100%'] },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'block',
                        complete: plugin.animation.openComplete.bind(plugin)
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    plugin.$pinny,
                    'reverse',
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'none',
                        complete: plugin.animation.closeComplete.bind(plugin)
                    }
                );
            }
        };
    };
});
