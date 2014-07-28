(function (factory) {
    if (typeof define === 'function' && define.amd) {
        /*
         In AMD environments, you will need to define an alias
         to your selector engine. i.e. either zepto or jQuery.
         */
        define([
            'selectorEngine'
        ], factory);
    } else {
        /*
         Browser globals
         */
        factory(window.Zepto || window.jQuery);
    }
}(function($) {
    return function($element) {
        var $window = $(window);

        $element
            .css({
                top: Math.max(0, (($window.height() - $element.height()) / 2) + $window.scrollTop()) + 'px',
                left: Math.max(0, (($window.width() - $element.width()) / 2) + $window.scrollLeft()) + 'px'
            });
    };
}));