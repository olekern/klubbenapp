Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var comingText;
var notComingText;
var addComment;
var enter;
var commentText;
if (language == "NO") {
    comingText = "Kommer";
    notComingText = "Kommer ikke";
    addComment = "Skriv en kommentar";
    enter = "Trykk enter for å fullføre";
    commentText = "Kommentar";
} else {
    comingText = "Attending";
    notComingText = "Not attending";
    addComment = "Write a comment";
    enter = "Press enter to submit";
    commentText = "Comment";
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
        showStatsText = "Trykk her for å hente svarene fra hendelsen";
        noEventText = "Fant ingen hendelser denne dagen";
        trainingText = "Trening";
        eventText = "Hendelse";
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
                            
                            if((eventName == undefined)||(eventName == "")){
                                if(allEvents.get("eventID") == "training"){
                                    eventName = trainingText;
                                }else{
                                    eventName = eventText;
                                }
                            }


                            var outputEvent = "";

                            outputEvent += '<div id="event">';
                            outputEvent += '<h2>' + eventName + '</h2>';
                            outputEvent += '<h3>' + date2 + '</h3>';
                            outputEvent += '<button name="0" id="' + eventId + '" onclick="getAllRecords(name, id)">' + showStatsText + '</button>';
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
