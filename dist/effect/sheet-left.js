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
    return function() {
        var plugin = this;
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

        return {
            openGesture: 'swiperight',
            closeGesture: 'swipeleft',
            interactiveOpenGesture: 'panright',
            interactiveCloseGesture: 'panleft',
            open: function(percentage) {
                //percentage = percentage || '-100%';

                if (percentage) {
                    // plugin.$pinny.css('transform', 'translateX(-' + percentage + ')');
                    // plugin.$pinny.css('display', 'block');
                    Velocity.animate(
                        plugin.$pinny,
                        { translateX: '-' + percentage },
                        {
                            display: 'block'
                        }
                    );
                } else {
                    // Force feed the initial value
                    Velocity.animate(
                        plugin.$pinny,
                        { translateX: [0, '-100%'] },
                        {
                            easing: plugin.options.easing,
                            duration: plugin.options.duration,
                            display: 'block',
                            complete: plugin.animation.openComplete.bind(plugin)
                        }
                    );
                }

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

}));
