define([
    'text!fixtures/pinny.html',
    '$',
    'modal-center',
    'pinny'
], function(fixture, $, modalCenter) {
    var Pinny;
    var $element;

    describe('Pinny constructor', function() {
        beforeEach(function() {
            Pinny = $.fn.pinny.Constructor;
            $element = $(fixture);
        });

        it('creates a pinny instance', function() {
            var pinny = new Pinny($element, {
                effect: modalCenter
            });

            assert.isDefined(pinny);

            pinny.destroy();
        });
    });
});