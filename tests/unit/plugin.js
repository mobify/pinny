define([
    'text!fixtures/pinny.html',
    'text!fixtures/fullPinny.html',
    '$',
    'modal-center',
    'pinny'
], function(fixture, fullFixture, $, modalCenter) {
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

    describe('Pinny plugin', function() {
        beforeEach(function() {
            $element = $(fixture);
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
            it('creates pinny instance on $element', function() {
                $element.pinny({
                    effect: modalCenter
                });

                assert.isDefined($element.data('pinny'));
                $element.pinny('destroy');
            });

            it('stores $element inside instance', function() {
                $element.pinny({
                    effect: modalCenter
                });

                assert.isDefined($element.data('pinny').$pinny);
                $element.pinny('destroy');
            });
        });

        describe('invoking pinny methods before plugin is initialized', function() {
            it('throws when not initialized', function() {
                assert.throws(function() { $element.pinny('open'); });
            });
        });

        describe('invoking pinny methods using the plugin interface', function() {
            it('opens a pinny using the open method', function(done) {
                $element.pinny({
                    effect: modalCenter,
                    opened: function() {
                        assert.isTrue($element.closest('.pinny').hasClass('pinny--is-open'));

                        _destroy(done);
                    }
                });

                $element.pinny('open');
            });

            it('closes a pinny item using the close method', function(done) {
                $element.pinny({
                    effect: modalCenter,
                    opened: function() {
                        $element.pinny('close');
                    },
                    closed: function() {
                        assert.isFalse($element.closest('.pinny').hasClass('pinny--is-open'));

                        _destroy(done);
                    }
                });

                $element.pinny('open');
            });

            it('closes a pinny item using the close button', function(done) {
                $element.pinny({
                    effect: modalCenter,
                    opened: function() {
                        $element.closest('.pinny').find('.pinny__close').trigger('click');
                    },
                    closed: function() {
                        assert.isFalse($element.closest('.pinny').hasClass('pinny--is-open'));

                        _destroy(done);
                    }
                });

                $element.pinny('open');
            });
        });

        describe('invoking plugin methods on uninitialized plugin', function() {
            afterEach(function() {
                $element.pinny('destroy');
            });

            it('throws for method calls that don\'t exist', function() {
                assert.throws(function() {
                    $element
                        .pinny({
                            effect: modalCenter
                        })
                        .pinny('noMethod');
                });
            });

            it('throws when attempting to invoke private methods', function() {
                assert.throws(function() {
                    $element
                        .pinny({
                            effect: modalCenter
                        })
                        .pinny('_init');
                });
            });

            it('throws when attempting to invoke methods that aren\'t functions', function() {
                assert.throws(function() {
                    $element
                        .pinny({
                            effect: modalCenter
                        })
                        .pinny('singleItemOpen');
                });
            });
        });

        describe('creates a pinny with correct container', function() {
            it('creates pinny with the default container', function() {
                var $pinny = $element.pinny({ effect: modalCenter });

                assert.equal($pinny.closest('.lockup__container').length, 1);

                $pinny.pinny('destroy');
            });
        });

        describe('creates a pinny with correct header', function() {
            it('creates the structure with header = false', function() {
                var $pinny = $(fullFixture).pinny({
                    effect: modalCenter,
                    structure: {
                        header: false
                    }
                });

                assert.equal($pinny.find('.pinny__header').length, 1);
                assert.equal($pinny.find('.pinny__content').length, 1);

                $pinny.pinny('destroy');
            });

            it('creates the correct structure with header = "Something"', function() {
                var $element = $(fixture);
                var $pinny = $element
                    .pinny({
                        effect: modalCenter,
                        structure: {
                            header: 'Something'
                        }
                    })
                    .closest('.pinny');


                assert.equal($pinny.find('.pinny__header').length, 1);
                assert.equal($pinny.find('.pinny__content').length, 1);
                assert.include($pinny.find('.pinny__header').text(), 'Something');

                $element.pinny('destroy');
            });

            it('creates the correct structure with an HTML header', function() {
                var $element = $(fixture);
                var $pinny = $element
                    .pinny({
                        effect: modalCenter,
                        structure: {
                            header: '<span class="pinny__header--custom">Custom header</span><button class="pinny__close"></button>'
                        }
                    })
                    .closest('.pinny');

                assert.equal($pinny.find('.pinny__header').length, 1);
                assert.equal($pinny.find('.pinny__header--custom').length, 1);
                assert.include($pinny.find('.pinny__header--custom').text(), 'Custom header');

                $element.pinny('destroy');
            });
        });

        describe('creates a pinny with correct footer', function() {
            it('creates the structure with footer = false', function() {
                var $element = $(fullFixture);
                var $pinny = $element.pinny({
                    effect: modalCenter,
                    structure: {
                        header: false,
                        footer: false
                    }
                });

                assert.equal($pinny.find('.pinny__header').length, 1);
                assert.equal($pinny.find('.pinny__content').length, 1);
                assert.equal($pinny.find('.pinny__footer').length, 0);

                $element.pinny('destroy');
            });

            it('creates the correct structure with footer = "Footer"', function() {
                var $element = $(fixture);
                var $pinny = $element
                    .pinny({
                        effect: modalCenter,
                        structure: {
                            footer: 'Footer'
                        }
                    })
                    .closest('.pinny');

                assert.equal($pinny.find('.pinny__header').length, 1);
                assert.equal($pinny.find('.pinny__content').length, 1);
                assert.equal($pinny.find('.pinny__footer').length, 1);
                assert.include($pinny.find('.pinny__footer').text(), 'Footer');

                $element.pinny('destroy');
            });

            it('creates the correct structure with an HTML footer', function() {
                var $element = $(fixture);
                var $pinny = $element
                    .pinny({
                        effect: modalCenter,
                        structure: {
                            footer: '<span class="pinny__footer--custom">Custom footer</span>'
                        }
                    })
                    .closest('.pinny');

                assert.equal($pinny.find('.pinny__header').length, 1);
                assert.equal($pinny.find('.pinny__footer--custom').length, 1);
                assert.include($pinny.find('.pinny__footer--custom').text(), 'Custom footer');

                $element.pinny('destroy');
            });
        });

        describe('external inputs', function() {
            var $externalInput1 = $('#external-input1');
            var $externalInput2 = $('#external-input2');
            var $externalSelect = $('#external-select');

            beforeEach(function() {
                $externalInput1.removeAttr('tabindex');
                $externalInput2.attr('tabindex', 10);
                $externalSelect.removeAttr('tabindex');
            });

            it('sets tabindex of focusable elements that are outside of pinny to -1 when pinny is open', function(done) {
                $element.pinny({
                    effect: modalCenter,
                    opened: function() {
                        assert.equal($externalInput1.attr('tabindex'), -1);
                        assert.equal($externalInput2.attr('tabindex'), -1);
                        assert.equal($externalSelect.attr('tabindex'), -1);

                        $element.pinny('close');
                    },
                    closed: function() {
                        _destroy(done);
                    }
                });

                $element.pinny('open');
            });

            it('restores tabindex of focusable elements that are outside of pinny to its original value when pinny is closed', function(done) {
                $element.pinny({
                    effect: modalCenter,
                    opened: function() {
                        $element.pinny('close');
                    },
                    closed: function() {
                        assert.equal($('#external-input1').attr('tabindex'), null);
                        assert.equal($('#external-input2').attr('tabindex'), 10);
                        assert.equal($('#external-select').attr('tabindex'), null);

                        _destroy(done);
                    }
                });

                $element.pinny('open');
            });
        });

        describe('destroy', function() {
            it('removes all pinny structure', function() {
                var $pinny = $element
                    .pinny({
                        effect: modalCenter
                    });

                $pinny.pinny('destroy');

                assert.equal($element.parent()[0], document.body);
            });

            it('removes all pinny structure when given a custom structure', function() {
                var $element = $(fullFixture);

                var $pinny = $element
                    .pinny({
                        effect: modalCenter
                    });

                $pinny.pinny('destroy');

                assert.equal($element.parent()[0], document.body);
            });
        });
    });
});