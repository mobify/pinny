require(['config'], function() {
    require([
        'modal-center',
        '$',
        'pinny'
    ],
    function(position, $) {
        // Initialize Pinny
        var $pinny = $('#somePinny').pinny({
            position: position,
            coverage: '80%'
        });

        $('.pinnyActivator').on('click', function() {
            $pinny.pinny('toggle');
        });

        // Enable active states
        $(document).on('touchstart', function() {});
    });
});
