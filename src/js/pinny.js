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
        factory(framework, framework.Velocity);
    }
}(function($, bouncefix) {
    var classes = {
        OPENED: 'pinny--is-open'
    };

    var HEADER_TEMPLATE = '<header class="pinny__header">{0}</header>';

    function Pinny(element, options) {
        Pinny._super.call(this, element, options, Pinny.DEFAULTS);
    }

    Pinny.VERSION = '0';

    Pinny.DEFAULTS = {
        position: {
            open: $.noop,
            close: $.noop
        },
        header: 'Pinny',
        footer: '',
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

    $.plugin('pinny', Pinny, {
        /*
         Common animation callbacks used in the position objects
         */
        animation: {
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
        },

        _init: function(element) {
            var plugin = this;

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

            this.position = this.options.position;

            this._bindEvents();
        },

        toggle: function() {
            this[this.$pinny.hasClass(classes.OPENED) ? 'close' : 'open']();
        },

        open: function() {
            this._trigger('open');

            this.options.shade && this.$shade.shade('open');

            this.position.open.call(this);

            this.$pinny.addClass(classes.OPENED);

            this._trigger('opened');
        },

        close: function() {
            this._trigger('close');

            this.options.shade && this.$shade.shade('close');

            this.$pinny.removeClass(classes.OPENED);

            this.position.close.call(this);

            this._trigger('closed');
        },

        _bindEvents: function() {
            // Block scrolling on anything but pinny content
            this.$pinny.on('touchmove', function(e) {
                if (!$(e.target).parents().hasClass('pinny__content')) {
                    e.preventDefault();
                }
            });
        },

        _buildHeader: function() {
            var header = this.options.header;

            if (!header) return $([]);

            header = this._isHtml(this.options.header) ? this.options.header : '<h1 class="pinny__title">{0}</h1><button class="pinny__close">Close</button>'.replace('{0}', this.options.header);

            return HEADER_TEMPLATE.replace('{0}', header);
        },

        _isHtml: function(input) {
            return /<[a-z][\s\S]*>/i.test(input);
        },

        _blockScroll: function(e) {
            e.preventDefault();
        },

        /*
         Takes the coverage option and turns it into a position value
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
        }
    });

    $('[data-pinny]').pinny();

    return $;
}));
