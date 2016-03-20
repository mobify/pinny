define([
    'test-sandbox',
    'text!fixtures/pinny.html',
    'text!fixtures/fullPinny.html'
], function(testSandbox, fixture, fixtureFull) {
    var Pinny;
    var $element, $element2;
    var modalCenter;
    var $;

    describe('Pinny events', function() {
        beforeEach(function(done) {
            var setUpComplete = function(iFrame$, dependencies) {
                $ = iFrame$;
                Pinny = $.fn.pinny.Constructor;
                modalCenter = dependencies.modalCenter;
                $element = $(fixture);
                $element2 = $(fixtureFull);

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

        it('fires all lock handlers', function(done) {
            var lockCtr = 0;

            // Open first pinny
            $element.pinny({
                effect: modalCenter,
                open: function() {
                    var _locked = this.$pinny.data('lockup').options.locked;
                    this.$pinny.data('lockup').options.locked = function() {
                        ++lockCtr;
                        return _locked.apply(this, arguments);
                    };
                }
            }).pinny('open');

            // Setup second pinny
            $element2.pinny({
                effect: modalCenter,
                open: function() {
                    // Test passes only if the `locked` event is triggered twice
                    this.$pinny.data('lockup').options.locked = function() {
                        ++lockCtr === 2 && done();
                    };
                }
            }).pinny('open');
        });

        it('fires all unlock handlers', function(done) {
            var lockCtr = 2;

            // Open first pinny
            $element.pinny({
                effect: modalCenter,
                open: function() {
                    this.$pinny.data('lockup').options.unlocked = function() {
                        --lockCtr;
                    };
                }
            }).pinny('open');

            // Setup second pinny
            $element2.pinny({
                effect: modalCenter,
                open: function() {
                    var _unlocked = this.$pinny.data('lockup').options.unlocked;

                    // Test passes only if the `unlocked` event is triggered twice
                    this.$pinny.data('lockup').options.unlocked = function() {
                        --lockCtr === 0 && done();
                    };
                }
            }).pinny('open');

            // Wait for pinny opening animation
            setTimeout(function() {
                $element.pinny('close');
                $element2.pinny('close');
            }, 300);
        });
    });
});