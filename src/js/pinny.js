(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'bouncefix',
            'plugin',
            'shade'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.bouncefix, window.Plugin);
    }
}(function($, bouncefix, Plugin) {
    var $doc = $(document);
    var $html = $('html');
    var scrollPosition;
    var isChrome = /chrome/i.test(navigator.userAgent);

    /**
     * Function.prototype.bind polyfill required for < iOS6
     */
    /* jshint ignore:start */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(scope) {
            var fn = this;
            return function() {
                return fn.apply(scope);
            };
        };
    }
    /* jshint ignore:end */

    var classes = {
        PINNY: 'pinny',
        BODYWRAPPER: 'pinny__body-wrapper',
        WRAPPER: 'pinny__wrapper',
        TITLE: 'pinny__title',
        CLOSE: 'pinny__close',
        CONTENT: 'pinny__content',
        OPENED: 'pinny--is-open'
    };

    /**
     * Template constants required for building the default HTML structure
     */
    var template = {
        COMPONENT: '<{0} class="' + classes.PINNY + '__{0}">{1}</{0}>',
        HEADER: '<h1 class="' + classes.TITLE + '">{0}</h1><button class="' + classes.CLOSE + '">Close</button>',
        FOOTER: '{0}'
    };

    function Pinny(element, options) {
        Pinny.__super__.call(this, element, options, Pinny.DEFAULTS);
    }

    Pinny.VERSION = '0';

    Pinny.DEFAULTS = {
        effect: {
            open: $.noop,
            close: $.noop
        },
        structure: {
            header: '',
            footer: false
        },
        zIndex: 2,
        cssClass: '',
        coverage: '100%',
        easing: 'swing',
        duration: 200,
        shade: {},
        open: $.noop,
        opened: $.noop,
        close: $.noop,
        closed: $.noop
    };

    Plugin.create('pinny', Pinny, {
        /**
         * Common animation callbacks used in the effect objects
         */
        animation: {
            beginClose: function() {
                $doc.on('touchmove', this._blockScroll);
            },
            openComplete: function() {
                this._trigger('opened');
                $doc.off('touchmove', this._blockScroll);
            },
            closeComplete: function() {
                this._trigger('closed');
                $doc.off('touchmove', this._blockScroll);
            }
        },

        _init: function(element) {
            var plugin = this;

            this.iOSVersion = this._iOSVersion();
            this.iOSVersion = (this.iOSVersion && this.iOSVersion[0]) || false;

            this.$element = $(element);
            this.$body = $('body');

            if (!$('.' + classes.BODYWRAPPER).length) {
                this.$bodyWrapper = $('<div>').addClass(classes.BODYWRAPPER);
                this.$body.wrapInner(this.$bodyWrapper);
            } else {
                this.$bodyWrapper = this.$body.find('.' + classes.BODYWRAPPER);
            }

            this.$pinny = $('<section />')
                .appendTo(this.$body)
                .addClass(classes.PINNY)
                .addClass(this.options.cssClass)
                .css({
                    position: 'fixed',
                    zIndex: this.options.zIndex,
                    width: this.options.coverage,
                    height: this.options.coverage
                })
                .on('click', '.' + classes.CLOSE, function(e) {
                    e.preventDefault();
                    plugin.close();
                });

            this._build();

            bouncefix.add(classes.CONTENT);

            this.effect = this.options.effect;

            this.$element.removeAttr('hidden');

            this._bindEvents();
        },

        toggle: function() {
            this[this.$pinny.hasClass(classes.OPENED) ? 'close' : 'open']();
        },

        open: function() {
            this._trigger('open');

            this.options.shade && this.$shade.shade('open');

            this.effect.open.call(this);

            this.$pinny.addClass(classes.OPENED);

            this._enableScrollFix();
        },

        close: function() {
            this._trigger('close');

            this.options.shade && this.$shade.shade('close');

            this.$pinny.removeClass(classes.OPENED);

            this.effect.close.call(this);

            this._disableScrollFix();
        },

        _bindEvents: function() {
            // Block scrolling on anything but pinny content
            this.$pinny.on('touchmove', function(e) {
                if (!$(e.target).parents().hasClass(classes.CONTENT)) {
                    e.preventDefault();
                }
            });
        },

        /**
         Builds Pinny using the following structure:

         <section class="pinny">
         <div class="pinny__wrapper">
         <header class="pinny__header">{header content}</header>
         <div class="pinny__content">
         {content}
         </div>
         </div>
         <footer class="pinny__footer"></footer>
         </section>
         */
        _build: function() {
            var plugin = this;

            if (this.options.structure) {
                var $wrapper = $('<div />')
                    .addClass(classes.WRAPPER)
                    .appendTo(this.$pinny);

                this._buildComponent('header').appendTo($wrapper);

                $('<div />')
                    .addClass(classes.CONTENT)
                    .append(this.$element)
                    .appendTo($wrapper);

                this._buildComponent('footer').appendTo($wrapper);
            } else {
                this.$element.appendTo(this.$pinny);
            }

            if (this.options.shade) {
                this.$shade = this.$pinny.shade($.extend(true, {}, {
                    click: function() {
                        plugin.close();
                    }
                }, $.extend(
                    this.options.shade,
                    {
                        duration: this.options.duration
                    }
                )));
            }
        },

        _buildComponent: function(name) {
            var component = this.options.structure[name];
            var $element = $([]);

            if (component !== false) {
                var html = this._isHtml(component) ? component : template[name.toUpperCase()].replace('{0}', component);

                $element = $(template.COMPONENT.replace(/\{0\}/g, name).replace(/\{1\}/g, html));
            }

            return $element;
        },

        _isHtml: function(input) {
            return /<[a-z][\s\S]*>/i.test(input);
        },

        _blockScroll: function(e) {
            e.preventDefault();
        },

        /**
         * Takes the coverage option and turns it into a effect value
         */
        _coverage: function(divisor) {
            var coverage;
            var percent = this.options.coverage.match(/(\d*)%$/);

            if (percent) {
                coverage = 100 - parseInt(percent[1]);

                if (divisor) {
                    coverage = coverage / divisor;
                }
            }

            return percent ? coverage + '%' : this.options.coverage;
        },

        /**
         * This function contains several methods for fixing scrolling issues
         * across different browsers. See each if statement for an in depth
         * explanation.
         */
        _enableScrollFix: function() {
            scrollPosition = document.body.scrollTop;

            /**
             * On Chrome, we can get away with fixing the position of the html
             * and moving it up to the equivalent of the scroll position
             * to lock scrolling.
             */
            if (isChrome) {
                $html.css('position', 'fixed');
                $html.css('top', scrollPosition * -1);
            }
            /**
             * On iOS8, we lock the height of Pinny's body wrapping div as well
             * as do some scrolling magic to make sure forms don't jump the page
             * around when they're focused.
             */
            else if (this.iOSVersion >= 8) {
                var bodyTopPadding = parseInt(
                    getComputedStyle(document.body).paddingTop
                );
                var bodyBottomPadding = parseInt(
                    getComputedStyle(document.body).paddingBottom
                );
                var bodyTotalPadding = bodyTopPadding + bodyBottomPadding;

                this.$body
                    .css('margin-top', 0)
                    .css('margin-bottom', 0);

                this.$bodyWrapper
                    .height(window.innerHeight)
                    .css('overflow', 'hidden')
                    .scrollTop(scrollPosition - bodyTotalPadding);
            }
            /**
             * On iOS7 and under, the browser can't handle what we're doing
             * above so we need to do the less sexy version. Wait for the
             * focus to trigger and then jump scroll back to the initial
             * position. Looks like crap but it works.
             */
            else if (this.iOSVersion <= 7) {
                this.$pinny.find('input, select, textarea')
                    .bind('focus', function() {
                        setTimeout(function() {
                            window.scrollTo(0, scrollPosition);
                        }, 0);
                    });
            }
        },

        /**
         * Undo all the things above
         */
        _disableScrollFix: function() {
            if (isChrome) {
                $html.css('position', '');
                $html.css('top', '');
                window.scrollTo(0, scrollPosition);
            } else if (this.iOSVersion >= 8) {
                this.$body
                    .css('margin', '');

                this.$bodyWrapper
                    .css('overflow', '')
                    .css('height', '');

                window.scrollTo(0, scrollPosition);
            } else if (this.iOSVersion <= 7) {
                this.$pinny.find('input, select, textarea').unbind('focus');
            }
        },

        /**
         * Returns the current iOS Version Number
         */
        _iOSVersion: function() {
            if (/ip(hone|od|ad)/i.test(navigator.platform)) {
                // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
            }
        }
    });

    $('[data-pinny]').pinny();

    return $;
}));
