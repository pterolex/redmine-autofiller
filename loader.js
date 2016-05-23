(function($) {
 $("<div id='ldr'>Loading...</div>").prependTo("#content");
 var gH="https://rawgit.com/s-iaroshenko";
 $.ajax(gH+"/redmine-autofiller/master/autofill.css").done(function(css){
  $("<style type='text/css'>"+css+"</style>").appendTo("head");
  $.getScript("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js",function(){
   $.getScript(gH+"/Multiple-Dates-Picker-for-jQuery-UI/master/jquery-ui.multidatespicker.js",function(){
    $.getScript(gH+"/redmine-autofiller/master/setup.js",function(){
     $("#ldr").hide();
     setup();
    });
   });
  });
 });
}(jQuery));
