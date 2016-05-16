(function($) {
    var styles=".ui-datepicker .ui-datepicker-calendar .ui-state-highlight a{background:#743620 none;color:white;}";

    var issueNumberHTML = 
        '<p><label for="time_entry_issue_id">Issue</label>' +
        '<input id="time_entry_issue_id" type="text" value="" size="6" name="time_entry[issue_id]"></p>';

    var selectorHTML = 
       '<p><label for="time_entry_activity_id">Activity</label><select id="time_entry_activity_id" name="time_entry[activity_id]">' +
       '<option value="">--- Please select ---</option>' +
       '<option value="9">Development</option>' +
       '<option value="16">Testing</option>' +
       '<option value="20">Graphic Design</option>' +
       '<option value="56">Sick leave</option>' +
       '<option value="57">Vacation</option>' +
       '</select></p>';

    var convertToUtc = function(dd) {
        var date = dd.getDate(), month = dd.getMonth(), year = dd.getFullYear();
        dd.setUTCDate(date); dd.setUTCMonth(month); dd.setUTCFullYear(year);
        return dd;
    };

    var postDates = function(activityId, issueId, hours, entriesToPost) {
        if (entriesToPost.length === 0) {
            alert("Logged successfully!");
            $("#progressBar").hide();
            $("#mainFillerHolder").show();
        } else {
            var oldVal = $("#progressBar").val();
            $("#progressBar").val(oldVal + 1);
            var strDate = entriesToPost[0];
            var slisedArray = entriesToPost.slice(1);
            var nextCall = postDates.bind(null, activityId, issueId, hours, slisedArray);
            var entryToLog = {         
                "time_entry[activity_id]": activityId,
                "time_entry[comments]": "",
                "time_entry[hours]": ("" + hours),
                "time_entry[issue_id]": issueId,
                "time_entry[spent_on]": strDate
            };
            if (true/*debug*/) {
                console.log(entryToLog);
                setTimeout(nextCall, 1000);
            } else {
                $.post("/projects/givenimaging/timelog/edit", entryToLog, nextCall);
            }
        }
    };

    var clickOnFill = function() {
        var dates = $("#calendarPH").multiDatesPicker("getDates", "object");

        var activityId = $("#time_entry_activity_id").val();
        var issueId = $("#time_entry_issue_id").val();
        var totalTime = 0;
        var entriesToPost = [];
        if (issueId == "") {
            alert("Please fill Issue number");
        } else if (activityId == "") {
            alert("Please select Activity");
        } else if (dates.length === 0) {
            alert("No date selected!");
        } else {
            var originMonth = new Date().getMonth();
            for(var i = 0; i < dates.length; ++i) {
                var dd = new Date(dates[i].valueOf());
                dd = convertToUtc(dd);
                var strDate = dd.toISOString().slice(0, 10);
                if (parseInt(strDate.slice(5, 7), 10) !== (originMonth + 1)) {
                    console.log("Error in month:" + strDate + " " + (originMonth + 1));
                } else {
                    entriesToPost.push(strDate);
                    totalTime += 8;
                }
            }
            if (confirm("Are you sure you want to log " + totalTime + " hours?")) {
                $("#mainFillerHolder").hide();
                if ($("#progressBar").length === 0) {
                    var progressBar = $("<progress id='progressBar' max='" + entriesToPost.length + "'></progress>");
                    $("#content").prepend(progressBar);
                }
                $("#progressBar").val(0);
                postDates(activityId, issueId, 8, entriesToPost);
            }
        }
        
    };

    var clearDates = function() {
        $("#calendarPH").multiDatesPicker('resetDates', 'picked');
    };

    var setWorkingDates = function() {
        $("#calendarPH").multiDatesPicker('resetDates', 'picked');
        var dates = getWorkingDates();
        $("#calendarPH").multiDatesPicker('addDates', dates);
    };

    var getWorkingDates = function() {
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
        return dates;
    };

    var showCalendar = function() {
        var dates = getWorkingDates();
        $("#calendarPH").multiDatesPicker({ firstDay: 1, addDates: dates });
        var button = $("<button/>").text("Fill").click(clickOnFill);
        $("#mainFillerHolder").prepend(button);
        button = $("<button/>").text("Clear dates").click(clearDates);
        $("#mainFillerHolder").prepend(button);
        button = $("<button/>").text("Set working dates").click(setWorkingDates);
        $("#mainFillerHolder").prepend(button);

        var el = $(selectorHTML);
        $("#mainFillerHolder").prepend(el);
        el = $(issueNumberHTML);
        $("#mainFillerHolder").prepend(el);
    };

    window.setup = function() {
        if ($("#calendarPH").length === 0) {
            var newSS=document.createElement("link");
            newSS.rel="stylesheet";
            newSS.href="data:text/css," + escape(styles);
            document.documentElement.childNodes[0].appendChild(newSS);
            var mainFillerHolder = $("<div id='mainFillerHolder'></div>");
            $("#content").prepend(mainFillerHolder);

            var calendarPlaceholder = $("<div id='calendarPH'></div>");
            $("#mainFillerHolder").prepend(calendarPlaceholder);

            showCalendar();
        }
    };
}(jQuery));