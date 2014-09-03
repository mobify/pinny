define([
    'text!fixtures/pinny.html',
    '$',
    'pinny'
], function(fixture, $) {
    var element;

    describe('Pinny plugin', function() {
        beforeEach(function() {
            element = $(fixture);
        });

        describe('binding to Zepto\'s fn', function() {
            it('defines pinny in Zepto', function() {
                var pinny = $.fn.pinny;

                assert.isDefined(pinny);
            });

            it('defines pinny as a function', function() {
                var pinny = $.fn.pinny;

                assert.isFunction(pinny);
            });
        });

        describe('invoking pinny', function() {
            it('creates pinny instance on element', function() {
                element.pinny();

                assert.isDefined(element.data('pinny'));
            });

            it('stores element inside instance', function() {
                element.pinny();

                assert.isDefined(element.data('pinny').$pinny);
            });
        });

        describe('invoking pinny methods before plugin is initialized', function() {
            it('throws when not initialized', function() {
                assert.throws(function() { element.pinny('open'); });
            });
        });

        describe('invoking pinny methods using the plugin interface', function() {
            it('opens a pinny using the open method', function(done) {
                element.pinny({
                    opened: function() {
                        assert.isTrue(element.closest('.pinny').hasClass('pinny--is-open'));
                        done();
                    }
                });

                element.pinny('open');
            });

            it('closes a pinny item using the close method', function(done) {
                element.pinny({
                    opened: function() {
                        element.pinny('close');
                    },
                    closed: function() {
                        assert.isFalse(element.closest('.pinny').hasClass('pinny--is-open'));
                        done();
                    }
                });

                element.pinny('open');
            });

            it('closes a pinny item using the close button', function(done) {
                element.pinny({
                    opened: function() {
                        element.closest('.pinny').find('.pinny__close').trigger('click');
                    },
                    closed: function() {
                        assert.isFalse(element.closest('.pinny').hasClass('pinny--is-open'));
                        done();
                    }
                });

                element.pinny('open');
            });

            it('throws for method calls that don\'t exist', function() {
                assert.throws(function() { element.pinny().pinny('noMethod'); });
            });

            it('throws when attempting to invoke private methods', function() {
                assert.throws(function() { element.pinny().pinny('_init'); });
            });

            it('throws when attempting to invoke methods that aren\'t functions', function() {
                assert.throws(function() { element.pinny().pinny('singleItemOpen'); });
            });
        });
    });
});