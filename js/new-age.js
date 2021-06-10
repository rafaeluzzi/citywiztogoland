(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    /*$(document).on('click', 'a.page-scroll', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });*/

    // Highlight the top nav as scrolling occurs
   /* $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 100
    });*/

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });



})(jQuery); // End of use strict
(function(){var qs,js,q,s,d=document,gi=d.getElementById,ce=d.createElement,gt=d.getElementsByTagName,id='typef_orm_share',b='https://s3-eu-west-1.amazonaws.com/share.typeform.com/';if(!gi.call(d,id)){js=ce.call(d,'script');js.id=id;js.src=b+'share.js';q=gt.call(d,'script')[0];q.parentNode.insertBefore(js,q)}})()

document.addEventListener('touchmove', function (event) {
  if (event.scale !== 1) { event.preventDefault(); }
}, false);
