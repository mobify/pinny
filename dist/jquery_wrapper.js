if ( typeof define === 'function' && define.amd && define.amd.jQuery ) {
	define('$', (function (global) {
		return function () {
			var ret, fn;
			return ret || global.$;
		};
	}(this)));
}