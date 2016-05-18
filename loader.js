(function($) {
    if ($("#loader").length === 0) {
        var loader = $("<div id='loader'>Loading...</div>");
        $("#content").prepend(loader);
    } else {
        $("#loader").show();
    }

    var gitHub = "https://raw.githubusercontent.com/s-iaroshenko";
    $("head").append("<link rel='stylesheet' href='" + gitHub + "/redmine-autofiller/master/autofill.css" + "' type='text/css' />");

    $.getScript("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js", function() {
        $.getScript(gitHub + "/Multiple-Dates-Picker-for-jQuery-UI/master/jquery-ui.multidatespicker.js", function() {
            $.getScript(gitHub + "/redmine-autofiller/master/setup.js", function() {
                $("#loader").hide();
                setup();
            });
        });
    });
}(jQuery));
