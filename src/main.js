var main = require('./setup');
var $ = window.$ = window.jQuery = require('jquery');
require('jquery-ui');
require('./vendor/jquery-ui.multidatespicker.js');
require('./autofill.css');

var d = new Date(),c="ukr";

$.getScript("http://kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForMonth&jsonp=holidaysLoaded"+
    "&month="+(d.getMonth()+1)+"&year="+d.getFullYear()+"&country="+c).always(function(){
    $("#ldr").hide();
    main();
});