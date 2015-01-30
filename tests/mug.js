define('mug', [
    '$'
], function(_$) {

    var testCount = 0;

    var createMug = function(pour, done) {
        testCount++;
        var $frame = _$('<iframe />').attr('src', '/tests/fixtures/iframe_pinny.html');
        _$('#frameContainer').html($frame);

        _$(window).one('message', function() {
            var frameWindow = $frame[0].contentWindow;

            frameWindow.$('body').attr('id', testCount);
            
            pour(frameWindow.$, frameWindow.modalCenter, $frame);
            done();
        });
    };

    return {
        createMug: createMug
    }
});