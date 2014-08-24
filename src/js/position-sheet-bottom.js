(function (factory) {
    if (typeof define === 'function' && define.amd) {
        /*
         In AMD environments, you will need to define an alias
         to your selector engine. i.e. either zepto or jQuery.
         */
        define([
            'selectorEngine'
        ], factory);
    } else {
        /*
         Browser globals
         */
        factory(window.Zepto || window.jQuery);
    }
}(function($) {
    return {
        open: function() {
            var plugin = this;
            var coverage = this._coverageCalc(this.options.coverage) + '%';

            this.$pinny
                .css({
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: coverage,
                    height: 'auto',
                    width: 'auto'
                })
                // Forcefeed the initial value
                .velocity({ translateY: ['100%', '100%'] }, 0)
                .velocity(
                    {
                        translateY: 0
                    },
                    {
                        begin: function() {
                            $('html')
                                .css('overflow', 'hidden');
                        },
                        easing: this.options.easing,
                        duration: this.options.duration,
                        display: 'flex',
                        complete: function() {
                            $(document).off('touchmove', plugin.blockScroll);
                        }
                    }
                );
        },
        close: function() {
            var plugin = this;

            this.$pinny
                .velocity(
                    'reverse',
                    {
                        begin: function() {
                            $(document).on('touchmove', plugin.blockScroll);

                            $('html')
                                .css('overflow', '');
                        },
                        easing: this.options.easing,
                        duration: this.options.duration,
                        display: 'none',
                        complete: function() {
                            $(document).off('touchmove', plugin.blockScroll);
                        }
                    }
                );
        }
    };
}));
