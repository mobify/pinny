/*
 Pinny.js v1.0.0
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'bouncefix',
            'shade'
        ], factory);
    } else {
        factory(window.Zepto || window.jQuery);
    }
}(function($, bouncefix) {
    var PLUGIN_NAME = 'pinny';
    var noop = function() {
    };

    var OPENED_CLASS = 'pinny--is-open';

    function Pinny(element, options) {
        this._init(element, options);
    }

    Pinny.VERSION = '1.0.0';

    Pinny.DEFAULTS = {
        position: {
            open: noop,
            close: noop
        },
        title: 'Pinny',
        closeText: 'Close',
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
            });

        if (this.options.title) {
            this.$header = $('<header />')
                .addClass('pinny__header')
                .html('<h1 class="pinny__title">' + this.options.title + '</h1>')
                .prependTo(this.$pinny);

            if (this.options.close) {
                $('<button />')
                    .html(this.options.closeText)
                    .addClass('pinny__close')
                    .appendTo(this.$header)
                    .on('click', function(e) {
                        e.preventDefault();
                        plugin.close();
                    }
                );
            }
        }

        this.$content = $('<div />')
            .addClass('pinny__content')
            .appendTo(this.$pinny);

        $(element)
            .appendTo(this.$content)
            .removeClass('pinny__hidden');

        if (this.options.footer) {
            this.$footer = $('<div />')
                .addClass('pinny__footer')
                .html(this.options.footer)
                .appendTo(this.$pinny);
        }

        this.$shade = this.$pinny.shade($.extend(true, {}, {
            click: function() {
                plugin.close();
            }
        }, this.options.shade));

        bouncefix.add('pinny__content');

        this.position = this.options.position;

        this._bindEvents();
    };

    Pinny.prototype.toggle = function() {
        this[this.$pinny.hasClass(OPENED_CLASS) ? 'close' : 'open']();
    };

    Pinny.prototype.open = function() {
        this._trigger('open');

        this.options.shade && this.$shade.shade('open');

        this.position.open.call(this);

        this.$pinny.addClass(OPENED_CLASS);

        this._trigger('opened');
    };

    Pinny.prototype.close = function() {
        this._trigger('close');

        this.options.shade && this.$shade.shade('close');

        this.$pinny.removeClass(OPENED_CLASS);

        this.position.close.call(this);

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

    Pinny.prototype._blockScroll = function(e) {
        e.preventDefault();
    };

    Pinny.prototype._isPercent = function(str) {
        return str[str.length - 1] === '%';
    };

    Pinny.prototype._trigger = function(eventName, data) {
        eventName in this.options && this.options[eventName].call(this, $.Event(PLUGIN_NAME + ':' + eventName, { bubbles: false }), data);
    };

    // Turns coverage into a position value
    Pinny.prototype._coverageCalc = function(coverage) {
        if (this._isPercent(coverage)) {
            coverage = 100 - parseInt(coverage);
        }

        return coverage;
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
