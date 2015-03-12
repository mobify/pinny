(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'plugin',
            'bouncefix',
            'event-polyfill',
            'velocity',
            'lockup',
            'shade',
            'deckard',
            'isChildOf'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, window.bouncefix, window.EventPolyfill);
    }
}(function($, Plugin, bouncefix, EventPolyfill, Velocity) {
    var EFFECT_REQUIRED = 'Pinny requires a declared effect to operate. For more information read: https://github.com/mobify/pinny#initializing-the-plugin';
    var FOCUSABLE_ELEMENTS = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, [tabindex], [contenteditable]';
    var FOCUSABLE_INPUT_ELEMENTS = 'input, select, textarea';

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

    var $window = $(window);
    var iOS7orBelow = $.os.ios && $.os.major <= 7;

    var classes = {
        PINNY: 'pinny',
        HEADER: 'pinny__header',
        WRAPPER: 'pinny__wrapper',
        SPACER: 'pinny__spacer',
        TITLE: 'pinny__title',
        CLOSE: 'pinny__close',
        CONTENT: 'pinny__content',
        OPENED: 'pinny--is-open',
        SCROLLABLE: 'pinny--is-scrollable'
    };

    /**
     * Template constants required for building the default HTML structure
     */
    var template = {
        COMPONENT: '<{0} class="' + classes.PINNY + '__{0}">{1}</{0}>',
        HEADER: '<h1 class="' + classes.TITLE + '">{0}</h1><button class="' + classes.CLOSE + '">Close</button>',
        FOOTER: '{0}'
    };

    var events = {
        click: 'click.pinny',
        focus: 'focus.pinny',
        blur: 'blur.pinny',
        resize: 'resize.pinny',
        orientationchange: 'orientationchange.pinny'
    };

    function Pinny(element, options) {
        Pinny.__super__.call(this, element, options, Pinny.DEFAULTS);
    }

    Pinny.VERSION = '2.0.2';

    Pinny.DEFAULTS = {
        effect: null,
        container: null,
        appendTo: null,
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
        scrollDuration: 50,
        spacerHeight: 300
    };

    Plugin.create('pinny', Pinny, {
        /**
         * Common animation callbacks used in the effect objects
         */
        animation: {
            openComplete: function() {
                var plugin = this;
                this._disableExternalInputs();
                this._focus();

                // only run lockup if another pinny isn't
                // open and locked the viewport up already
                !this._activePinnies() && this.$pinny.lockup('lock');

                EventPolyfill.on(events.resize, function() {
                    plugin._repaint();
                });

                if (!this._activePinnies() && iOS7orBelow) {
                    $window.on(events.orientationchange, this._blurActiveElement.bind(this));
                }

                this.$pinny
                    .addClass(classes.OPENED)
                    .attr('aria-hidden', 'false');

                this.$container.attr('aria-hidden', 'true');

                this._trigger('opened');
            },
            closeComplete: function() {
                this.$pinny
                    .removeClass(classes.OPENED)
                    .attr('aria-hidden', 'true');

                this._enableExternalInputs();
                this._resetFocus();

                // only unlock if there isn't another pinny
                // that requires the viewport to be locked
                if (!this._activePinnies()) {
                    this.$pinny.lockup('unlock');
                    EventPolyfill.off(events.resize);
                    $window.off(events.orientationchange);
                }

                this.$container.attr('aria-hidden', 'false');

                this._trigger('closed');
            }
        },

        _init: function(element) {
            this.id = 'pinny-' + $.uniqueId();

            this.$element = $(element);
            this.$doc = $(document);
            this.$body = $('body');

            this._build();

            if (!this.options.effect) {
                throw EFFECT_REQUIRED;
            }

            this.effect = this.options.effect.call(this);

            this.$element.removeAttr('hidden');

            this._bindEvents();
        },

        destroy: function() {
            this.$pinny.lockup('destroy');
            this.$pinny.shade('destroy');
            this.$pinny.remove();

            EventPolyfill.off();

            this.$element
                .appendTo(document.body)
                .removeData(this.name);
        },

        toggle: function() {
            this[this.$pinny.hasClass(classes.OPENED) ? 'close' : 'open']();
        },

        open: function() {
            if (this._isOpen()) {
                return;
            }

            this._trigger('open');

            bouncefix.add(classes.SCROLLABLE);

            this.options.shade && this.$shade.shade('open');

            this.effect.open.call(this);
        },

        close: function() {
            if (!this._isOpen()) {
                return;
            }

            this._trigger('close');

            bouncefix.remove(classes.SCROLLABLE);

            this.options.shade && this.$shade.shade('close');

            this.effect.close.call(this);
        },

        _isOpen: function() {
            return this.$pinny.hasClass(classes.OPENED);
        },

        _bindEvents: function() {
            var plugin = this;
            var container = this.$pinny;

            // Block scrolling on anything but pinny content
            container.on('touchmove', function(e) {
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

            this.$pinny = $('<section />')
                .addClass(classes.PINNY)
                .addClass(this.options.cssClass)
                .css({
                    position: 'fixed',
                    zIndex: this.options.zIndex,
                    width: this.options.coverage,
                    height: this.options.coverage
                })
                .on(events.click, '.' + classes.CLOSE, function(e) {
                    e.preventDefault();
                    plugin.close();
                })
                .lockup({
                    container: this.options.container,
                    locked: function() {
                        plugin._handleKeyboardShown();
                    },
                    unlocked: function() {
                        plugin._handleKeyboardHidden();
                    }
                });

            this.$container = this.$pinny.data('lockup').$container;

            this.$pinny.appendTo(this.options.appendTo ? $(this.options.appendTo) : this.$container);

            if (this.options.structure) {
                var $wrapper = $('<div />')
                    .addClass(classes.WRAPPER)
                    .appendTo(this.$pinny);

                this._buildComponent('header').appendTo($wrapper);

                $('<div />')
                    .addClass(classes.CONTENT)
                    .addClass(classes.SCROLLABLE)
                    .append(this.$element)
                    .append(this.$spacer)
                    .appendTo($wrapper);

                this._buildComponent('footer').appendTo($wrapper);
            } else {
                this.$element.appendTo(this.$pinny);
            }

            this.$header = this.$pinny.find('.' + classes.HEADER);
            this.$content = this.$pinny.find('.' + classes.CONTENT);

            this.$spacer = $('<div />')
                .addClass(classes.SPACER)
                .height(this.options.spacerHeight)
                .attr('hidden', 'hidden')
                .appendTo(this.$content);

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

        _isHtml: function(input) {
            return /<[a-z][\s\S]*>/i.test(input);
        },

        /**
         * @returns {boolean} indicating if there are any active pinnies on the page
         */
        _activePinnies: function() {
            return !!$('.' + classes.OPENED).length;
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

        _repaint: function() {
            window.scrollTo(document.body.scrollLeft, document.body.scrollTop + 1);
        },

        _focus: function() {
            this.originalActiveElement = document.activeElement;

            this.$pinny.children().first().focus();
        },

        _resetFocus: function() {
            this.originalActiveElement && this.originalActiveElement.focus();
        },

        /**
         * Traps any tabbing within the visible Pinny window
         * by disabling tabbing into all inputs outside of
         * pinny using a negative tabindex.
         */
        _disableExternalInputs: function() {
            // If lockup is already locked don't try to disable inputs again
            if (this.$pinny.lockup('isLocked')) {
                return;
            }

            var $focusableElements = $(FOCUSABLE_ELEMENTS).not(function() {
                return $(this).isChildOf('.' + classes.PINNY);
            });

            $focusableElements.each(function(_, el) {
                var $el = $(el);
                var currentTabIndex = $el.attr('tabindex') || 0;

                $el
                    .attr('data-orig-tabindex', currentTabIndex)
                    .attr('tabindex', '-1');
            });
        },

        /**
         * Re-enables tabbing in inputs not inside Pinny's content
         */
        _enableExternalInputs: function() {
            // At this point, this pinny has been closed and lockup has unlocked.
            // If there are any other pinny's open we don't want to re-enable the
            // inputs as they still require them to be disabled.
            if (this._activePinnies()) {
                return;
            }

            $('[data-orig-tabindex]').each(function(_, el) {
                var $el = $(el);
                var oldTabIndex = parseInt($el.attr('data-orig-tabindex'));

                if (oldTabIndex) {
                    $el.attr('tabindex', oldTabIndex);
                } else {
                    $el.removeAttr('tabindex');
                }

                $el.removeAttr('data-orig-tabindex');
            });
        },

        /**
         * In iOS7 or below, when elements are focused inside pinny
         * the keyboard obscures the input. We need to scroll back to
         * the element to keep it in view.
         */
        _handleKeyboardShown: function() {
            if (iOS7orBelow) {
                var activate = function() {
                    this._showSpacer();
                    this._scrollToTarget();
                };

                this.$pinny.find(FOCUSABLE_INPUT_ELEMENTS)
                    .on(events.focus, activate.bind(this))
                    .on(events.blur, this._hideSpacer.bind(this));

                activate.call(this);
            }
        },

        _handleKeyboardHidden: function() {
            if (iOS7orBelow) {
                this.$pinny.find(FOCUSABLE_INPUT_ELEMENTS)
                    .off(events.focus)
                    .off(events.blur);
            }
        },

        /**
         * In iOS7 or below, when inputs are focused inside pinny, we show a
         * spacer element at the bottom of pinny content so that it creates space
         * in the viewport to facilitate scrolling back to the element.
         */
        _scrollToTarget: function() {
            Velocity.animate(this._scrollTarget(), 'scroll', {
                container: this.$content[0],
                offset: -1 * (this.$header.height() + parseInt(this.$content.css('padding-top'))),
                duration: this.options.scrollDuration
            });
        },

        _showSpacer: function() {
            this.$spacer.removeAttr('hidden');
        },

        _hideSpacer: function() {
            !this._activeElement().is(FOCUSABLE_INPUT_ELEMENTS) && this.$spacer.attr('hidden', '');
        },

        _activeElement: function() {
            return $(document.activeElement);
        },

        _blurActiveElement: function() {
            this._activeElement().blur();
        },

        /**
         * Returns the closest parent element that doesn't have relative positioning
         * (within the pinny__content container). Relative positioning messes with
         * Velocity's scroll, which prevents us from correctly scrolling back to active
         * inputs in pinny__content.
         */
        _scrollTarget: function() {
            var $scrollTarget = this._activeElement();
            var $activeElementParent = $scrollTarget.parent();

            while ($activeElementParent.css('position') === 'relative' && !$activeElementParent.hasClass(classes.CONTENT)) {
                $scrollTarget = $activeElementParent;
                $activeElementParent = $scrollTarget.parent();
            }

            return $scrollTarget;
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
