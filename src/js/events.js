Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var comingText;
var notComingText;
var addComment;
var enter;
var commentText;
var yesText;
var noText;
var save;
var dateText;
var timeText;
var cancelText;
if (language == "NO") {
    comingText = "Kommer";
    notComingText = "Kommer ikke";
    addComment = "Skriv en kommentar";
    enter = "Trykk enter for å fullføre";
    commentText = "Kommentar";
    yesText = "Ja";
    noText = "Nei";
    save = "Lagre";
    dateText = "Dato";
    timeText = "Klokkeslett";
    cancelText = "Avbryt";
} else {
    comingText = "Attending";
    notComingText = "Not attending";
    addComment = "Write a comment";
    enter = "Press enter to submit";
    commentText = "Comment";
    yesText = "Yes";
    noText = "No";
    save = "Save";
    dateText = "Date";
    timeText = "Time";
    cancelText = "Cancel";
}

var amountOfMembers;

var members = Parse.Object.extend("data_" + klubbID + "_Members");
var queryMembers = new Parse.Query(members);
queryMembers.equalTo("role", "spiller");
queryMembers.find({
    success: function (results) {
        amountOfMembers = results.length;
    }
})

var allAnswersArray = new Array();
var allAnswers;

var coming;
var notComing;
//recursive call, initial loopCount is 0 (we haven't looped yet)
function getAllRecords(loopCount, eventId) {


    if (loopCount == 0) {
        allAnswersArray = [];

        var listing = ".event-stats";
        $(listing).html('');

        coming = 0;
        notComing = 0;
    }

    var eventPointer = {
        __type: 'Pointer',
        className: 'data_' + klubbID + "_Events",
        objectId: eventId
    }

    ///set your record limit
    var limit = 100;

    var queryEvents = new Parse.Object.extend("data_" + klubbID + "_Events_Answers");
    new Parse.Query(queryEvents)
        .limit(limit)
        .include('member.user')
        .skip(limit * loopCount)
        .equalTo("event", eventPointer)
        .find({
            success: function (results) {
                if (results.length > 0) {

                    for (var j = 0; j < results.length; j++) {

                        allAnswers = results[j];
                        allAnswersArray.push(allAnswers);

                        var eventType = results[j].get("event").get("eventID");
                        var eventAnswer = results[j].get("attending");

                        if (eventAnswer == true) {
                            eventAnswer = comingText;
                            coming++;
                        } else if (eventAnswer == false) {
                            eventAnswer = notComingText;
                            notComing++;
                        }

                        var eventComment = results[j].get("comment");;

                        if (results[j].get("member")) {
                            var eventAuthor = results[j].get("member").get("user");
                            var eventAuthorName = eventAuthor.get("name");

                            var userImg = "";
                            var noUserImg = "";
                            if (eventAuthor.get("profileImage_small")) {
                                var brukerPB = eventAuthor.get("profileImage_small");
                                var PBUrl = brukerPB.url();
                                userImg = "<img src='" + PBUrl + "'>";
                            } else {
                                noUserImg = '<img src="./src/img/User_Small.png">';
                            }

                            var outputUsers = "";
                            outputUsers += '<div id="user">';
                            outputUsers += userImg;
                            outputUsers += noUserImg;
                            outputUsers += '<div id="user-text">';
                            outputUsers += '<h4>' + eventAuthorName + '</h4>';
                            outputUsers += '<p>' + eventAnswer + '</p>';
                            outputUsers += '</div>';
                            if ((eventComment != null) && (eventComment != undefined) && (eventComment != "")) {
                                outputUsers += '<p id="comment">' + commentText + ': ' + eventComment + '</p>';
                            } else {
                                /*
                                outputUsers += '<input type="text" placeholder="' + addComment + '"/>';
                                outputUsers += '<p>' + enter + '</p>';*/
                            }
                            outputUsers += '</div>';

                            var listing = "#event-stats" + eventId;
                            $(listing).append(outputUsers);
                        }
                    }

                    loopCount++;

                    getAllRecords(loopCount, eventId);
                } else {
                    drawChart();
                }
            },
            error: function (error) {}
        });
}


var allEventsArray = new Array();
var allEvents;

