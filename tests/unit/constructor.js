define([
    'iframe-fixture',
    'text!fixtures/pinny.html'
], function(iframeFixture, fixture) {
    var Pinny;
    var $element;
    var modalCenter;
    var $;

    describe('Pinny constructor', function() {
        beforeEach(function(done) {
            var setUp = function(iFrame$, dependencies) {
                $ = iFrame$;
                Pinny = $.fn.pinny.Constructor;
                modalCenter = dependencies.modalCenter;
                $element = $(fixture);

                done();
            };

            iframeFixture.setUp('iframe-pinny', setUp);
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