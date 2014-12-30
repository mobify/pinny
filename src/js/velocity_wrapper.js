(function(factory) {
    /* AMD module. */
    // i think this means velocity depends on jquery/zepto to be loaded first?
    if (typeof define === "function" && define.amd) {
        define('velocity',['$'], factory);
    } else {
        factory(window.jQuery || window.Zepto);
    }
}(function(global) {
	var ret;
	return ret || global.Velocity;
}));