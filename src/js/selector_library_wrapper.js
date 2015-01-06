define('$', (function (global) {
    return function () {
        var ret;
        return ret || global.jQuery || global.Zepto;
    };
}(this)));