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
        var lastKnownCoverage;

        return {
            openGesture: 'swiperight',
            closeGesture: 'swipeleft',
            interactiveOpenGesture: 'panright',
            interactiveCloseGesture: 'panleft',
            open: function(percentage) { // Accepts a percentage value to open by 0 - 100
                console.log('open: ', percentage);

                if (percentage) {
                    // Translate to percentage open on screen
                    percentage = -1 * (100 - percentage);

                    plugin.$pinny.css('-webkit-transform', 'translateX(' + percentage + '%)');
                    plugin.$pinny.css('transform', 'translateX(' + percentage + '%)');
                    plugin.$pinny.css('display', 'block');
                    lastKnownCoverage = percentage;
                } else {
                    // Force feed the initial value
                    Velocity.animate(
                        plugin.$pinny,
                        { translateX: lastKnownCoverage ? [0, lastKnownCoverage + '%'] : [0, '-100%'] },
                        {
                            easing: plugin.options.easing,
                            duration: plugin.options.duration,
                            display: 'block',
                            complete: plugin.animation.openComplete.bind(plugin)
                        }
                    );

                    lastKnownCoverage = '';
                }

            },
            close: function(percentage) {  // Accepts a percentage value to close by 0 - 100
                console.log('close: ', percentage);
                if (percentage) {
                    plugin.$pinny.css('-webkit-transform', 'translateX(-' + percentage + '%)');
                    plugin.$pinny.css('transform', 'translateX(-' + percentage + '%)');

                    lastKnownCoverage = percentage;
                } else {
                    Velocity.animate(
                        plugin.$pinny,
                        { translateX: lastKnownCoverage ? ['-100%', '-' + lastKnownCoverage + '%'] : ['-100%', 0] },
                        {
                            easing: plugin.options.easing,
                            duration: plugin.options.duration,
                            display: 'none',
                            complete: plugin.animation.closeComplete.bind(plugin)
                        }
                    );

                    lastKnownCoverage = '';
                }
            }
        };
    };

}));
