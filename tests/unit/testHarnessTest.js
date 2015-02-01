define([
    '$',
    'text!fixtures/pinny.html',
    'iframe-fixture'
], function(_$, fixture, iframeFixture) {
    var Pinny;
    var modalCenter;
    var $element;
    var $;

    describe('Pinny constructor', function() {
        beforeEach(function(done) {

            var setUp = function($, pinnyEffect) {
                Pinny = $.fn.pinny.Constructor;
                modalCenter = pinnyEffect;
                $element = $(fixture);
            };

            iframeFixture.setUp('iframe-pinny', setUp, done);
        });

        it('creates a pinny instance', function() {

            var pinny = new Pinny($element, {
                effect: modalCenter
            });

            assert.isDefined(pinny);
        });

        it('creates a pinny instance', function() {

            var pinny = new Pinny($element, {
                effect: modalCenter
            });

            assert.isDefined(pinny);
        });

        it('creates a pinny instance', function() {

            var pinny = new Pinny($element, {
                effect: modalCenter
            });

            assert.isDefined(pinny);
        });
    });
});