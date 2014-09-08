
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'bouncefix',
            'shade'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, framework.Velocity);
    }
}(function($, bouncefix) {
    var PLUGIN_NAME = 'pinny';
    var noop = function() {
    };

    var OPENED_CLASS = 'pinny--is-open';
    var HEADER_TEMPLATE = '<header class="pinny__header">{0}</header>';

    function Pinny(element, options) {
        this._init(element, options);
    }

    Pinny.VERSION = '1.0.0';

    Pinny.DEFAULTS = {
        effect: {
            open: noop,
            close: noop
        },
        header: 'Pinny',
        footer: '',
        zIndex: 2,
        cssClass: '',
        coverage: '100%',
        easing: 'swing',
        duration: 200,
        shade: {},
        open: noop,
        opened: noop,
        close: noop,
        closed: noop
    };

    /*
     Common animation callbacks used in the effect objects
     */
    Pinny.prototype.animation = {
        begin: function() {
            $('html').css('overflow', 'hidden');
        },
        beginClose: function() {
            $(document).on('touchmove', Pinny.prototype._blockScroll);

            $('html').css('overflow', '');
        },
        complete: function() {
            $(document).off('touchmove', Pinny.prototype._blockScroll);
        }
    };

    Pinny.prototype._init = function(element, options) {
        var plugin = this;

        this.options = $.extend(true, {}, Pinny.DEFAULTS, options);

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

        this.$wrapper = $('<div />')
            .addClass('pinny__wrapper')
            .appendTo(this.$pinny);

        this.$header = $(this._buildHeader()).prependTo(this.$wrapper);

        this.$content = $('<div />')
            .addClass('pinny__content')
            .appendTo(this.$wrapper);

        $(element)
            .appendTo(this.$content)
            .removeClass('pinny__hidden');

        if (this.options.footer) {
            this.$footer = $(this.options.footer)
                .addClass('pinny__footer')
                .appendTo(this.$wrapper);
        }

        if (this.options.shade) {
            this.$shade = this.$pinny.shade($.extend(true, {}, {
                click: function() {
                    plugin.close();
                }
            }, this.options.shade));
        }

        bouncefix.add('pinny__content');

        this.effect = this.options.effect;

        this._bindEvents();
    };

    Pinny.prototype.toggle = function() {
        this[this.$pinny.hasClass(OPENED_CLASS) ? 'close' : 'open']();
    };

    Pinny.prototype.open = function() {
        this._trigger('open');

        this.options.shade && this.$shade.shade('open');

        this.effect.open.call(this);

        this.$pinny.addClass(OPENED_CLASS);

        this._trigger('opened');
    };

    Pinny.prototype.close = function() {
        this._trigger('close');

        this.options.shade && this.$shade.shade('close');

        this.$pinny.removeClass(OPENED_CLASS);

        this.effect.close.call(this);

        this._trigger('closed');
    };

    Pinny.prototype._bindEvents = function() {
        // Block scrolling on anything but pinny content
        this.$pinny.on('touchmove', function(e) {
            if (!$(e.target).parents().hasClass('pinny__content')) {
                e.preventDefault();
            }
        });
    };

    Pinny.prototype._buildHeader = function() {
        var header = this.options.header;

        if (!header) return $([]);

        header = this._isHtml(this.options.header) ? this.options.header : '<h1 class="pinny__title">{0}</h1><button class="pinny__close">Close</button>'.replace('{0}', this.options.header);

        return HEADER_TEMPLATE.replace('{0}', header);
    };

    Pinny.prototype._isHtml = function(input) {
        return /<[a-z][\s\S]*>/i.test(input);
    };

    Pinny.prototype._blockScroll = function(e) {
        e.preventDefault();
    };

    Pinny.prototype._trigger = function(eventName, data) {
        eventName in this.options && this.options[eventName].call(this, $.Event(PLUGIN_NAME + ':' + eventName, { bubbles: false }), data);
    };

    /*
     Takes the coverage option and turns it into a effect value
     */
    Pinny.prototype._coverage = function(divisor) {
        var coverage;
        var percent = this.options.coverage.match(/(\d*)%$/);

        if (percent) {
            coverage = 100 - parseInt(percent[1]);

            if (divisor) {
                coverage = coverage / divisor;
            }
        }

        return percent ? coverage + '%' : this.options.coverage;
    };

    $.fn.pinny = function(option) {
        var args = Array.prototype.slice.call(arguments);

        return this.each(function() {
            var $this = $(this);
            var pinny = $this.data(PLUGIN_NAME);
            var isMethodCall = typeof option === 'string';

            // If pinny isn't initialized, we lazy-load initialize it. If it's
            // already initialized, we can safely ignore the call.
            if (!pinny) {
                if (isMethodCall) {
                    throw 'cannot call methods on pinny prior to initialization; attempted to call method "' + option + '"';
                }
                $this.data(PLUGIN_NAME, (pinny = new Pinny(this, option)));
            }

            // invoke a public method on pinny, and skip private methods
            if (isMethodCall) {
                if (option.charAt(0) === '_' || typeof pinny[option] !== 'function') {
                    throw 'no such method "' + option + '" for pinny';
                }

                pinny[option].apply(pinny, args.length > 1 ? args.slice(1) : null);
            }
        });
    };

    $.fn.pinny.Constructor = Pinny;

    $('[data-pinny]').pinny();

    return $;
}));