function getAllEvents(loopCount, date) {

    if (loopCount == 0) {
        allAnswersArray = [];
        $("#list-events").html('');
    }

    var showStatsText;
    var noEventText;
    var trainingText;
    var eventText;
    if (language == "NO") {
        showStatsText = "Trykk her for å hente svarene fra arrangementet";
        noEventText = "Fant ingen arrangementer denne dagen";
        trainingText = "Trening";
        eventText = "Arrangement";
    } else {
        showStatsText = "Press here to get the answers from the event";
        noEventText = "No events found this day";
        trainingText = "Practice";
        eventText = "Event";
    }

    ///set your record limit
    var limit = 100;

    var queryEvents = new Parse.Object.extend("data_" + klubbID + "_Events");
    new Parse.Query(queryEvents)
        .limit(limit)
        .skip(limit * loopCount)
        .find({
            success: function (results) {
                if (results.length > 0) {

                    var checkForEvents = new Array();
                    for (var j = 0; j < results.length; j++) {

                        allEvents = results[j];
                        var eventId = allEvents.id;
                        var eventName = allEvents.get("name");
                        var eventDate = allEvents.get("date");
                        eventDate.setHours(0, 0, 0, 0);

                        //console.log(eventDate);
                        date.setHours(0, 0, 0, 0);

                        //console.log(date);
                        if (eventDate.getTime() === date.getTime()) {
                            checkForEvents.push(true);
                            if (language == "NO") {
                                moment.locale('nb');

                            } else {
                                moment.locale('no');

                            }

                            var date1 = moment(eventDate).format('llll');
                            var date2 = date1.slice(0, -15);

                            if ((eventName == undefined) || (eventName == "")) {
                                if (allEvents.get("eventID") == "training") {
                                    eventName = trainingText;
                                } else {
                                    eventName = eventText;
                                }
                            }


                            var outputEvent = "";

                            outputEvent += '<div id="event">';
                            outputEvent += '<h2>' + eventName + '</h2>';
                            outputEvent += '<h3>' + date2 + '</h3>';
                            outputEvent += '<div class="editdelete">';
                            outputEvent += '<div class="nohide">';
                            outputEvent += '<i class="material-icons" id="' + eventId + '" onclick="confirmDelete(id)">close</i>';
                            outputEvent += '</div>';
                            outputEvent += '<i class="material-icons" id="' + eventId + '" onclick="editEvent(id)">create</i>';
                            outputEvent += '</div>';
                            outputEvent += '<div id="button">';
                            outputEvent += '<button name="0" id="' + eventId + '" onclick="getAllRecords(name, id)">' + showStatsText + '</button>';
                            outputEvent += '</div>';
                            outputEvent += '<div id="event-stats' + eventId + '" class="event-stats"></div>';
                            outputEvent += '</div>';

                            $("#list-events").append(outputEvent);
                        }

                        allEventsArray.push(allEvents);

                        /*
                          var eventType = results[j].get("event").get("eventID");
                          var eventAnswer = results[j].get("attending");
                           */
                    }

                    if (checkForEvents.indexOf(true) == -1) {


                        var outputEvent = "";

                        outputEvent += '<div id="noEvent">';
                        outputEvent += '<h2>' + noEventText + '</h2>';
                        outputEvent += '</div>';

                        $("#list-events").html(outputEvent);


                    }


                    loopCount++;

                    getAllEvents(loopCount, date);
                } else {

                }
            },
            error: function (error) {}
        });
}

var date = new Date();
getAllEvents(0, date);

$(".datepicker").datepicker({
    onSelect: function (date) {
        var date = $(this).datepicker('getDate');

        var eventDate = date;

        if (eventDate != undefined) {

            $("#list-events").html('');

            getAllEvents(0, eventDate);

        }

    }
});

function drawChart() {

    $("#draw-chart").html('');

    var amountOfNotAnswered = amountOfMembers - coming - notComing;

    var attended;
    var notAttended;
    var notAnswered;
    var attendanceStats;

    if (language == "NO") {
        attended = "Deltatt";
        notAttended = "Ikke deltatt";
        notAnswered = "Ikke svart";
        attendanceStats = "Oppmøtestatistikk";
    } else {
        attended = "Attended";
        notAttended = "Not attended";
        notAnswered = "Not answered";
        attendanceStats = "Attendance statistics";
    }

    google.charts.load('current', {
        callback: function () {

            var container = document.getElementById('draw-chart').appendChild(document.createElement('div'));

            var data = google.visualization.arrayToDataTable([
                                      ["Attendance", attendanceStats],
                                      [attended, coming],
                                      [notAttended, notComing],
                                      [notAnswered, amountOfNotAnswered],
                                    ]);
            var options = {
                title: attendanceStats,
                colors: ['#2E9C00', '#cf2424', '#F6A623'],
                chartArea: {
                    width: 400,
                    height: 300
                },
                width: 600,
                height: 400,
            };
            var chart = new google.visualization.PieChart(container);
            chart.draw(data, options);
        },

        packages: ['corechart']
    });
}

