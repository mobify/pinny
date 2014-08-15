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
                bottom: 0,
                left: 0,
                right: 0,
                width: 'auto'
            });
    };
}));
