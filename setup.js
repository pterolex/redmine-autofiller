(function($) {
    var DEBUG_MODE = true;

    var issueNumberHTML = 
        '<p><label for="time_entry_issue_id">Issue number</label>' +
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

    var progressHTML = 
       '<h2>I\'m doing the most boring job for you...</h2><progress id="progressBar"></progress>';

    var convertToUtc = function(dd) {
        var date = dd.getDate(), month = dd.getMonth(), year = dd.getFullYear();
        dd.setUTCDate(date); dd.setUTCMonth(month); dd.setUTCFullYear(year);
        return dd;
    };

    var postDates = function(activityId, issueId, hours, entriesToPost) {
        if (entriesToPost.length === 0) {
            var maxVal = $("#progressBar").attr('max');
            $("#progressBar").val(maxVal);
            alert("Days were logged successfully!\nPlease send feedback to iaroshenko@gm" + "ail.com");
            $("#progressWrapper").hide();
            $("#fillWrapper").show();
        } else {
            var oldVal = $("#progressBar").val();
            $("#progressBar").val(oldVal + 1);
            var strDate = entriesToPost[0];
            var slicedArray = entriesToPost.slice(1);
            var nextCall = postDates.bind(null, activityId, issueId, hours, slicedArray);
            var entryToLog = {         
                "time_entry[activity_id]": activityId,
                "time_entry[comments]": "",
                "time_entry[hours]": ("" + hours),
                "time_entry[issue_id]": issueId,
                "time_entry[spent_on]": strDate
            };
            if (DEBUG_MODE) {
                console.log(entryToLog);
                setTimeout(nextCall, 1000);
            } else {
                $.post("/projects/givenimaging/timelog/edit", entryToLog, nextCall);
            }
        }
    };

    var isNumeric = function(value) {
        return /^\d+$/.test(value);
    };

    var clickOnFill = function() {
        var dates = $("#calendarPH").multiDatesPicker("getDates", "object");

        var activityId = $("#time_entry_activity_id").val();
        var issueId = $("#time_entry_issue_id").val();
        var totalTime = 0;
        var entriesToPost = [];
        if (issueId == "") {
            alert("Please fill Issue number");
        } else if (!isNumeric(issueId)) {
            alert("Issue number is not a valid number");
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
            var questionMessage = "Are you sure you want to log " + totalTime + " hours?\n";
            if (DEBUG_MODE) {
                questionMessage += "(Don't worry, it's in debug mode. No real logging will be done)";
            } else {
                questionMessage += "(CAUTION! Real logging will be done!)";
            }
            if (confirm(questionMessage)) {
                $("#fillWrapper").hide();
                if ($("#progressWrapper").length === 0) {
                    var progressWrapper = $("<div id='progressWrapper' class='progressWrapper'></div>");
                    var progressBar = $(progressHTML);
                    progressBar.attr('max', entriesToPost.length);
                    progressWrapper.append(progressBar);
                    $("#mainHolder").prepend(progressWrapper);
                } else {
                    $("#progressWrapper").show();
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

        var actionWrapper = $("<div id='actionWrapper' class='actionWrapper'></div>");
        $("#fillWrapper").append(actionWrapper);

        var button = $("<button class='main_button'/>").text("Fill").click(clickOnFill);
        actionWrapper.append(button);
        button = $("<button/>").text("Select working days").click(setWorkingDates);
        actionWrapper.append(button);
        button = $("<button/>").text("Clear selection").click(clearDates);
        actionWrapper.append(button);


        var el = $(selectorHTML);
        $("#fillWrapper").prepend(el);
        el = $(issueNumberHTML);
        $("#fillWrapper").prepend(el);
        el = $("<h2>Autofill script</h2>");
        $("#fillWrapper").prepend(el);
    };

    window.setup = function() {
        if ($("#calendarPH").length === 0) {
            var mainHolder = $("<div id='mainHolder'></div>");
            $("#content").prepend(mainHolder);

            var fillWrapper = $("<div id='fillWrapper' class='fillWrapper'></div>");
            mainHolder.append(fillWrapper);

            var calendarPlaceholder = $("<div id='calendarPH'></div>");
            fillWrapper.append(calendarPlaceholder);
            showCalendar();
        }
    };
}(jQuery));