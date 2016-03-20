define([
    'test-sandbox',
    'text!fixtures/pinny.html'
], function(testSandbox, fixture) {
    var Pinny;
    var $element;
    var modalCenter;
    var sheetTop;
    var sheetBottom;
    var sheetLeft;
    var sheetRight;
    var $;

    describe('Pinny sheets', function() {
        beforeEach(function(done) {
            var setUpComplete = function(iFrame$, dependencies) {
                $ = iFrame$;
                Pinny = $.fn.pinny.Constructor;
                modalCenter = dependencies.modalCenter;
                sheetTop = dependencies.sheetTop;
                sheetBottom = dependencies.sheetBottom;
                sheetRight = dependencies.sheetRight;
                sheetLeft = dependencies.sheetLeft;
                $element = $(fixture);

                done();
            };

            testSandbox.setUp('sandbox', setUpComplete);
        });

        it('opens correctly using modal-center', function() {
            var $pinny = $element.pinny({
                effect: modalCenter,
                opened: function() {
                    expect($pinny.closest('.pinny').hasClass('pinny--is-open')).to.be.true;
                }
            });

            $pinny.pinny('open');
        });

        it('opens correctly using sheet-top', function() {
            var $pinny = $element.pinny({
                effect: sheetTop,
                opened: function() {
                    expect($pinny.closest('.pinny').hasClass('pinny--is-open')).to.be.true;
                }
            });

            $pinny.pinny('open');
        });

        it('opens correctly using sheet-bottom', function() {
            var $pinny = $element.pinny({
                effect: sheetBottom,
                opened: function() {
                    expect($pinny.closest('.pinny').hasClass('pinny--is-open')).to.be.true;
                }
            });

            $pinny.pinny('open');
        });

        it('opens correctly using sheet-left', function() {
            var $pinny = $element.pinny({
                effect: sheetLeft,
                opened: function() {
                    expect($pinny.closest('.pinny').hasClass('pinny--is-open')).to.be.true;
                }
            });

            $pinny.pinny('open');
        });

        it('opens correctly using sheet-right', function() {
            var $pinny = $element.pinny({
                effect: sheetRight,
                opened: function() {
                    expect($pinny.closest('.pinny').hasClass('pinny--is-open')).to.be.true;
                }
            });

            $pinny.pinny('open');
        });
    });
});