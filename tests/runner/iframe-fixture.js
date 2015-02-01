define([
    '$'
], function($) {

    var setUp = function(fixture, suite, done) {
        var $frame = $('<iframe />').attr('src', '/tests/fixtures/' + fixture + '.html');
        $('#frameContainer').html($frame);

        $(window).one('message', function() {
            var frameWindow = $frame[0].contentWindow;

            suite(frameWindow.$, frameWindow.modalCenter);
            done();
        });
    };

    return {
        setUp: setUp
    }
});