function confirmDelete(eventId) {
    var confirmText;

    if (language == "NO") {
        confirmText = "Er du sikker på at du vil slette dette arrangementet";
    } else {
        confirmText = "Are you sure you want to delete this event";
    }

    var outputBox = "";
    outputBox += '<div id="confirmKick" class="nohide">';
    outputBox += '<p>' + confirmText + '?</p>';
    outputBox += '<button onclick="cancel()">' + noText + '</button>';
    outputBox += '<button id="' + eventId + '" onclick="deleteEvent(id)">' + yesText + '</button>';
    outputBox += '</div>';

    $("#confirm-delete").html(outputBox);
}

function deleteEvent(eventId) {

    var events = Parse.Object.extend("data_" + klubbID + "_Events");
    var queryEvents = new Parse.Query(events);

    queryEvents.equalTo("objectId", eventId);
    queryEvents.find({
        success: function (results) {
            var eventObject = results[0];
            var eventDate = eventObject.get("date");
            eventObject.destroy({
                success: function (result) {

                    var output = "";

                    $("#confirm-delete").html(output);

                    getAllEvents(0, eventDate);
                },
                error: function (result, error) {

                }
            });
        }
    });

}


$(document).click(function (event) {
    if (!$(event.target).closest('.nohide').length) {
        if ($('#confirmKick').is(":visible")) {
            var output = "";

            $("#confirm-delete").html(output);
        }
    }
});


function cancel() {
    var output = "";

    $("#confirm-delete").html(output);
}

function editEvent(eventId) {

    var changeTitle;
    var changeName;

    if (language == "NO") {
        changeName = "Nytt navn";
        changeTitle = "Gjør endringer på arrangementet";
    } else {
        changeName = "New name";
        changeTitle = "Make changes to the event";
    }

    var outputEditor = "";

    outputEditor += '<div class="editor" id="editor' + eventId + '">';
    outputEditor += '<h1>' + changeTitle + '</h1>';
    outputEditor += '<p id="' + eventId + '" onclick="cancelEdit(id)">' + cancelText + '</p>';
    outputEditor += '<input type="text" placeholder="' + changeName + '" id="newName"/>';
    outputEditor += '<p id="date-pick">' + dateText + ': <input type="text" autocomplete="off" id="form-date" class="datepicker"></p>';
    outputEditor += '<p id="time-pick-once">' + timeText + ': <input type="text" autocomplete="off" id="form-time" class="timepicker" /></p>';
    outputEditor += '<button id="' + eventId + '" onclick="sendEdit(id)">' + save + '</button>';
    outputEditor += '</div>';

    var listevent = "#event-stats" + eventId;
    $(listevent).html(outputEditor);

    var timeString;
    if (language == "NO") {
        timeString = "Tid";
    } else {
        timeString = "Time";
    }

    $(function () {
        $(".datepicker").datepicker();
    });

    $('.timepicker').wickedpicker({

        twentyFour: true,
        upArrow: 'wickedpicker__controls__control-up',
        downArrow: 'wickedpicker__controls__control-down',
        close: 'wickedpicker__close',
        hoverState: 'hover-state',
        title: timeString
    });
}


function cancelEdit(eventId) {

    var listevent = "#event-stats" + eventId;
    $(listevent).html('');

}

function sendEdit(eventId) {

    var noDate;
    var noTitle;
    if (language == "NO") {
        noDate = "Fyll inn dato før du oppdaterer arrangementet";
        noTitle = "Fyll inn tittel før du oppdaterer arrangementet";
    } else {
        noDate = "Fill in the date before you update the event";
        noTitle = "Fill in the title before you update the event";
    }

    var eventTitle = $('#newName').val();

    if ((eventTitle == undefined) || (eventTitle == "")) {
        alert(noTitle);
    }

    var timepickers = $('#form-time').wickedpicker();
    var eventTime = timepickers.wickedpicker('time');

    var hours = eventTime.substring(0, 2);
    var minutes = eventTime.substring(5, 7);

    var ampm = eventTime.substring(8, 10);

    if (ampm == "PM") {
        hours = parseInt(hours);
        hours = hours + 12;
    }
    minutes = parseInt(minutes);

    var datePicker = $('#form-date').datepicker();
    var eventDate = datePicker.datepicker('getDate');
    if (eventDate == null) {
        alert(noDate);
    } else {
        eventDate.setHours(hours);
        eventDate.setMinutes(minutes);
    }

    var events = Parse.Object.extend("data_" + klubbID + "_Events");
    var queryEvents = new Parse.Query(events);

    queryEvents.equalTo("objectId", eventId);
    queryEvents.find({
        success: function (results) {
            var eventObject = results[0];
            eventObject.set("date", eventDate);
            eventObject.set("name", eventTitle);

            eventObject.save({
                success: function () {

                    var listevent = "#event-stats" + eventId;
                    $(listevent).html('');

                    getAllEvents(0, eventDate);

                }
            });
        }
    });
}
