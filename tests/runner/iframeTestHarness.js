define('iframeTestHarness', [
    '$'
], function(_$) {

    var setUp = function(suite, done) {
        var $frame = _$('<iframe />').attr('src', '/tests/fixtures/iframe_pinny.html');
        _$('#frameContainer').html($frame);

        _$(window).one('message', function() {
            var frameWindow = $frame[0].contentWindow;

            suite(frameWindow.$, frameWindow.modalCenter, $frame);
            done();
        });
    };

    return {
        setUp: setUp
    }
});