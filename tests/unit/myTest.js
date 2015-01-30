define([
    '$',
    'text!fixtures/pinny.html',
    'mug'
], function(_$, fixture, mug) {
    var Pinny;
    var modalCenter;
    var $element;
    var $;

    describe('Pinny constructor', function() {
        beforeEach(function(done) {

            var pour = function($, pinnyEffect, $frame) {
                Pinny = $.fn.pinny.Constructor;
                modalCenter = pinnyEffect;
                $element = $(fixture);
            };

            mug.createMug(pour, done);
        });

        it('creates a pinny instance', function() {

            var pinny = new Pinny($element, {
                effect: modalCenter
            });

            assert.isDefined(pinny);

            console.log('pinny is in: ', pinny.$doc, pinny.$body.attr('id'));
        });

        it('creates a pinny instance', function() {

            var pinny = new Pinny($element, {
                effect: modalCenter
            });

            assert.isDefined(pinny);

            console.log('pinny is in: ', pinny.$doc, pinny.$body.attr('id'));
        });

        it('creates a pinny instance', function() {

            var pinny = new Pinny($element, {
                effect: modalCenter
            });

            assert.isDefined(pinny);

            console.log('pinny is in: ', pinny.$doc, pinny.$body.attr('id'));
        });
    });
});