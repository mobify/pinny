define([
    'test-sandbox',
    'text!fixtures/pinny.html'
], function(testSandbox, fixture) {
    var Pinny;
    var pinny;
    var $element;
    var modalCenter;
    var $;

    describe('Pinny options', function() {
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

        describe('creates default options when no options parameter not used', function() {
            beforeEach(function() {
                pinny = new Pinny($element, {
                    effect: modalCenter
                });
            });

            it('throws with no effect defines effect', function() {
                expect(function() {
                    pinny = new Pinny($element);
                }).to.throw;
            });

            it('correctly defines header', function() {
                expect(pinny.options.structure.header).to.equal(Pinny.DEFAULTS.structure.header);
                expect(pinny.options.structure.header).to.be.a('string');
            });

            it('correctly defines footer', function() {
                expect(pinny.options.structure.footer).to.equal(Pinny.DEFAULTS.structure.footer);
                expect(pinny.options.structure.footer).to.be.a('boolean');
            });

            it('correctly defines zIndex', function() {
                expect(pinny.options.zIndex).to.equal(2);
                expect(pinny.options.zIndex).to.be.a('number');
            });

            it('correctly defines coverage', function() {
                expect(pinny.options.coverage).to.equal('100%');
                expect(pinny.options.coverage).to.be.a('string');
            });

            it('correctly defines duration', function() {
                expect(pinny.options.duration).to.equal(200);
                expect(pinny.options.duration).to.be.a('number');
            });

            it('correctly defines easing', function() {
                expect(pinny.options.easing).to.equal('swing');
                expect(pinny.options.easing).to.be.a('string');
            });

            it('correctly defines events', function() {
                expect(pinny.options.open).to.be.a('function');
                expect(pinny.options.opened).to.be.a('function');
                expect(pinny.options.close).to.be.a('function');
                expect(pinny.options.closed).to.be.a('function');
            });

            it('correctly defines container', function() {
                expect(pinny.options.container).to.be.defined;
            });
        });

        describe('creates custom options when options parameter used', function() {
            it('correctly defines effect', function() {
                pinny = new Pinny($element, { effect: modalCenter });

                expect(pinny.options.effect).to.deep.equal(modalCenter);
                expect(pinny.options.effect).to.be.a('function');
            });

            it('correctly defines custom header', function() {
                pinny = new Pinny($element, { effect: modalCenter, structure: { header: '<header>Pinnay</header>' } });

                expect(pinny.options.structure.header).to.equal('<header>Pinnay</header>');
                expect(pinny.options.structure.header).to.be.a('string');
            });

            it('correctly defines custom footer', function() {
                pinny = new Pinny($element, { effect: modalCenter, structure: { footer: '<footer>Stinky foot</footer>' } });

                expect(pinny.options.structure.footer).to.equal('<footer>Stinky foot</footer>');
                expect(pinny.options.structure.footer).to.be.a('string');
            });

            it('correctly defines zIndex of 5', function() {
                pinny = new Pinny($element, { effect: modalCenter, zIndex: 5 });

                expect(pinny.options.zIndex).to.equal(5);
                expect(pinny.options.zIndex).to.be.a('number');
            });

            it('correctly defines coverage of 80%', function() {
                pinny = new Pinny($element, { effect: modalCenter, coverage: '80%' });

                expect(pinny.options.coverage, '80%');
                expect(pinny.options.coverage).to.be.a('string');
            });

            it('correctly defines duration of 400', function() {
                pinny = new Pinny($element, { effect: modalCenter, duration: 400 });

                expect(pinny.options.duration).to.equal(400);
                expect(pinny.options.duration).to.be.a('number');
            });

            it('correctly defines easing as ease-in-out', function() {
                pinny = new Pinny($element, { effect: modalCenter, easing: 'ease-in-out'});

                expect(pinny.options.easing).to.equal('ease-in-out');
                expect(pinny.options.easing).to.be.a('string');
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('I\'m open!')
                };
                pinny = new Pinny($element, { effect: modalCenter, open: open });

                expect(pinny.options.open).to.equal(open);
                expect(pinny.options.open).to.be.a('function');
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('Open!')
                };
                pinny = new Pinny($element, { effect: modalCenter, open: open });

                expect(pinny.options.open).to.equal(open);
                expect(pinny.options.open).to.be.a('function');
            });

            it('correctly defines opened event', function() {
                var opened = function() {
                    console.log('Opened!')
                };
                pinny = new Pinny($element, { effect: modalCenter, opened: opened });

                expect(pinny.options.opened).to.equal(opened);
                expect(pinny.options.opened).to.be.a('function');
            });

            it('correctly defines close event', function() {
                var close = function() {
                    console.log('Close!')
                };
                pinny = new Pinny($element, { effect: modalCenter, close: close });

                expect(pinny.options.close).to.equal(close);
                expect(pinny.options.close).to.be.a('function');
            });

            it('correctly defines closed event', function() {
                var closed = function() {
                    console.log('Closed!')
                };
                pinny = new Pinny($element, { effect: modalCenter, closed: closed });

                expect(pinny.options.closed).to.equal(closed);
                expect(pinny.options.closed).to.be.a('function');
            });

            it('correctly defines the container $element', function() {
                pinny = new Pinny($element, { effect: modalCenter, container: '#pinny-container' });

                expect(pinny.options.container).to.equal('#pinny-container');
            });
        });
    });
});
