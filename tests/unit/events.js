define([
    'text!fixtures/pinny.html',
    '$',
    'pinny'
], function(fixture, $) {
    var element;

    describe('Pinny events', function() {
        beforeEach(function() {
            element = $(fixture);
        });

        it('fires the open event when pinny is opened', function(done) {
            element.pinny({
                open: function() {
                    done();
                }
            });

            element.pinny('open');
        });

        it('fires the opened event when pinny is opened', function(done) {
            element.pinny({
                opened: function() {
                    done();
                }
            });

            element.pinny('open');
        });

        it('fires the close event when pinny is closed', function(done) {
            element.pinny({
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