(function($) {
    var styles=".ui-datepicker .ui-datepicker-calendar .ui-state-highlight a{background:#743620 none;color:white;}";

    var issueNumberHTML = 
        '<p><label for="time_entry_issue_id">Issue</label>' +
        '<input id="time_entry_issue_id" type="text" value="9986" size="6" name="time_entry[issue_id]"></p>';

    var selectorHTML = 
       '<p><label for="time_entry_activity_id">Activity</label><select id="time_entry_activity_id" name="time_entry[activity_id]">' +
       '<option value="">--- Please select ---</option>' +
       '<option value="9">Development</option>' +
       '<option value="16">Testing</option>' +
       '<option value="20">Graphic Design</option>' +
       '</select></p>';

    var convertToUtc = function(dd) {
        var date = dd.getDate(), month = dd.getMonth(), year = dd.getFullYear();
        dd.setUTCDate(date); dd.setUTCMonth(month); dd.setUTCFullYear(year);
        return dd;
    };

    var clickOnFill = function() {
        var dates = $("#calendarPH").multiDatesPicker("getDates", "object");

        var activityId = $("#time_entry_activity_id").val();
        var issueId = $("#time_entry_issue_id").val();
        if (issueId == "" || activityId == "") {
            alert("Please fill all fields!");
        } else {
            var originMonth = new Date().getMonth();
            for(var i = 0; i < dates.length;++i) {
                var dd = convertToUtc(dates[i]);
                var strDate = dd.toISOString().slice(0, 10);
                if (parseInt(strDate.slice(5, 7), 10) !== (originMonth + 1)) {
                    console.log("Error in month:" + strDate + " " + (originMonth + 1));
                } else {
console.log("Logging: issue #" + issueId + ", activity " + activityId + ", date " + strDate);
                    if (false) {
                    $.post( "/projects/givenimaging/timelog/edit", {         
                        "time_entry[activity_id]": activityId,
                        "time_entry[comments]": "",
                        "time_entry[hours]": "8",
                        "time_entry[issue_id]": issueId,
                        "time_entry[spent_on]": strDate
                    });        }
                }
            }
        }
    };

    var clickOnShow = function() {
        var originMonth = new Date().getMonth();
        var dates = [];
        for (var i = 1; i <= 31; ++i) {        
            var dd = new Date();
            dd.setUTCDate(i);
            dd = convertToUtc(dd);
            if (dd.getMonth() !== originMonth) {
                break;
            }
            if (dd.getDay() !== 6 && dd.getDay() !== 0) {
                dates.push(dd);
            }
        }
        $("#calendarPH").multiDatesPicker({
            firstDay: 1,
            addDates: dates
        });
        var fillButton = $("<button/>").text("Fill").click(clickOnFill);
        $("#content").prepend(fillButton);
        var el = $(selectorHTML);
        $("#content").prepend(el);
        el = $(issueNumberHTML);
        $("#content").prepend(el);
    };

    window.setup = function() {
        var newSS=document.createElement("link");
        newSS.rel="stylesheet";
        newSS.href="data:text/css," + escape(styles);
        document.documentElement.childNodes[0].appendChild(newSS);

        var button = $("<button/>").text("Show Calendar").click(clickOnShow);
        $("#content").prepend(button);
        var calendarPlaceholder = $("<div id='calendarPH'></div>");
        $("#content").prepend(calendarPlaceholder);
    };
}(jQuery));