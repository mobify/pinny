define([
    '$',
    'text!fixtures/pinny.html',
    'iframeTestHarness'
], function(_$, fixture, iframeTestHarness) {
    var Pinny;
    var modalCenter;
    var $element;
    var $;

    describe('Pinny constructor', function() {
        beforeEach(function(done) {

            var suiteSetup = function($, pinnyEffect, $frame) {
                Pinny = $.fn.pinny.Constructor;
                modalCenter = pinnyEffect;
                $element = $(fixture);
            };

            iframeTestHarness.setUp(suiteSetup, done);
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