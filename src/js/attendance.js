Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var members = Parse.Object.extend("data_" + klubbID + "_Members");
var queryMemb = new Parse.Query(members);

var amountOfPlayers = 0;
var member;
var allMembers;
queryMemb.include("user");
queryMemb.find({
    success: function (membs) {

        for (var k in membs) {

            allMembers = membs;

            var userRole = membs[k].get("role");

            var userId = membs[k].get("user").id;
            var currentUser = Parse.User.current().id;

            if (userId == currentUser) {
                member = membs[k];
            }

            if (userRole == "spiller") {
                amountOfPlayers++;
            }

        }
        
        if(amountOfPlayers == 0){
            
            var noneText;
            if(language  == "NO"){
                noneText = "Fant ingen utøvere å vise statistikk for";
            }else{
                noneText = "Did not find any athlets in the team";
            }
            
            var outputNone = "";
            outputNone += '<div id="noPlayers">';
            outputNone += '<p>' + noneText + '</p>';
            outputNone += '</div>';
            
            
            $('#list-player-attendance').html(outputNone);
        }

    }
});

var events = Parse.Object.extend("data_" + klubbID + "_Events");
var queryEvents = new Parse.Query(events);
var allPractices = new Array();
var amountOfTrainings = 0;
queryEvents.limit(1000);
queryEvents.descending("date");
queryEvents.find({
    success: function (results) {

        for (var i in results) {

            var eventType = results[i].get("eventID");

            if (eventType == "training") {
                amountOfTrainings++;
                allPractices.push(results[i]);
            }

        }

    }
});



var amountOfTrueAnswers = 0;
var amountOfFalseAnswers = 0;
var amountOfNotAnswered = 0;

var allAnswersArray = new Array();
var allAnswers;
//recursive call, initial loopCount is 0 (we haven't looped yet)
function getAllRecords(loopCount) {

    if (loopCount == 0) {
        allAnswersArray = [];
    }

    ///set your record limit
    var limit = 100;

    var queryEvents = new Parse.Object.extend("data_" + klubbID + "_Events_Answers");
    new Parse.Query(queryEvents)
        .limit(limit)
        .include('member.user')
        .skip(limit * loopCount)
        .find({
            success: function (results) {
                if (results.length > 0) {

                    for (var j = 0; j < results.length; j++) {
                        allAnswers = results;

                        var eventType = results[j].get("event").get("eventID");
                        var eventAnswer = results[j].get("attending");

                        if (eventType == "training") {
                            allAnswersArray.push(results[j]);
                            if (eventAnswer == true) {
                                amountOfTrueAnswers++;
                            } else if (eventAnswer == false) {
                                amountOfFalseAnswers++;
                            }
                        }
                    }

                    loopCount++;

                    getAllRecords(loopCount);
                } else {

                    attendanceOverview();
                }
            },
            error: function (error) {
                //badness with the find
            }
        });
}
getAllRecords(0);


