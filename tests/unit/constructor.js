define([
    'text!fixtures/pinny.html',
    'selectorEngine',
    'velocity',
    'zappy',
    'pinny'
], function(fixture, $) {
    var Pinny;
    var element;

    describe('Pinny constructor', function() {
        beforeEach(function() {
            Pinny = $.fn.pinny.Constructor;
            element = $(fixture);
        });

        it('creates a pinny instance', function() {
            var pinny = new Pinny(element);

            assert.isDefined(pinny);
        });
    });
});