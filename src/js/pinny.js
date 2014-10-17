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
    var isChrome = /chrome/i.test( navigator.userAgent );

    var EFFECT_REQUIRED = 'Pinny requires a declared effect to operate. For more information read: https://github.com/mobify/pinny#initializing-the-plugin';
    var CONTAINER_EXISTS = 'An container option was specified, but a previous Pinny has already created a container. All Pinny\'s must use the same container';

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

    $.extend($.fn, {
        renameAttr: function(oldName, newName) {
            return this.each(function() {
                var $el = $(this);
                $el
                    .attr(newName, $el.attr(oldName))
                    .removeAttr(oldName);
            });
        }
    });

    var classes = {
        PINNY: 'pinny',
        CONTAINER: 'pinny__container',
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
        effect: null,
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
        closed: $.noop,
        container: null
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

                this._focus();
            },
            closeComplete: function() {
                this._trigger('closed');
                $doc.off('touchmove', this._blockScroll);

                this._resetFocus();
            }
        },

        _init: function(element) {
            this.id = 'pinny-' + $.uniqueId();

            this.iOSVersion = this._iOSVersion();

            this.$element = $(element);
            this.$body = $('body');

            this._build();

            bouncefix.add(classes.CONTENT);

            if (!this.options.effect) {
                throw EFFECT_REQUIRED;
            }

            this.effect = this.options.effect.call(this);

            this.$element.removeAttr('hidden');

            this._bindEvents();
        },

        toggle: function() {
            this[this.$pinny.hasClass(classes.OPENED) ? 'close' : 'open']();
        },

        open: function() {
            this._trigger('open');

            bouncefix.add('pinny__content');

            this.effect.open.call(this);

            this.options.shade && this.$shade.shade('open');

            this.$pinny.addClass(classes.OPENED);

            this._enableScrollFix();
        },

        close: function() {
            this._trigger('close');

            bouncefix.remove('pinny__content');

            this.$pinny.removeClass(classes.OPENED);

            this.options.shade && this.$shade.shade('close');

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
                <footer class="pinny__footer">{footer content}</footer>
         </div>
         </section>
         */
        _build: function() {
            var plugin = this;

            this.$container = this._buildContainer();

            this.$pinny = $('<section />')
                .appendTo(this.$container)
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

            this._addAccessibility();

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
            var plugin = this;
            var getCssProperty = function(name) {
                return parseInt(plugin.$body.css(name));
            };

            this.scrollPosition = document.body.scrollTop;

            /**
             * On Chrome, we can get away with fixing the position of the html
             * and moving it up to the equivalent of the scroll position
             * to lock scrolling.
             */
            if (isChrome) {
                $html.css('position', 'fixed');
                $html.css('top', this.scrollPosition * -1);
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
                this.$pinny.find('input, select, textarea')
                    .on('focus', function() {
                        setTimeout(function() {
                            window.scrollTo(0, plugin.scrollPosition);
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
                window.scrollTo(0, this.scrollPosition);
            } else if (this.iOSVersion >= 8) {
                this.$body
                    .css('margin', '')
                    .css('overflow', '')
                    .css('height', '');

                window.scrollTo(0, this.scrollPosition);
            } else if (this.iOSVersion <= 7) {
                this.$pinny.find('input, select, textarea').off('focus');
            }
        },

        /**
         * Returns the current iOS Version Number
         */
        _iOSVersion: function() {
            if (/ip(hone|od|ad)/i.test(navigator.platform)) {
                // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                v = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];

                return v && v[0] || 0;
            }

            return 0;
        },

        /**
         * Accessibility Considerations
         */
        _addAccessibility: function() {
            var headerID = this.id + '__header';
            var $header = this.$pinny.find('h1, .' + classes.TITLE).first();
            var $wrapper = this.$pinny.find('.' + classes.WRAPPER);

            this.$container
                .attr('aria-hidden', 'false');

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

        _focus: function() {
            this.originalActiveElement = document.activeElement;

            this._disableInputs();

            this.$pinny.attr('aria-hidden', 'false');

            this.$pinny.focus();

            this.$container.attr('aria-hidden', 'true');
        },

        _resetFocus: function() {
            this._enableInputs();

            this.$container.attr('aria-hidden', 'false');

            this.$pinny.attr('aria-hidden', 'true');

            this.originalActiveElement.focus();
        },

        /**
         * Trap any tabbing within the visible Pinny window
         */
        _disableInputs: function() {
            var focusableElementsString = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, [tabindex], [contenteditable]';

            var $focusableElements = $(focusableElementsString).not(function() {
                return $(this).closest('.pinny').length;
            });

            $focusableElements.each(function(_, el) {
                var $el = $(el);
                var currentTabIndex = $el.attr('tabindex') || 0;

                $el
                    .data('tabindex', currentTabIndex)
                    .attr('tabindex', '-1');
            });
        },

        _enableInputs: function() {
            var $disabledInputs = $('[data-pinny-tabindex]');

            $disabledInputs.each(function(_, el) {
                var $el = $(el);
                var oldTabIndex = $el.data('tabindex');

                if (oldTabIndex) {
                    $el.attr('tabindex', oldTabIndex);
                } else {
                    $el.removeAttr('tabindex');
                }

                $el.removeData('tabindex');
            });
        }
    });

    $('[data-pinny]').each(function() {
        var $pinny = $(this);
        var effect = $(this).data('pinny');

        if (!effect.length) {
            throw EFFECT_REQUIRED;
        }

        $pinny.pinny({
            effect: effect
        });
    });

    return $;
}));
