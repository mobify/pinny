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
    var $doc = $(document);
    var $html = $('html');
    var scrollPosition;
    var isChrome = /chrome/i.test( navigator.userAgent );

    var classes = {
        OPENED: 'pinny--is-open'
    };

    var HEADER_TEMPLATE = '<header class="pinny__header">{0}</header>';

    function Pinny(element, options) {
        Pinny._super.call(this, element, options, Pinny.DEFAULTS);
    }

    Pinny.VERSION = '0';

    Pinny.DEFAULTS = {
        effect: {
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
         Common animation callbacks used in the effect objects
         */
        animation: {
            beginOpen: function() {
                alert(isChrome);
            },
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
            },
            closeComplete: function() {
                if (isChrome) {
                    $html.css('position', '');
                    $html.css('top', '');
                    window.scrollTo(0, scrollPosition);
                }
                this._trigger('closed');
                $doc.off('touchmove', this._blockScroll);
            }
        },

        _init: function(element) {
            var plugin = this;

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
                }, this.options.shade));
            }

            bouncefix.add('pinny__content');

            this.effect = this.options.effect;

            this.$pinny.find('.pinny__hidden').removeClass('pinny__hidden');

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

        /*
         Builds Pinny using the following structure:

         <section class="pinny">
             <div class="pinny__wrapper">
                <header class="pinny__header">{header content}</header>
                <div class="pinny__content">
                    {content}
                </div>
             </div>
             // footer is optional
             <footer class="pinny__footer"></footer>
         </section>
         */
        _build: function() {
            var $wrapper = $('<div />')
                .addClass('pinny__wrapper')
                .appendTo(this.$pinny);

            $(this._buildHeader()).prependTo($wrapper);

            $('<div />')
                .addClass('pinny__content')
                .append(this.$element)
                .appendTo($wrapper);

            if (this.options.footer) {
                $(this.options.footer)
                    .addClass('pinny__footer')
                    .appendTo($wrapper);
            }
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
         Takes the coverage option and turns it into a effect value
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
