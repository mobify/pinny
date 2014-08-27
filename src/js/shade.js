
/*
 Shade.js v1.0.0
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        /*
         In AMD environments, you will need to define an alias
         to your selector engine. i.e. either zepto or jQuery
         */
        define([
            '$',
            'velocity'
        ], factory);
    } else {
        /*
         Browser globals
         */
        factory(window.Zepto || window.jQuery);
    }
}(function($, Velocity) {
    var pluginName = 'shade';
    var noop = function() {};

    function Shade(element, options) {
        this._init(element, options);
    }

    Shade.DEFAULTS = {
        color: 'black',
        opacity: '0.25',
        duration: 150,
        easing: 'swing',
        padding: 0,
        click: function() {
            this.close();
        },
        open: noop,
        opened: noop,
        close: noop,
        closed: noop,
        zIndex: 1
    };

    Shade.prototype._init = function(element, options) {
        var plugin = this;

        this.options = $.extend(true, {}, Shade.DEFAULTS, options);

        this.$element = $(element);
        this.isBody = this.$element.get(0).nodeName.toLowerCase() === 'body';

        this.$shade = $('<div />')
            .addClass('shade')
            .css({
                background: this.options.color ? this.options.color : '',
                opacity: 0
            })
            .hide()
            .appendTo(this.$element)
            .on('click', function() {
                plugin.options.click.call(plugin);
            });

        $(window)
            .on('resize:shade', function () {
                if (plugin.$shade.hasClass('shade--is-open')) {
                    plugin.setPosition.call(plugin);
                }
            });
    };

    Shade.prototype.open = function() {
        this._trigger('open');

        this.setPosition();

        Velocity.animate(
            this.$shade,
            {
                opacity: this.options.opacity
            },
            {
                display: 'block',
                duration: this.options.duration,
                easing: this.options.easing
            }
        );

        this.$shade
            .addClass('shade--is-open')
            .on('touchmove', function() { return false; });

        this._trigger('opened');
    };

    Shade.prototype.close = function() {
        this._trigger('close');


        Velocity.animate(
            this.$shade,
            'reverse',
            {
                display: 'none',
                duration: this.options.duration,
                easing: this.options.easing
            }
        );

        this.$shade
            .removeClass('shade--is-open')
            .off('touchmove');

        this._trigger('closed');
    };

    Shade.prototype.setPosition = function () {
        var $element = this.$element;
        var width = this.isBody ? 'auto' : $element.outerWidth(false);
        var height = this.isBody ? 'auto' : $element.outerHeight(false);
        var position = this.isBody ? 'fixed' : 'absolute';

        this.$shade
            .css({
                left: this.options.padding ? -this.options.padding : 0,
                top: this.options.padding ? -this.options.padding : 0,
                bottom: this.options.padding ? -this.options.padding : 0,
                right: this.options.padding ? -this.options.padding: 0,
                width: this.options.padding ? width - this.options.padding: width,
                height: this.options.padding ? height - this.options.padding : height,
                position: position,
                padding: this.options.padding,
                zIndex: this.options.zIndex || $element.css('zIndex') + 1
            });
    };


    Shade.prototype._trigger = function(eventName, data) {
        eventName in this.options && this.options[eventName].call(this, $.Event(pluginName + ':' + eventName, { bubbles: false }), data);
    };

    $.fn.shade = function(option) {
        var args = Array.prototype.slice.call(arguments);

        return this.each(function() {
            var $this = $(this);
            var shade = $this.data(pluginName);

            if (!shade) {
                $this.data(pluginName, (shade = new Shade(this, option)));
            }

            // invoke a public method on shade, and skip private methods
            if (typeof option === 'string' && option.indexOf('_') !== 0) {
                shade[option].apply(shade, args.length > 1 ? args.slice(1) : null);
            }
        });
    };

    $.fn.shade.Constructor = Shade;

    return $;
}));

