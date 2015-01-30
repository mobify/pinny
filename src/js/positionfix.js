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
    if (!($.os.ios && $.os.major === 7)) return;

    var iOS7Bars = null;
    var positionfix = {};

    positionfix.watching = false;

    function refresh () {
        window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
        // window.dispatchEvent(new Event('resize'));
        console.log('Resize Triggered');
    }

    function poll () {
        setTimeout(function() {
            console.log('Watching');
            var landscape = $.orientation.landscape;
            var viewportHeight = window.innerHeight;
            // The testHeight is based off the actual screen height multiplied by a fudge factor that allows for the status and mini address bar in portrait mode and the fullscreen in landscape mode.
            var testHeight = (landscape ? screen.availWidth : screen.availHeight) * 0.85;

            if ((iOS7Bars == null || iOS7Bars == false) && ((landscape && viewportHeight < testHeight) || (!landscape && viewportHeight < testHeight))){
                iOS7Bars = true;
                refresh();
            }
            else if ((iOS7Bars == null || iOS7Bars == true) && ((landscape && viewportHeight > testHeight) || (!landscape && viewportHeight > testHeight))) {
                iOS7Bars = false;
                refresh();
            }

            positionfix.watching && poll();
        }, 1000);
    }

    positionfix.startWatch = function () {
        if (!this.watching) {
            this.watching = true;
            poll();
        }
    };

    positionfix.stopWatch = function () {
        this.watching = false;
    };

    return positionfix;
}));
