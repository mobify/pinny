/*!
 * =====================================================
 * Ratchet v2.0.1 (http://goratchet.com)
 * Copyright 2014 Connor Sears
 * Licensed under MIT.
 *
 * v2.0.1 designed by @connors.
 * =====================================================
 */
/* ----------------------------------
 * MODAL v2.0.1
 * Licensed under The MIT License
 * http://opensource.org/licenses/MIT
 * ---------------------------------- */

!(function () {
    'use strict';

    var findModals = function (target) {
        var i, modals = document.querySelectorAll('a');
        for (; target && target !== document; target = target.parentNode) {
            for (i = modals.length; i--;) {
                if (modals[i] === target) {
                    return target;
                }
            }
        }
    };

    var getModal = function (event) {
        var modalToggle = findModals(event.target);
        if (modalToggle && modalToggle.hash) {
            return document.querySelector(modalToggle.hash);
        }
    };

    window.addEventListener('touchend', function (event) {
        var modal = getModal(event);
        if (modal) {
            if (modal && modal.classList.contains('pinny-viewport')) {
                modal.classList.toggle('pinny--visible');
                if( modal.hasClassName('pinny--visible') ) {
                    Mobify.$('body').trigger('Ratchet:open');
                }
                else {
                    Mobify.$('body').trigger('Ratchet:close');
                }

                event.preventDefault(); // prevents rewriting url (apps can still use hash values in url)
            }
        }
    });

    // Give the dynamic value of height
    // --------------------------------
    // Value will change when the window screen resize.
    // eg. if header changes from one to two lines and the value will change.

    $(window).on('resize orientationchange', function() {

        var $getHeight = $('.pinny-title').height();

        // change value of height and top
        $('.pinny-header, .pinny-header .pinny-close').css('height', $getHeight);
        $('.pinny-content').css('top', $getHeight);

    });

    // Give the value of height on document ready.
    $(document).ready(function() {

        var $getHeight = $('.pinny-title').height();

        // change value of height and top
        $('.pinny-header, .pinny-header .pinny-close').css('height', $getHeight);
        $('.pinny-content').css('top', $getHeight);

    });

    // TO DO:
    // ------
    // - get engi to create our own script
    // - support Android legacy, currently only support Android 4.0 and higher
    //    - add pinny--is-legacy-android class
    // - support iOS 5 and lower
    // - add prevents rewriting url

}());