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
    var initialFocus;
    var isChrome = /chrome/i.test( navigator.userAgent );
    var isAndroid = /android/i.test( navigator.userAgent );
    var webkitVer = parseInt((/WebKit\/([0-9]+)/.exec(navigator.appVersion) || 0)[1],10) || void 0;
    var isAndroidBrowser = isAndroid && webkitVer < 537;

    /**
     * Function.prototype.bind polyfill required for < iOS6
     */
    /* jshint ignore:start */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (scope) {
            var fn = this;
            return function () {
                return fn.apply(scope);
            };
        };
    }
    /* jshint ignore:end */

    var classes = {
        OPENED: 'pinny--is-open'
    };

    /**
     * Template constants required for building the default HTML structure
     */
    var template = {
        COMPONENT: '<{0} class="pinny__{0}">{1}</{0}>',
        HEADER: '<h1 class="pinny__title">{0}</h1><button class="pinny__close" role="button">Close</button>',
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
        header: '',
        footer: false,
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

                this._focusPinny();
            },
            closeComplete: function() {
                this._trigger('closed');
                $doc.off('touchmove', this._blockScroll);

                this._unfocusPinny();
            }
        },

        _init: function(element) {
            var plugin = this;

            this.id = 'pinny-' + this._uuid();

            this.iOSVersion = this._iOSVersion();
            this.iOSVersion = (this.iOSVersion && this.iOSVersion[0]) || false;

            this.$element = $(element);
            this.$body = $(document.body);

            if (!$('.pinny__body-wrapper').length) {
                this.$body.wrapInner('<div class="pinny__body-wrapper">');
            }

            this.$bodyWrapper = this.$body.find('.pinny__body-wrapper');

            this.$pinny = $('<section />')
                .appendTo(this.$body)
                .addClass('pinny')
                .addClass(this.options.cssClass)
                .css({
                    position: 'fixed',
                    zIndex: this.options.zIndex,
                    width: this.options.coverage,
                    height: this.options.coverage
                })
                .on('click', '.pinny__close', function(e) {
                    e.preventDefault();
                    plugin.close();
                });

            if (this.options.header !== false) {
                this._build();
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

            bouncefix.add('pinny__content');

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
                if (!$(e.target).parents().hasClass('pinny__content')) {
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
            var $wrapper = $('<div />')
                .addClass('pinny__wrapper')
                .appendTo(this.$pinny);

            $(this._buildComponent('header'))
                .prependTo($wrapper);

            $('<div />')
                .addClass('pinny__content')
                .append(this.$element)
                .appendTo($wrapper);

            this.options.footer && $(this._buildComponent('footer')).appendTo($wrapper);

            this._initA11y();
        },

        _buildComponent: function(name) {
            var component = this.options[name];

            if (component === false) return $([]);

            component = this._isHtml(component) ? component : template[name.toUpperCase()].replace('{0}', component);

            return template.COMPONENT.replace(/\{0\}/g, name).replace(/\{1\}/g, component);
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
        },

        /**
         * Accessibility Considerations
         */
        _initA11y: function() {
            var headerID = this.id + '__header';
            var $header = this.$pinny.find('.pinny__header h1').first();
            var $wrapper = this.$pinny.find('.pinny__wrapper');

            this.$pinny
                .attr('role', 'dialog')
                .attr('aria-labelledby', headerID)
                .attr('aria-hidden', 'true')
                .attr('tabindex', '-1');

            $wrapper
                .attr('role', 'document');

            $header
                .attr('id', headerID);
        },

        _focusPinny: function() {
            initialFocus = document.activeElement;

            this._disableInputs();

            this.$pinny.attr('aria-hidden', 'false');

            this.$pinny.focus();
        },

        _unfocusPinny: function() {
            this._enableInputs();

            this.$pinny.attr('aria-hidden', 'true');

            initialFocus.focus();
        },

        /**
         * Trap any tabbing within the visible Pinny window
         */
        _disableInputs: function() {
            var focusableElementsString = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, [tabindex], [contenteditable]';

            var $focusableElements = $(focusableElementsString).not(function() {
                return $(this).closest('.pinny').length;
            });

            $focusableElements.each(function(idx, el) {
                var $el = $(el);
                var currentTabIndex = $el.attr('tabindex');

                if (!currentTabIndex) {
                    currentTabIndex = '';
                }

                $el
                    .attr('data-pinny-tabindex', currentTabIndex)
                    .attr('tabindex', '-1');
            });
        },

        _enableInputs: function() {
            var $disabledInputs = $('[data-pinny-tabindex]');

            $disabledInputs.each(function(idx, el) {
                var $el = $(el);
                var oldTabIndex = $el.attr('data-pinny-tabindex');

                if (oldTabIndex) {
                    $el.attr('tabindex', oldTabIndex);
                } else {
                    $el.removeAttr('tabindex');
                }

                $el.removeAttr('data-pinny-tabindex');
            });
        },

        _uuid: (function() {
            var uuid = 0;

            return function() {
                uuid += 1;
                return uuid;
            };
        })()
    });

    $('[data-pinny]').pinny();

    return $;
}));
