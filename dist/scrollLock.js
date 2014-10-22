(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'bouncefix',
            'plugin'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.bouncefix, window.Plugin);
    }
}(function($, bouncefix, Plugin) {
    var classes = {
        CONTAINER: 'lockup__container',
        SCROLLABLE: 'scrolllock--is-scrollable'
    };

    function ScrollLock(element, options) {
        ScrollLock.__super__.call(this, element, options, ScrollLock.DEFAULTS);
    }

    ScrollLock.VERSION = '0';

    ScrollLock.DEFAULTS = {
        container: null
    };

    Plugin.create('scrollLock', ScrollLock, {
        _init: function(element) {
            this.$element = $(element);
            this.$html = $('html');
            this.$body = $('body');
            this.$doc = $(document);

            this.isChrome = /chrome/i.test(navigator.userAgent);
            this.iOSVersion = this._getiOSVersion();
            this.$element.appendTo(this.$container = this._buildContainer());
        },

        /**
         * The body content needs to be wrapped in a containing
         * element in order to facilitate scroll blocking. One can
         * either be supplied in the options, or we'll create one
         * automatically, and append all body content to it.
         */
        _buildContainer: function() {
            var $container = $('.' + classes.CONTAINER);

            if (this.options.container) {
                if (!$container.length) {
                    $container = $(this.options.container).addClass(classes.CONTAINER);
                }
            } else {
                if (!$container.length) {
                    $container = this._createContainer();
                }
            }

            return $container;
        },

        _createContainer: function() {
            // scripts must be disabled to avoid re-executing them
            var $scripts = this.$body.find('script')
                .renameAttr('src', 'x-src')
                .attr('type', 'text/pinny-script');

            var $container = $('<div />').addClass(classes.CONTAINER);

            this.$body.wrapInner($container);

            $scripts.renameAttr('x-src', 'src').attr('type', 'text/javascript');

            return $container;
        },

        container: function() {
            return this.$container;
        },

        /**
         * This function contains several methods for fixing scrolling issues
         * across different browsers. See each if statement for an in depth
         * explanation.
         */
        enable: function() {
            var self = this;

            var getCssProperty = function(name) {
                return parseInt(self.$body.css(name));
            };

            this.scrollPosition = this.$body.scrollTop();

            bouncefix.add(classes.SCROLLABLE);
            this.$doc.off('touchmove', this._preventDefault);

            /**
             * On Chrome, we can get away with fixing the position of the html
             * and moving it up to the equivalent of the scroll position
             * to lock scrolling.
             */
            if (this.isChrome) {
                this.$html.css('position', 'fixed');
                this.$html.css('top', this.scrollPosition * -1);
            }
            /**
             * On iOS8, we lock the height of Pinny's body wrapping div as well
             * as do some scrolling magic to make sure forms don't jump the page
             * around when they're focused.
             */
            else if (this.iOSVersion >= 8) {
                var bodyTotalPadding = getCssProperty('padding-top') + getCssProperty('padding-bottom');

                this.$body
                    .css('margin-top', 0)
                    .css('margin-bottom', 0)
                    .height(window.innerHeight)
                    .css('overflow', 'hidden')
                    .scrollTop(this.scrollPosition - bodyTotalPadding);
            }
            /**
             * On iOS7 and under, the browser can't handle what we're doing
             * above so we need to do the less sexy version. Wait for the
             * focus to trigger and then jump scroll back to the initial
             * position. Looks like crap but it works.
             */
            else if (this.iOSVersion <= 7) {
                this.$element.find('input, select, textarea')
                    .on('focus', function() {
                        setTimeout(function() {
                            window.scrollTo(0, self.scrollPosition);
                        }, 0);
                    });
            }
        },

        /**
         * Undo all the things above
         */
        disable: function() {
            bouncefix.remove(classes.SCROLLABLE);
            this.$doc.off('touchmove', this._preventDefault);

            if (this.isChrome) {
                this.$html.css('position', '');
                this.$html.css('top', '');
                window.scrollTo(0, this.scrollPosition);
            } else if (this.iOSVersion >= 8) {
                this.$body
                    .css('margin', '')
                    .css('overflow', '')
                    .css('height', '');

                window.scrollTo(0, this.scrollPosition);
            } else if (this.iOSVersion <= 7) {
                this.$element.find('input, select, textarea').off('focus');
            }
        },

        /**
         * Returns the current iOS Version Number
         */
        _getiOSVersion: function() {
            if (/ip(hone|od|ad)/i.test(navigator.platform)) {
                // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                v = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];

                return v && v[0] || 0;
            }

            return 0;
        },

        _preventDefault: function(e) {
            e.preventDefault();
        }
    });

    return $;
}));
