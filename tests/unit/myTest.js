define([
    'text!fixtures/iframe_pinny.html'
    // 'modal-center'
    // 'pinny'
], function(fixture/*, modalCenter*/) {
    var Pinny;
    var modalCenter;
    var $element;
    var $;

    describe('Pinny constructor', function() {
        beforeEach(function(done) {
            // var $iframe = $('<iframe>', {
            //     id: 'abc',
            //     src: '/tests/fixtures/iframe_pinny.html'
            // });
            // var $iframe = $(fixture);
            // var $iframe = $('<iframe>');
            // var $fixture = $(fixture);
            // $('#iframe_container').append($iframe);
            // $($iframe[0].contentDocument).find('body').append($fixture);
            var iFrame = document.createElement('iframe');
            var domain = location.origin;
            document.body.appendChild(iFrame);

            window.addEventListener('message', function() {
                $ = iFrame.contentWindow.$;

                Pinny = $.fn.pinny.Constructor;
                modalCenter = iFrame.contentWindow.PinnyEffect;
                $element = $(fixture).find('#pinny-container');
                // end beforeEach, start running tests
                done();
            });

            iFrame.contentDocument.write(fixture);

            // Pinny = $.fn.pinny.Constructor;
            // $element = $(fixture);

            // when scripts finish loading, finish "beforeEach" and start running the tests
            //
            // iframe.contentWindow.addEventListener("load", function() {
            //  $element = iframe.contentWindow.$('sel')
            //  done();    
            //})
            //iframe.contenDocument.write(fixture);
            //document.close();
            //
        });

        it('creates a pinny instance', function() {
            var pinny = new Pinny($element, {
                effect: modalCenter
            });

            assert.isDefined(pinny);

            console.log('pinny is in: ', pinny.$doc);

            // pinny.destroy();
        });
    });
});