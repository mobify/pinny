define([
    'text!fixtures/pinny.html',
    '$',
    'modal-center',
    'pinny'
], function(fixture, $, modalCenter) {
    var Pinny;
    var element;

    describe('Pinny options', function() {
        beforeEach(function() {
            Pinny = $.fn.pinny.Constructor;
            element = $(fixture);
        });

        describe('creates default options when no options parameter not used', function() {
            it('correctly defines effect', function() {
                var pinny = new Pinny(element);

                assert.deepEqual(pinny.options.effect, Pinny.DEFAULTS.effect);
                assert.isObject(pinny.options.effect);
            });

            it('correctly defines header', function() {
                var pinny = new Pinny(element);

                assert.equal(pinny.options.structure.header, Pinny.DEFAULTS.structure.header);
                assert.isString(pinny.options.structure.header);
            });

            it('correctly defines footer', function() {
                var pinny = new Pinny(element);

                assert.equal(pinny.options.structure.footer, Pinny.DEFAULTS.structure.footer);
                assert.isBoolean(pinny.options.structure.footer);
            });

            it('correctly defines zIndex', function() {
                var pinny = new Pinny(element);

                assert.equal(pinny.options.zIndex, 2);
                assert.isNumber(pinny.options.zIndex);
            });

            it('correctly defines coverage', function() {
                var pinny = new Pinny(element);

                assert.equal(pinny.options.coverage, '100%');
                assert.isString(pinny.options.coverage);
            });

            it('correctly defines duration', function() {
                var pinny = new Pinny(element);

                assert.equal(pinny.options.duration, 200);
                assert.isNumber(pinny.options.duration);
            });

            it('correctly defines easing', function() {
                var pinny = new Pinny(element);

                assert.equal(pinny.options.easing, 'swing');
                assert.isString(pinny.options.easing);
            });

            it('correctly defines events', function() {
                var pinny = new Pinny(element);

                assert.isFunction(pinny.options.open);
                assert.isFunction(pinny.options.opened);
                assert.isFunction(pinny.options.close);
                assert.isFunction(pinny.options.closed);
            });

            it('correctly defines appendTo', function() {
                var pinny = new Pinny(element);

                assert.isDefined(pinny.options.appendTo);
            });
        });

        describe('creates custom options when options parameter used', function() {
            it('correctly defines effect', function() {
                var pinny = new Pinny(element, { effect: modalCenter });

                assert.deepEqual(pinny.options.effect, modalCenter);
                assert.isObject(pinny.options.effect);
            });

            it('correctly defines custom header', function() {
                var pinny = new Pinny(element, { structure: { header: '<header>Pinnay</header>' } });

                assert.equal(pinny.options.structure.header, '<header>Pinnay</header>');
                assert.isString(pinny.options.structure.header);
            });

            it('correctly defines custom footer', function() {
                var pinny = new Pinny(element, { structure: { footer: '<footer>Stinky foot</footer>' } });

                assert.equal(pinny.options.structure.footer, '<footer>Stinky foot</footer>');
                assert.isString(pinny.options.structure.footer);
            });

            it('correctly defines zIndex of 5', function() {
                var pinny = new Pinny(element, { zIndex: 5 });

                assert.equal(pinny.options.zIndex, 5);
                assert.isNumber(pinny.options.zIndex);
            });

            it('correctly defines coverage of 80%', function() {
                var pinny = new Pinny(element, { coverage: '80%' });

                assert.equal(pinny.options.coverage, '80%');
                assert.isString(pinny.options.coverage);
            });

            it('correctly defines duration of 400', function() {
                var pinny = new Pinny(element, { duration: 400 });

                assert.equal(pinny.options.duration, 400);
                assert.isNumber(pinny.options.duration);
            });

            it('correctly defines easing as ease-in-out', function() {
                var pinny = new Pinny(element, { easing: 'ease-in-out'});

                assert.equal(pinny.options.easing, 'ease-in-out');
                assert.isString(pinny.options.easing);
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('I\'m open!')
                };
                var pinny = new Pinny(element, { open: open });

                assert.equal(pinny.options.open, open);
                assert.isFunction(pinny.options.open);
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('Open!')
                };
                var pinny = new Pinny(element, { open: open });

                assert.equal(pinny.options.open, open);
                assert.isFunction(pinny.options.open);
            });

            it('correctly defines opened event', function() {
                var opened = function() {
                    console.log('Opened!')
                };
                var pinny = new Pinny(element, { opened: opened });

                assert.equal(pinny.options.opened, opened);
                assert.isFunction(pinny.options.opened);
            });

            it('correctly defines close event', function() {
                var close = function() {
                    console.log('Close!')
                };
                var pinny = new Pinny(element, { close: close });

                assert.equal(pinny.options.close, close);
                assert.isFunction(pinny.options.close);
            });

            it('correctly defines closed event', function() {
                var closed = function() {
                    console.log('Closed!')
                };
                var pinny = new Pinny(element, { closed: closed });

                assert.equal(pinny.options.closed, closed);
                assert.isFunction(pinny.options.closed);
            });

            it('correctly defines the appendTo element', function() {
                var pinny = new Pinny(element, { appendTo: '#pinny-container' });

                assert.equal(pinny.options.appendTo, '#pinny-container');
            });

            it('correctly adds pinny to the appendTo element', function() {
                var pinny = new Pinny(element, { appendTo: '#pinny-container' });
                assert.equal(element.closest('#pinny-container').length, 1);
            });
        });
    });
});
