define([
    'text!fixtures/pinny.html',
    'selectorEngine',
    'velocity',
    'zappy',
    'pinny'
], function(fixture, $) {
    var element;

    describe('Pinny plugin', function() {
        beforeEach(function() {
            element = $(fixture);
        });

        describe('binding to Zepto\'s fn', function() {
            it('defines pinny in Zepto', function() {
                var pinny = $.fn.pinny;

                assert.isDefined(pinny);
            });

            it('defines pinny as a function', function() {
                var pinny = $.fn.pinny;

                assert.isFunction(pinny);
            });
        });

        describe('invoking pinny', function() {
            it('creates pinny instance on element', function() {
                element.pinny();

                assert.isDefined(element.data('pinny'));
            });

            it('stores element inside instance', function() {
                element.pinny();

                assert.isDefined(element.data('pinny').$pinny);
            });
        });
    });
});