(function($){
  var lastScrollTop = 0;
  $(window).scroll(function(event){
    var st = $(this).scrollTop();
    if(st > 120){
      if (st > lastScrollTop){
        $(".sticky-header .header-section").css("top", "-200px");
      } else if (st < lastScrollTop){
        $(".sticky-header .header-section").css("top", "0");
      }
      lastScrollTop = st;
    }else{
      $(".sticky-header .header-section").css("top", "0");
    }
  });
}(jQuery));