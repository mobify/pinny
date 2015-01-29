define([
    'text!fixtures/iframe_pinny.html',
    '$',
    'modal-center',
    'pinny'
], function(fixture, $, modalCenter) {
    var Pinny;
    var $element;

    describe('Pinny constructor', function() {
        beforeEach(function() {
            // var $iframe = $('<iframe>', {
            //     id: 'abc',
            //     src: '/tests/fixtures/iframe_pinny.html'
            // });
            debugger
            // var $iframe = $(fixture);
            var $iframe = $('<iframe>');
            var $fixture = $(fixture);
            $('#iframe_container').append($iframe);
            $($iframe[0].contentDocument).find('body').append($fixture);
            debugger
            // Pinny = $.fn.pinny.Constructor;
            // $element = $(fixture);
        });

        it('creates a pinny instance', function() {
            debugger
            var pinny = new Pinny($element, {
                effect: modalCenter
            });

            assert.isDefined(pinny);

            pinny.destroy();
        });
    });
});