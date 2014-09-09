define([
    'text!fixtures/pinny.html',
    'text!fixtures/fullPinny.html',
    '$',
    'pinny'
], function(fixture, fullFixture, $) {
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

        describe('creates a pinny with correct header', function() {
            it('creates the structure with header = false', function() {
                var $pinny = $(fullFixture).pinny({
                    header: false
                });

                assert.equal($pinny.find('.pinny__header').length, 1);
                assert.equal($pinny.find('.pinny__content').length, 1);
            });

            it('creates the correct structure with header = "Something"', function() {
                var $pinny = $(fixture)
                    .pinny({
                        header: 'Something'
                    })
                    .closest('.pinny');

                assert.equal($pinny.find('.pinny__header').length, 1);
                assert.equal($pinny.find('.pinny__content').length, 1);
                assert.include($pinny.find('.pinny__header').text(), 'Something');
            });

            it('creates the correct structure with an HTML header', function() {
                var $pinny = $(fixture)
                    .pinny({
                        header: '<span class="pinny__header--custom">Custom header</span><button class="pinny__close"></button>'
                    })
                    .closest('.pinny');

                assert.equal($pinny.find('.pinny__header').length, 1);
                assert.equal($pinny.find('.pinny__header--custom').length, 1);
                assert.include($pinny.find('.pinny__header--custom').text(), 'Custom header');
            });
        });
    });
});