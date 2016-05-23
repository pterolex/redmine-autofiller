(function($) {
 $("<div id='ldr'>Loading...</div>").prependTo("#content");
 var debugMode = !!window.debug,sevice=debugMode?"raw.githubusercontent.com":"cdn.rawgit.com",
 gH="https://"+sevice+"/s-iaroshenko",br=debugMode?"test":"8d1fb77c7ab36adabaff2a6bc7784423f0274da2";
 $.ajax(gH+"/redmine-autofiller/"+br+"/autofill.css").done(function(css){
  $("<style type='text/css'>"+css+"</style>").appendTo("head");
  $.getScript("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js",function(){
   $.getScript(gH+"/Multiple-Dates-Picker-for-jQuery-UI/master/jquery-ui.multidatespicker.js",function(){
    $.getScript(gH+"/redmine-autofiller/"+br+"/setup.js",function(){
     var d=new Date(),c="ukr";
     $.getScript("http://kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForMonth&jsonp=holidaysLoaded"+
     "&month="+(d.getMonth()+1)+"&year="+d.getFullYear()+"&country="+c).always(function(){
      $("#ldr").hide();
      setup();
     });
    });
   });
  });
 });
}(jQuery));
