(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'deckard'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework);
    }
}(function($) {
    var $this = {};
    var isPreviousOrientationStatePortrait;
    var previousWindowHeight = 0;
    var timeoutFn;
    var interval = 1000;

    $this.NAME = 'syntheticresize';
    $this.VERSION = '0';
    $this.watching = false;
    $this.$body = $('body');

    $this.destroy = function () {
        $this.stopWatching();
        $this.$body.removeData($this.NAME);
    };

    $this.startWatching = function () {
        if (!$this.watching) {
            _init();

            previousWindowHeight = window.innerHeight;
            isPreviousOrientationStatePortrait = $.orientation.portrait;
            $this.watching = true;

            _poll();
        }
    };

    $this.stopWatching = function () {
        clearTimeout(timeoutFn);
        $this.watching = false;
    };

    $this.setTimeoutInterval = function (newInterval) {
        $this.interval = newInterval;
    };

    function _init () {
        // Create only 1 instance no matter what
        if (!$this.$body.data($this.NAME)) {
            $this.$body.data($this.NAME, $this);
        }
    }

    function _poll () {
        timeoutFn = setTimeout(function() {
            var viewportHeight = window.innerHeight;

            if (isPreviousOrientationStatePortrait === $.orientation.portrait && Math.abs(previousWindowHeight - viewportHeight) > 10 ) {
                window.dispatchEvent(new window.Event('resize'));
            }
            else {
                isPreviousOrientationStatePortrait = $.orientation.portrait;
            }

            previousWindowHeight = viewportHeight;
            $this.watching && _poll();
        }, interval);
    }

    return $this;
}));

