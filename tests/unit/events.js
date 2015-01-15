define([
    'text!fixtures/pinny.html',
    '$',
    'modal-center',
    'pinny'
], function(fixture, $, modalCenter) {
    var $element;

    /**
     * We need to delay destroying pinny until the animation is completed,
     * so we delay the destruction until then.
     */
    var _destroy = function(done) {
        setTimeout(function() {
            $element.pinny('destroy');
            done();
        }, 500);
    };

    describe('Pinny events', function() {
        beforeEach(function() {
            $element = $(fixture);
        });

        it('fires the open event when pinny is opened', function(done) {
            $element.pinny({
                effect: modalCenter,
                open: function() {
                    _destroy(done);
                }
            });

            $element.pinny('open');
        });

        it('fires the opened event when pinny is opened', function(done) {
            $element.pinny({
                effect: modalCenter,
                opened: function() {
                    _destroy(done);
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
                }
            });

            $element.pinny('open');
            $element.pinny('open');

            _destroy(done);

            assert.equal(openCount, 1);
        });

        it('fires the close event when pinny is closed', function(done) {
            $element.pinny({
                effect: modalCenter,
                opened: function() {
                    $element.pinny('close');
                },
                close: function() {
                    _destroy(done);
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
                    _destroy(done);
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

                        assert.equal(closeCount, 1);

                        _destroy(done);
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