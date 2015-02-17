define([
    'test-sandbox',
    'text!fixtures/pinny.html'
], function(testSandbox, fixture) {
    var Pinny;
    var $element;
    var modalCenter;
    var $;

    describe('Pinny constructor', function() {
        beforeEach(function(done) {
            var setUpComplete = function(iFrame$, dependencies) {
                $ = iFrame$;
                Pinny = $.fn.pinny.Constructor;
                modalCenter = dependencies.modalCenter;
                $element = $(fixture);

                done();
            };

            testSandbox.setUp('sandbox', setUpComplete);
        });

        it('creates a pinny instance', function() {
            var pinny = new Pinny($element, {
                effect: modalCenter
            });

            expect(pinny).to.be.defined;
        });
    });
});