(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'plugin',
            'bouncefix',
            'velocity',
            'lockup',
            'shade'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, window.bouncefix);
    }
}(function($, Plugin, bouncefix, Velocity) {
    var EFFECT_REQUIRED = 'Pinny requires a declared effect to operate. For more information read: https://github.com/mobify/pinny#initializing-the-plugin';
    var FOCUSABLE_ELEMENTS = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, [tabindex], [contenteditable]';

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
        WRAPPER: 'pinny__wrapper',
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

    function Pinny(element, options) {
        Pinny.__super__.call(this, element, options, Pinny.DEFAULTS);
    }

    Pinny.VERSION = '1.1.2';

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
        closed: $.noop
    };

    Plugin.create('pinny', Pinny, {
        /**
         * Common animation callbacks used in the effect objects
         */
        animation: {
            beginClose: function() {

            },
            openComplete: function() {
                this._trigger('opened');

                this._focus();
            },
            closeComplete: function() {
                this._trigger('closed');

                this._resetFocus();
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

        toggle: function() {
            this[this.$pinny.hasClass(classes.OPENED) ? 'close' : 'open']();
        },

        open: function() {
            if (this._isOpen()) {
                return;
            }

            this._trigger('open');

            bouncefix.add(classes.SCROLLABLE);

            this.effect.open.call(this);

            this.options.shade && this.$shade.shade('open');

            this.$pinny.addClass(classes.OPENED);

            this.$pinny.lockup('lock');

            this._enableInputScrollFix();
        },

        close: function() {
            if (!this._isOpen()) {
                return;
            }

            this._trigger('close');

            bouncefix.remove(classes.SCROLLABLE);

            this.$pinny.removeClass(classes.OPENED);

            this.options.shade && this.$shade.shade('close');

            this.effect.close.call(this);

            this.$pinny.lockup('unlock');

            this._disableInputScrollFix();
        },

        _isOpen: function() {
            return this.$pinny.hasClass(classes.OPENED);
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

            this.$pinny = $('<section />')
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
                })
                .lockup({
                    container: this.options.container
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

        _isHtml: function(input) {
            return /<[a-z][\s\S]*>/i.test(input);
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

        _focus: function() {
            this.originalActiveElement = document.activeElement;

            this._disableInputs();

            this.$pinny.attr('aria-hidden', 'false');

            this.$pinny.children().first().focus();

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
            var $focusableElements = $(FOCUSABLE_ELEMENTS).not(function() {
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
        },

        _enableInputScrollFix: function() {
            if ($.os.major <= 7) {
                var $this = this.$pinny;

                $this.find('input, select, textarea')
                    .on('focus', function() {
                        setTimeout(function() {
                            if (!$this.find('.pinny__input-space').length) {
                                $this.find('.pinny__content').append($('<div class="pinny__input-space" style="height: 300px">'));
                            }

                            var $positionElement = $(document.activeElement);

                            // When the parent of the element have position relative
                            // the position of the select will return the wrong value
                            // Therefore, define a parent element in data so we can use the correct position
                            if (typeof $positionElement.data('positionParent') !== 'undefined') {
                                $positionElement = $positionElement.data('positionParent');
                            }

                            Velocity.animate($positionElement, 'scroll', {
                                container: $this.find('.' + classes.CONTENT)[0],
                                offset: -1 * $this.find('.' + classes.HEADER).height() - 15,
                                duration: 50
                            });
                        }, 0);
                    })
                    .on('blur', function () {
                        setTimeout(function() {
                            if (!/(input|select|textarea)/i.test(document.activeElement.nodeName)) {
                                $this.find('.pinny__input-space').remove();
                            }
                        }, 0);
                    });
            }
        },

        _disableInputScrollFix: function() {
            if ($.os.major <= 7) {
                this.$pinny.find('input, select, textarea').off('focus blur');
            }
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
