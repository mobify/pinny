/*
    Pinny.js v1.0.0
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        /*
            In AMD environments, you will need to define an alias
            to your selector engine. i.e. either zepto or jQuery.
            Additionally, you will need to alias velocity and
            zappy.
         */
        define([
            'selectorEngine',
            'velocity',
            'zappy',
            'shade'
        ], factory);
    } else {
        /*
            Browser globals
         */
        factory(window.Zepto || window.jQuery);
    }
}(function($) {
    var PLUGIN_NAME = 'pinny';
    var noop = function() {};

    var OPENED_CLASS = 'pinny--is-open';

    function Pinny(element, options) {
        this._init(element, options);
    }

    Pinny.VERSION = '1.0.0';

    Pinny.DEFAULTS = {
        position: 'modal-center',
        title: 'Pinny',
        open: noop,
        opened: noop,
        close: noop,
        closed: noop,
        zIndex: 2,
        coverage: '90%'
    };

    Pinny.prototype._init = function(element, options) {
        var plugin = this;
        var $body = $(document.body);

        this.options = $.extend(true, {}, Pinny.DEFAULTS, options);

        require([this.options.position], function(position) {
            plugin.position = position;
        });

        this.$pinny = $('<div />')
            .appendTo($body)
            .addClass('pinny')
            .css({
                position: 'absolute',
                zIndex: this.options.zIndex,
                width: this.options.coverage,
                height: this.options.coverage
            });

        if (this.options.title) {
            this.$title = $('<div />')
                .addClass('pinny__title')
                .text(this.options.title)
                .prependTo(this.$pinny);

            $('<a href="#" />')
                .html('&times')
                .addClass('pinny__close')
                .appendTo(this.$title)
                .on('click', function() {
                    plugin.close();
                });
        }

        this.$content = $('<div />')
            .addClass('pinny__content')
            .appendTo(this.$pinny);

        $(element).appendTo(this.$content).show();

        this.$shade = $body.shade({
            click: function() {
                plugin.close();
            }
        });

        this._bindEvents();
    };

    Pinny.prototype._trigger = function(eventName, data) {
        eventName in this.options && this.options[eventName].call(this, $.Event(PLUGIN_NAME + ':' + eventName, { bubbles: false }), data);
    };

    Pinny.prototype._bindEvents = function() {
    };

    Pinny.prototype.toggle = function() {
        this[this.$pinny.hasClass(OPENED_CLASS) ? 'close' : 'open']();
    };

    Pinny.prototype.open = function() {
        this._trigger('open');
        this.$shade.shade('open');
        this._open();
        this._trigger('opened');
    };

    Pinny.prototype.close = function() {
        this._trigger('close');
        this.$shade.shade('close');
        this.$pinny.hide().removeClass(OPENED_CLASS);
        this._trigger('closed');
    };

    Pinny.prototype._open = function() {
        this.$pinny
            .show()
            .addClass(OPENED_CLASS);

        this.position(this.$pinny);

        this.$content
            .height(this.$title ? this.$pinny.height() - this.$title.height() : this.$pinny.height());
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
