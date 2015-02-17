define([
    'test-sandbox',
    'text!fixtures/pinny.html',
    'text!fixtures/fullPinny.html'
], function(testSandbox, fixture, fullFixture) {
    var Pinny;
    var $element;
    var modalCenter;
    var $;

    describe('Pinny plugin', function() {
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

        describe('binding to Zepto\'s fn', function() {
            it('defines pinny in Zepto', function() {
                var pinny = $.fn.pinny;

                expect(pinny).to.be.defined;
            });

            it('defines pinny as a function', function() {
                var pinny = $.fn.pinny;

                expect(pinny).to.be.a('function');
            });
        });

        describe('invoking pinny', function() {
            it('creates pinny instance on $element', function() {
                $element.pinny({
                    effect: modalCenter
                });

                expect($element.data('pinny')).to.be.defined;
            });

            it('stores $element inside instance', function() {
                $element.pinny({
                    effect: modalCenter
                });

                expect($element.data('pinny').$pinny).to.be.defined;
            });
        });

        describe('invoking pinny methods before plugin is initialized', function() {
            it('throws when not initialized', function() {
                expect(function() { $element.pinny('open'); }).to.throw;
            });
        });

        describe('invoking pinny methods using the plugin interface', function() {
            it('opens a pinny using the open method', function(done) {
                $element.pinny({
                    effect: modalCenter,
                    opened: function() {
                        expect($element.closest('.pinny').hasClass('pinny--is-open'));

                        done();
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
                        expect($element.closest('.pinny').hasClass('pinny--is-open'));

                        done();
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
                        expect($element.closest('.pinny').hasClass('pinny--is-open')).to.be.false;

                        done();
                    }
                });

                $element.pinny('open');
            });
        });

        describe('invoking plugin methods on uninitialized plugin', function() {
            it('throws for method calls that don\'t exist', function() {
                expect(function() {
                    $element
                        .pinny({
                            effect: modalCenter
                        })
                        .pinny('noMethod');
                });
            });

            it('throws when attempting to invoke private methods', function() {
                expect(function() {
                    $element
                        .pinny({
                            effect: modalCenter
                        })
                        .pinny('_init');
                });
            });

            it('throws when attempting to invoke methods that aren\'t functions', function() {
                expect(function() {
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

                expect($pinny.closest('.lockup__container').length).to.equal(1);
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

                expect($pinny.find('.pinny__header')).to.have.length(1);
                expect($pinny.find('.pinny__content')).to.have.length(1);
            });

            it('creates the correct structure with header = "Something"', function() {
                var $pinny = $element
                    .pinny({
                        effect: modalCenter,
                        structure: {
                            header: 'Something'
                        }
                    })
                    .closest('.pinny');


                expect($pinny.find('.pinny__header')).to.have.length(1);
                expect($pinny.find('.pinny__content')).to.have.length(1);
                expect($pinny.find('.pinny__header').text()).to.contain('Something');
            });

            it('creates the correct structure with an HTML header', function() {
                var $pinny = $element
                    .pinny({
                        effect: modalCenter,
                        structure: {
                            header: '<span class="pinny__header--custom">Custom header</span><button class="pinny__close"></button>'
                        }
                    })
                    .closest('.pinny');

                expect($pinny.find('.pinny__header')).to.have.length(1);
                expect($pinny.find('.pinny__header--custom')).to.have.length(1);
                expect($pinny.find('.pinny__header--custom').text()).to.contain('Custom header');
            });
        });

        describe('creates a pinny with correct footer', function() {
            it('creates the structure with footer = false', function() {
                $element = $(fullFixture);
                var $pinny = $element.pinny({
                    effect: modalCenter,
                    structure: {
                        header: false,
                        footer: false
                    }
                });

                expect($pinny.find('.pinny__header')).to.have.length(1);
                expect($pinny.find('.pinny__content')).to.have.length(1);
                expect($pinny.find('.pinny__footer')).to.have.length(0);
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

                expect($pinny.find('.pinny__header')).to.have.length(1);
                expect($pinny.find('.pinny__content')).to.have.length(1);
                expect($pinny.find('.pinny__footer')).to.have.length(1);
                expect($pinny.find('.pinny__footer').text()).to.contain('Footer');
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

                expect($pinny.find('.pinny__header')).to.have.length(1);
                expect($pinny.find('.pinny__footer--custom')).to.have.length(1);
                expect($pinny.find('.pinny__footer--custom').text()).to.contain('Custom footer');
            });
        });

        describe('external inputs', function() {
            var $externalInput1;
            var $externalInput2;
            var $externalSelect;

            beforeEach(function() {
                $externalInput1 = $('#external-input1');
                $externalInput2 = $('#external-input2');
                $externalSelect = $('#external-select');
            });

            it('sets tabindex of focusable elements that are outside of pinny to -1 when pinny is open', function(done) {
                $element.pinny({
                    effect: modalCenter,
                    opened: function() {
                        console.log($externalInput1.attr('tabindex'))
                        expect(+$externalInput1.attr('tabindex')).to.equal(-1);
                        expect(+$externalInput2.attr('tabindex')).to.equal(-1);
                        expect(+$externalSelect.attr('tabindex')).to.equal(-1);

                        $element.pinny('close');
                    },
                    closed: function() {
                        done();
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
                        expect($externalInput1.attr('tabindex')).to.be.null;
                        expect(+$externalInput2.attr('tabindex')).to.equal(10);
                        expect($externalSelect.attr('tabindex')).to.be.null;

                        done();
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

                expect($element.parent()[0]).to.equal($element.closest('body')[0]);
            });

            it('removes all pinny structure when given a custom structure', function() {
                var $element = $(fullFixture);

                var $pinny = $element
                    .pinny({
                        effect: modalCenter
                    });

                $pinny.pinny('destroy');

                expect($element.parent()[0]).to.equal($element.closest('body')[0]);
            });
        });
    });
});