function attendanceOverview() {
    
    $("#list-player-attendance").append('');

    var eventsAnswers = amountOfPlayers * amountOfTrainings;
    amountOfNotAnswered = eventsAnswers - amountOfTrueAnswers - amountOfFalseAnswers;
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

            var container = document.getElementById('piechart').appendChild(document.createElement('div'));

            var data = google.visualization.arrayToDataTable([
                                      ["Attendance", attendanceStats],
                                      [attended, amountOfTrueAnswers],
                                      [notAttended, amountOfFalseAnswers],
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


    google.charts.load('current', {
        callback: function () {

            checkFunction();

            for (var i in allMembers) {

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Topping');
                data.addColumn('number', 'Slices');

                var outputMemberAttendance = "";

                var thisMember = allMembers[i];

                var thisMemberName = thisMember.get("user").get("name");
                var thisMemberId = thisMember.id;
                var thisMemberRole = thisMember.get("role");

                if ((role == "trener") || (thisMemberName == Parse.User.current().get("name"))) {

                    if (thisMemberRole == "spiller") {

                        var outputImg = "";
                        var userImg = "";
                        var noUserImg = "";
                        if (thisMember.get("user").get("profileImage_small")) {
                            var brukerPB = thisMember.get("user").get("profileImage_small");
                            var PBUrl = brukerPB.url();
                            userImg = "<img src='" + PBUrl + "'>";
                        } else {
                            noUserImg = '<img src="./src/img/User_Small.png">';
                        }

                        outputMemberAttendance += '<div class="membAttendance">';
                        outputMemberAttendance += "<div id=\"memberPb\">";
                        outputMemberAttendance += userImg;
                        outputMemberAttendance += noUserImg;
                        outputMemberAttendance += "</div>"
                        outputMemberAttendance += '<div class="text">';
                        outputMemberAttendance += '<button id="' + thisMemberId + '" name="' + thisMemberName + '" onclick="playerAttendance(id, name);">' + thisMemberName + '</button>';

                        var nrAttend = 0;
                        var nrNotAttend = 0;
                        for (var k in allAnswersArray) {

                            var eventAuthor = allAnswersArray[k].get("member");
                            if (eventAuthor == undefined) {

                            } else {
                                if (eventAuthor.id == thisMember.id) {
                                    var eventAttendance = allAnswersArray[k].get("attending");

                                    if (eventAttendance == true) {
                                        nrAttend++;
                                    } else if (eventAttendance == false) {
                                        nrNotAttend++;
                                    }
                                }
                            }

                        }

                        outputMemberAttendance += '<p>' + attended + ' ' + nrAttend + '/' + amountOfTrainings + '</p>';
                        outputMemberAttendance += "</div>"
                        outputMemberAttendance += '<div id="draw-charts' + i + '" class="charts">';
                        outputMemberAttendance += '</div>';
                        outputMemberAttendance += '</div>';
                        $("#list-player-attendance").append(outputMemberAttendance);

                        var nrNotAnswered = amountOfTrainings - nrAttend - nrNotAttend;

                        data.addRows([
              [attended, nrAttend],
              [notAttended, nrNotAttend],
              [notAnswered, nrNotAnswered]
            ]);

                        var options = {

                            width: 80,
                            height: 80,
                            legend: "none",
                            colors: ['#2E9C00', '#cf2424', '#F6A623']
                        };

                        var container = document.getElementById('draw-charts' + i).appendChild(document.createElement('div'));
                        var chart = new google.visualization.PieChart(container);
                        chart.draw(data, options);
                    }
                }
            }
        },
        packages: ['corechart']
    });

}

function checkFunction() {

    var memberId = localStorage.getItem("memberId");
    var memberName = localStorage.getItem("memberName");


    setTimeout(
        function () {
            if ((memberId == undefined) || (memberId == "") || (memberId == null)) {} else {
                playerAttendance(memberId, memberName);

                localStorage.removeItem("memberId");
                localStorage.removeItem("memberName");
            }

        }, 500);

}

function playerAttendance(memberId, memberName) {

    var currentname = Parse.User.current().get("name");

    if ((currentname == memberName) || (role == "trener")) {
        setTimeout(
            function () {

                var outputSingleStats = "";

                outputSingleStats += '<div class="single-box">';
                outputSingleStats += '<div id="draw-player-chart"></div>';
                outputSingleStats += '<div id="list-events"></div>';
                outputSingleStats += '</div>';

                $("#list-singlePlayer-attendance").html(outputSingleStats);

                var nrattended = 0;
                var nrnotAttended = 0;
                var nrnotAnswered;

                var participationTrue;
                var participationFalse;
                var participationNotAnswered;

                if (language == "NO") {
                    participationTrue = "Deltatt";
                    participationFalse = "Ikke deltatt";
                    participationNotAnswered = "Ikke svart";
                } else {
                    participationTrue = "Attended";
                    participationFalse = "Not attended";
                    participationNotAnswered = "Not answered";
                }

                for (var t in allPractices) {

                    var outputSS = "";
                    outputSS += '<div class="event-box">';
                    outputSS += '<div class="top-box">';
                    outputSS += '<div class="date-boxes" id="date-box' + t + '"></div>';
                    outputSS += '<div class="attendance-boxes" id="attendance-box' + t + '"></div>';
                    outputSS += '</div>';
                    outputSS += '<div class="comment-boxes" id="comment-box' + t + '"></div>';

                    outputSS += '</div>';

                    $("#list-events").append(outputSS);

                    var practiceId = allPractices[t].id;

                    if (language == "NO") {
                        moment.locale('nb');

                    } else {
                        moment.locale('no');

                    }

                    var answerDate = allPractices[t].get("date");
                    var date1 = moment(answerDate).format('llll');
                    var date = date1.slice(0, -15);

                    var outputDate = "";
                    outputDate += '<h3>' + date + '</h3>';
                    var dateListing = "#date-box" + t;
                    $(dateListing).html(outputDate);

                    var answered = false;

                    for (var l in allAnswersArray) {
                        var answer = allAnswersArray[l];
                        var answerId = answer.id;

                        var answerMember = answer.get("member");


                        if (answerMember == undefined) {

                        } else {

                            var answerMemberId = answer.get("member").id;

                            if (answerMemberId == memberId) {

                                var practiceId = allPractices[t].id;
                                var eventId = answer.get("event").id;

                                if (practiceId == eventId) {
                                    var comment;
                                    answered = true;

                                    if (language == "NO") {
                                        comment = "Kommentar";
                                    } else {
                                        comment = "Comment";
                                    }


                                    var answerAttending = answer.get("attending");
                                    var answerComment = answer.get("comment");

                                    if (answerComment) {
                                        if (answerComment.length != 0) {
                                            var outputComment = "";
                                            outputComment += '<h4 id="comment' + t + '">' + comment + ': ' + answerComment + '</h4>';
                                            outputComment += '<button class="material-icons" name="' + answerId + '" id="' + t + '" onclick="showTextField(id, name)">create</button>';
                                            var commentListing = "#comment-box" + t;
                                            $(commentListing).html(outputComment);
                                        }
                                    } else {

                                        var submit;
                                        var writeComment;
                                        var pressEnter;
                                        if (language == "NO") {
                                            submit = "Publiser";
                                            writeComment = "Skriv en kommentar";
                                            pressEnter = "Trykk enter-tasten for å publisere";
                                        } else {
                                            submit = "Submit";
                                            writeComment = "Write a comment";
                                            pressEnter = "Press enter to submit";
                                        }
                                        var outputCom = "";
                                        outputCom += '<button class="material-icons" name="' + answerId + '" id="' + t + '" onclick="showTextField(id, name)">create</button>';
                                        var commentListing = "#comment-box" + t;
                                        $(commentListing).append(outputCom);

                                        $('#textarea' + t).on('keyup', function (e) {
                                            if (e.which == 13) {
                                                submitComment(answerId, t);
                                            }
                                        });
                                    }


                                    var participation;
                                    var color;
                                    if (answerAttending == true) {
                                        nrattended++;
                                        participation = participationTrue;
                                        color = "#2E9C00";
                                    } else {
                                        nrnotAttended++;
                                        participation = participationFalse;
                                        color = "#CF2424";
                                    }
                                    var outputAttendance = "";
                                    outputAttendance += '<button class="button" id="' + answerId + '" name="' + memberId + '_' + memberName + '" onclick="changeAttendance(id, name);" style="color: ' + color + '">' + participation + '</button>';

                                    var attendanceListing = "#attendance-box" + t;
                                    $(attendanceListing).html(outputAttendance);

                                }


                            }
                        }

                    }

                    if (answered == false) {
                        var outputAttendance = "";
                        outputAttendance += '<button class="button" id="' + practiceId + '" name="' + memberId + '_' + memberName + '" onclick="createAttendance(id, name);" style="color:#F6A623;">' + participationNotAnswered + '</button>';

                        var attendanceListing = "#attendance-box" + t;
                        $(attendanceListing).html(outputAttendance);
                    }

                }


                nrnotAnswered = amountOfTrainings - nrattended - nrnotAttended;

                google.charts.load('current', {
                    callback: function () {

                        var container = document.getElementById('draw-player-chart').appendChild(document.createElement('div'));

                        var data = google.visualization.arrayToDataTable([
                                      ["Name", memberName],
                                      [participationTrue, nrattended],
                                      [participationFalse, nrnotAttended],
                                      [participationNotAnswered, nrnotAnswered],
                                    ]);
                        var options = {
                            title: memberName,
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


                document.getElementById('list-singlePlayer-attendance').style.display = 'block';
            }, 0);

    }
}


$(document).click(function (event) {
    if (!$(event.target).closest('.single-box').length) {
        if ($('.single-box').is(":visible")) {
            var output = "";

            $("#list-singePlayer-attendance").html(output);

            document.getElementById('list-singlePlayer-attendance').style.display = 'none';
        }
    }
});


function changeAttendance(answerId, memberInfo) {

    var answer = Parse.Object.extend("data_" + klubbID + "_Events_Answers");
    var Query = new Parse.Query(answer);
    Query.equalTo("objectId", answerId);
    Query.find({
        success: function (objects) {
            for (var j in objects) {

                var attendance = objects[j].get("attending");
                var newAttendance;
                if (attendance == true) {
                    newAttendance = false;
                } else if (attendance == false) {
                    newAttendance = true;
                }

                var member = memberInfo.split('_');
                var memberId = member[0];
                var memberName = member[1];


                objects[j].set("attending", newAttendance);
                objects[j].save({
                    success: function () {
                        playerAttendance(memberId, memberName);
                    }
                });


            }

        },
        error: function (error) {
            console.log("Query error:" + error.message);
            $("#draw-charts").html(outputnone);
        }
    });
}

function createAttendance(eventId, memberInfo) {

    var member = memberInfo.split('_');
    var memberId = member[0];
    var memberName = member[1];


    var eventPointer = {
        __type: 'Pointer',
        className: 'data_' + klubbID + "_Events",
        objectId: eventId
    }

    var userPointer = {
        __type: 'Pointer',
        className: 'data_' + klubbID + '_Members',
        objectId: memberId
    }


    var attending = true;


    var eventsAnswers = Parse.Object.extend("data_" + klubbID + "_Events_Answers");
    var newAttendance = new eventsAnswers();
    newAttendance.set("attending", attending);
    newAttendance.set("member", userPointer);
    newAttendance.set("event", eventPointer);
    newAttendance.save(null, {
        success: function () {
            localStorage.setItem("memberId", memberId);
            localStorage.setItem("memberName", memberName);
            document.location.reload();

        },
        error: function (newPost, error) {
            console.log("Error:" + error.message);
            handleParseError();
        }
    });

}

function showTextField(nr, ansId) {

    var textarea = "#textarea" + nr;
    if ($(textarea).length < 1) {

        if (document.getElementById("comment" + nr)) {
            document.getElementById("comment" + nr).style = "display: none;";
        }
        var submit;
        var writeComment;
        var pressEnter;
        if (language == "NO") {
            submit = "Publiser";
            writeComment = "Skriv en kommentar";
            pressEnter = "Trykk enter-tasten for å publisere";
        } else {
            submit = "Submit";
            writeComment = "Write a comment";
            pressEnter = "Press enter to submit";
        }

        var outputComment = "";
        $(commentListing).html(outputComment);
        outputComment += '<div id="write-comment' + nr + '">';
        outputComment += '<textarea rows="1" id="textarea' + nr + '" placeholder="' + writeComment + '" ></textarea>';
        outputComment += '<p>' + pressEnter + '</p>';
        outputComment += '</div>';

        var commentListing = "#comment-box" + nr;
        $(commentListing).append(outputComment);

        $('#textarea' + nr).on('keyup', function (e) {
            if (e.which == 13) {
                submitComment(ansId, nr);
            }
        });
    } else {
        document.getElementById("textarea" + nr).outerHTML = '';
        document.getElementById("write-comment" + nr).outerHTML = '';
        document.getElementById("comment" + nr).style = "display: block;";
    }

}

function submitComment(answerId, nr) {

    var comment;

    if (language == "NO") {
        comment = "Kommentar";
    } else {
        comment = "Comment";
    }


    var textbox = "#textarea" + nr;
    var commentValue = $(textbox).val();

    var answer = Parse.Object.extend("data_" + klubbID + "_Events_Answers");
    var Query = new Parse.Query(answer);
    Query.equalTo("objectId", answerId);
    Query.find({
        success: function (objects) {
            for (var j in objects) {

                objects[j].set("comment", commentValue);
                objects[j].save({
                    success: function () {

                        var outputComment = "";
                        outputComment += '<h4 id="comment' + nr + '">' + comment + ': ' + commentValue + '</h4>';
                        outputComment += '<button class="material-icons" name="' + answerId + '" id="' + nr + '" onclick="showTextField(id, name)">create</button>';

                        var commentListing = "#comment-box" + nr;
                        $(commentListing).html(outputComment);

                    }
                });


            }

        },
        error: function (error) {
            console.log("Query error:" + error.message);
        }
    });


}
