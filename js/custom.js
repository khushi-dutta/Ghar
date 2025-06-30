(function ($) {
  
  "use strict";

    jQuery('.counter-thumb').appear(function() {
      jQuery('.counter-number').countTo();
    });

    $('.smoothscroll').click(function(){
    var el = $(this).attr('href');
    var elWrapped = $(el);
    var header_height = $('.navbar').height();

    scrollToDiv(elWrapped,header_height);
    return false;

    function scrollToDiv(element,navheight){
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop-navheight;

      $('body,html').animate({
      scrollTop: totalScroll
      }, 300);
    }
});

    $(document).ready(function() {
      var fullPath = window.location.pathname;
      var currentPage = fullPath.split('/').pop();
      
      $('.navbar-nav .nav-link').removeClass('active');
      
      var pagePatterns = {
        'index.html': ['Home', 'index.html'],
        'emergency.html': ['Emergency SoS', 'emergency.html'],
        'booking.html': ['Book an Appointment', 'booking.html'],
        'moodCalendar.html': ['Mood Calendar', 'moodCalendar.html'],
        'assessment.html': ['Self Assessment', 'assessment.html']
      };
      
      if (currentPage === '' || currentPage === '/' || fullPath === '/') {
        currentPage = 'index.html';
      }
      
      var isInSubDirectory = fullPath.includes('/bookSession/') || fullPath.includes('/calendar/');
      
      $('.navbar-nav .nav-link').each(function() {
        var linkText = $(this).text().trim();
        var linkHref = $(this).attr('href');
        var shouldActivate = false;
        
        if (pagePatterns[currentPage]) {
          var patterns = pagePatterns[currentPage];
          shouldActivate = patterns.includes(linkText) || 
                          linkHref.includes(currentPage) ||
                          (linkHref.endsWith(currentPage));
        }
        
        if ((currentPage === 'index.html' || currentPage === '') && linkText === 'Home') {
          shouldActivate = true;
        }
        
        if (isInSubDirectory && fullPath.includes('booking.html') && linkText === 'Book an Appointment') {
          shouldActivate = true;
        }
        
        if (isInSubDirectory && fullPath.includes('moodCalendar.html') && linkText === 'Mood Calendar') {
          shouldActivate = true;
        }
        
        if (shouldActivate) {
          $(this).addClass('active');
        }
      });
    });
    
  })(window.jQuery);


