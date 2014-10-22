define([
    'text!fixtures/pinny.html',
    '$',
    'modal-center',
    'pinny'
], function(fixture, $, modalCenter) {
    var element;

    describe('Pinny events', function() {
        beforeEach(function() {
            element = $(fixture);
        });

        afterEach(function() {
            if (element) {
                element.remove();
                element = null;
            }
        });

        it('fires the open event when pinny is opened', function(done) {
            element.pinny({
                effect: modalCenter,
                open: function() {
                    done();
                }
            });

            element.pinny('open');
        });

        it('fires the opened event when pinny is opened', function(done) {
            element.pinny({
                effect: modalCenter,
                opened: function() {
                    done();
                }
            });

            element.pinny('open');
        });

        it('fires the close event when pinny is closed', function(done) {
            element.pinny({
                effect: modalCenter,
                opened: function() {
                    element.pinny('close');
                },
                close: function() {
                    done();
                }
            });

            element.pinny('open');
        });

        it('fires the closed event when pinny is closed', function(done) {
            element.pinny({
                effect: modalCenter,
                opened: function() {
                    element.pinny('close');
                },
                closed: function() {
                    done();
                }
            });

            element.pinny('open');
        });
    });
});