(function($) {
    var pluginName = 'pinny';
    var noop = function() {};

    var openedClass = 'pinny--is-open';

    function Pinny(element, options) {
        this.init(element, options);
    }

    Pinny.DEFAULTS = {
        open: noop,
        opened: noop,
        close: noop,
        closed: noop
    };

    Pinny.prototype.init = function(element, options) {
        this.options = $.extend(true, {}, Pinny.DEFAULTS, options);

        this.$pinny = $(element);
//        this.$activator = $(this.options.activator);

        this._bindEvents();
    };

    Pinny.prototype._bindEvents = function() {
//        this.$activator.on('click:pinny', this.toggle);
    };

    Pinny.prototype.toggle = function() {
        this[this.$pinny.hasClass(openedClass) ? 'close' : 'open']();
    };

    Pinny.prototype.open = function() {
        this._trigger('open');
        this.$pinny.addClass(openedClass);
        this._trigger('opened');
    };

    Pinny.prototype.close = function() {
        this._trigger('close');
        this.$pinny.removeClass(openedClass);
        this._trigger('closed');
    };
    
    Pinny.prototype._trigger = function(eventName, data) {
        eventName in this.options && this.options[eventName].call(this, $.Event(pluginName + ':' + eventName, { bubbles: false }), data);
    };

    $.fn.pinny = function(option) {
        var args = Array.prototype.slice.call(arguments);

        return this.each(function() {
            var $this = $(this);
            var pinny = $this.data(pluginName);

            if (!pinny) {
                $this.data(pluginName, (pinny = new Pinny(this, option)));
            }

            // invoke a public method on pinny, and skip private methods
            if (typeof option === 'string' && option.indexOf('_') !== 0) {
                pinny[option].apply(pinny, args.length > 1 ? args.slice(1) : null);
            }
        });
    };

    $.fn.pinny.Constructor = Pinny;

    $('[data-pinny]').pinny();

    return $;
})(window.jQuery || window.Zepto);
