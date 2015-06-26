(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'velocity',
            'hammer'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, framework.Velocity);
    }
}(function($, Velocity, Hammer) {
    return function() {
        var plugin = this;
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

        var currentCoverage = 0;
        var setVisibility = function (dPercent) {

            if (dPercent < 0 || dPercent > 100) {
                return;
            }

            dPercent = 100 - dPercent;
            // Translate to percentage open on screen
            plugin.$pinny.css('-webkit-transform', 'translateX(' + dPercent + '%)');
            plugin.$pinny.css('transform', 'translateX(' + dPercent + '%)');

            currentCoverage = dPercent;

            if (dPercent < 100) {
                plugin.$pinny.css('display', 'block');
            } else {
                plugin.$pinny.css('display', 'none');
            }
        };

        return {
            openDirection: Hammer.DIRECTION_LEFT,
            open: function(dPercent) {
                console.log('Open: ', dPercent);
                if (dPercent) {
                    setVisibility(dPercent);
                } else {
                    // Force feed the initial value
                    Velocity.animate(
                        plugin.$pinny,
                        { translateX: currentCoverage ? [0, currentCoverage + '%'] : [0, '100%'] },
                        {
                            easing: plugin.options.easing,
                            duration: plugin.options.duration,
                            display: 'block',
                            complete: plugin.animation.openComplete.bind(plugin)
                        }
                    );
                }
            },
            close: function(dPercent) {
                console.log('Close: ', dPercent);
                if (dPercent) {
                    setVisibility(100 - dPercent);
                } else {
                    Velocity.animate(
                        plugin.$pinny,
                        { translateX: currentCoverage ? ['100%',  currentCoverage + '%'] : ['100%', 0] },
                        {
                            easing: plugin.options.easing,
                            duration: plugin.options.duration,
                            display: 'none',
                            complete: plugin.animation.closeComplete.bind(plugin)
                        }
                    );
                }
            }
        };
    };

}));
