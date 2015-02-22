define([
    'test-sandbox',
    'text!fixtures/pinny.html'
], function(testSandbox, fixture) {
    var Pinny;
    var $element;
    var modalCenter;
    var $;

    describe('Pinny events', function() {
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

        it('fires the open event when pinny is opened', function(done) {
            $element.pinny({
                effect: modalCenter,
                open: function() {
                    done();
                }
            });

            $element.pinny('open');
        });

        it('fires the opened event when pinny is opened', function(done) {
            $element.pinny({
                effect: modalCenter,
                opened: function() {
                    done();
                }
            });

            $element.pinny('open');
        });

        it('does not fire the open event when pinny is already open', function(done) {
            var openCount = 0;
            $element.pinny({
                effect: modalCenter,
                open: function() {
                    openCount++;

                    if (openCount == 2) {
                        done();
                    }
                }
            });

            $element.pinny('open');
            $element.pinny('open');
        });

        it('fires the close event when pinny is closed', function(done) {
            $element.pinny({
                effect: modalCenter,
                opened: function() {
                    $element.pinny('close');
                },
                close: function() {
                    done();
                }
            });

            $element.pinny('open');
        });

        it('fires the closed event when pinny is closed', function(done) {
            $element.pinny({
                effect: modalCenter,
                opened: function() {
                    $element.pinny('close');
                },
                closed: function() {
                    done();
                }
            });

            $element.pinny('open');
        });

        it('does not fire the close event when pinny is already closed', function(done) {
            var closeCount = 0;

            this.timeout(5000);

            $element.pinny({
                effect: modalCenter,
                opened: function() {
                    $element.pinny('close');

                    setTimeout(function() {
                        $element.pinny('close');

                        expect(closeCount).to.equal(1);

                        done();
                    }, 1000);

                },
                close: function() {
                    closeCount++;
                }
            });

            $element.pinny('open');
        });
    });
});