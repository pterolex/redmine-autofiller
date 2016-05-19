(function($) {
    if ($("#loader").length === 0) {
        var loader = $("<div id='loader'>Loading...</div>");
        $("#content").prepend(loader);
    } else {
        $("#loader").show();
    }

    var gitHub = "https://raw.githubusercontent.com/s-iaroshenko";
    $.ajax(gitHub + "/redmine-autofiller/master/autofill.css").done(function(data) {
        $("<style type='text/css'>\n" + data + "</style>").appendTo("head");
        $.getScript("https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.6/jquery-ui.min.js", function() {
            $.getScript(gitHub + "/Multiple-Dates-Picker-for-jQuery-UI/master/jquery-ui.multidatespicker.js", function() {
                $.getScript(gitHub + "/redmine-autofiller/master/setup.js", function() {
                    $("#loader").hide();
                    setup();
                });
            });
        });
    });
}(jQuery));
