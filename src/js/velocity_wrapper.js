(function(factory) {
    /* AMD module. */
    if (typeof define === "function" && define.amd) {
        define('velocity',['$'], factory);
    } else {
        factory(window.jQuery || window.Zepto);
    }
}(function($) {
	return $.Velocity;
}));