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
            var $window = $(window);

            if (this._isPercent(this.options.coverage)) {
                var coverage = (this._coverageCalc(this.options.coverage) / 2) + '%';
            }

            this.$pinny
                .css({
                    top: coverage ? coverage : (($window.height() - this.$pinny.height()) / 2),
                    bottom: coverage ? coverage : ($window.height() - this.$pinny.height()) / 2,
                    right: coverage ? coverage : ($window.width() - this.$pinny.width()) / 2,
                    left: coverage ? coverage : ($window.width() - this.$pinny.width()) / 2,
                    width: coverage ? 'auto' : this.options.coverage,
                    height: coverage ? 'auto': this.options.coverage
                })
                .velocity({ scale: [0, 0] }, 0)
                .velocity(
                    {
                        scale: 1
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
