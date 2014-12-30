define("$", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.$; // what does this mean
    };
}(this)));