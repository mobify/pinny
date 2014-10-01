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
    var isChrome = /chrome/i.test( navigator.userAgent );
    var initialFocus;

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
                if (isChrome) {
                    scrollPosition = document.body.scrollTop;
                    $html.css('position', 'fixed');
                    $html.css('top', scrollPosition * -1);
                }

                this._trigger('opened');
                $doc.off('touchmove', this._blockScroll);

                this._focusPinny();
            },
            closeComplete: function() {
                if (isChrome) {
                    $html.css('position', '');
                    $html.css('top', '');
                    window.scrollTo(0, scrollPosition);
                }
                this._trigger('closed');
                $doc.off('touchmove', this._blockScroll);

                this._unfocusPinny();
            }
        },

        _init: function(element) {
            var plugin = this;

            this.id = 'pinny-' + this._uuid();

            this.$element = $(element);
            this.$body = $(document.body);

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
        },

        close: function() {
            this._trigger('close');

            this.options.shade && this.$shade.shade('close');

            this.$pinny.removeClass(classes.OPENED);

            this.effect.close.call(this);
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

            this.$pinny.attr('aria-hidden', 'false');

            this.$pinny.focus();
        },

        _unfocusPinny: function() {
            this.$pinny.attr('aria-hidden', 'true');

            initialFocus.focus();
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
