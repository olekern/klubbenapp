Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var savedText;
var notSavedText;
var noDate;
var createText;

if (language == "NO") {
    savedText = "Lagret";
    notSavedText = "Ikke lagret";
    noDate = "Fyll inn dato før du oppretter hendelse";
    createText = "Opprett nytt arrangement";
} else {
    savedText = "Saved changes";
    notSavedText = "Changes not saved";
    noDate = "Fill in the date before you create the event";
    createText = "Create new event";
}

var members = Parse.Object.extend("data_" + klubbID + "_Members");
var queryMemb = new Parse.Query(members);

var amountOfPlayers = 0;
var member;
queryMemb.find({
    success: function (membs) {

        for (var k in membs) {

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
    }
});

function redirect() {

    if (role == "trener") {
        location.href = "events.html";
    }
}


function showNearestEvent() {
    var event = Parse.Object.extend("data_" + klubbID + "_Events");
    var query = new Parse.Query(event);

    query.ascending("date");
    query.find({
        success: function (results) {
            for (var i = 0; i < results.length; i++) {

                var eventId = results[i].id;

                var eventDate = results[i].get("date");

                var monthNamesNO = ["Januar", "Februar", "Mars", "April", "Mai", "Juni",
                          "Juli", "August", "September", "Oktober", "November", "Desember"];

                var monthNamesEN = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];

                if (language == "NO") {
                    var monthNames = monthNamesNO;
                } else {
                    var monthNames = monthNamesEN;
                }

                var monthInt = eventDate.getMonth();
                var month = monthNames[monthInt];

                var date = eventDate.getDate();

                if (language == "NO") {
                    var dateMonth = date + ". " + month;
                } else {
                    var dateMonth = date + "th " + month;
                }
                
                var hours = eventDate.getHours();
                var minutes = eventDate.getMinutes();
                if (minutes == 0) {
                    minutes = '00';
                }else if(minutes < 10){
                    minutes = '0' + minutes;
                }
                var time = hours + ":" + minutes;

                eventDate.setHours(0, 0, 0, 0);

                var dato = eventDate.toString();
                var datoen = dato.substring(4, 15);

                var today = new Date();
                today.setHours(0, 0, 0, 0);

                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);

                var twoDays = new Date();
                twoDays.setDate(twoDays.getDate() + 2);
                twoDays.setHours(0, 0, 0, 0);

                var threeDays = new Date();
                threeDays.setDate(threeDays.getDate() + 3);
                threeDays.setHours(0, 0, 0, 0);

                var fourDays = new Date();
                fourDays.setDate(fourDays.getDate() + 4);
                fourDays.setHours(0, 0, 0, 0);

                var fiveDays = new Date();
                fiveDays.setDate(fiveDays.getDate() + 4);
                fiveDays.setHours(0, 0, 0, 0);


                var sixDays = new Date();
                sixDays.setDate(sixDays.getDate() + 4);
                sixDays.setHours(0, 0, 0, 0);

                var sevenDays = new Date();
                sevenDays.setDate(sevenDays.getDate() + 4);
                sevenDays.setHours(0, 0, 0, 0);


                var eventType = results[i].get("eventID");

                var eventName;

                if (eventType == "training") {
                    if (language == "NO") {
                        eventName = "Trening";
                    } else {
                        eventName = "Practice";
                    }
                } else if (eventType == "custom") {
                    eventName = results[i].get("name");
                }

                var outputEvent = "";

                if (eventDate.getTime() === today.getTime()) {
                    outputEvent += '<i class="material-icons">fitness_center</i>';
                    outputEvent += '<h3>' + eventName + '</h3>';
                    outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                    outputEvent += '<h4>' + time + '</h4>';

                    if (role == "trener") {

                        coachEvent(eventId);
                    } else if (role == "spiller") {

                        playerEvent(eventId);
                    } else if (role == undefined) {

                        showNearestEvent();
                    }

                    results = i;
                    break;

                } else if (eventDate.getTime() === tomorrow.getTime()) {
                    outputEvent += '<i class="material-icons">fitness_center</i>';
                    outputEvent += '<h3>' + eventName + '</h3>';
                    outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                    outputEvent += '<h4>' + time + '</h4>';

                    if (role == "trener") {
                        coachEvent(eventId);
                    } else if (role == "spiller") {
                        playerEvent(eventId);
                    } else if (role == undefined) {
                        showNearestEvent();
                    }

                    results = i;
                    break;

                } else if (eventDate.getTime() === twoDays.getTime()) {
                    outputEvent += '<i class="material-icons">fitness_center</i>';
                    outputEvent += '<h3>' + eventName + '</h3>';
                    outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                    outputEvent += '<h4>' + time + '</h4>';

                    if (role == "trener") {
                        coachEvent(eventId);
                    } else if (role == "spiller") {
                        playerEvent(eventId);
                    } else if (role == undefined) {
                        showNearestEvent();
                    }

                    results = i;
                    break;

                } else if (eventDate.getTime() === threeDays.getTime()) {
                    outputEvent += '<i class="material-icons">fitness_center</i>';
                    outputEvent += '<h3>' + eventName + '</h3>';
                    outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                    outputEvent += '<h4>' + time + '</h4>';

                    if (role == "trener") {
                        coachEvent(eventId);
                    } else if (role == "spiller") {
                        playerEvent(eventId);
                    } else if (role == undefined) {
                        showNearestEvent();
                    }

                    results = i;
                    break;

                } else if (eventDate.getTime() === fourDays.getTime()) {
                    outputEvent += '<i class="material-icons">fitness_center</i>';
                    outputEvent += '<h3>' + eventName + '</h3>';
                    outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                    outputEvent += '<h4>' + time + '</h4>';

                    if (role == "trener") {
                        coachEvent(eventId);
                    } else if (role == "spiller") {
                        playerEvent(eventId);
                    } else if (role == undefined) {
                        showNearestEvent();
                    }

                    results = i;
                    break;

                } else if (eventDate.getTime() === fiveDays.getTime()) {
                    outputEvent += '<i class="material-icons">fitness_center</i>';
                    outputEvent += '<h3>' + eventName + '</h3>';
                    outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                    outputEvent += '<h4>' + time + '</h4>';

                    if (role == "trener") {
                        coachEvent(eventId);
                    } else if (role == "spiller") {
                        playerEvent(eventId);
                    } else if (role == undefined) {
                        showNearestEvent();
                    }

                    results = i;
                    break;

                } else if (eventDate.getTime() === sixDays.getTime()) {
                    outputEvent += '<i class="material-icons">fitness_center</i>';
                    outputEvent += '<h3>' + eventName + '</h3>';
                    outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                    outputEvent += '<h4>' + time + '</h4>';

                    if (role == "trener") {
                        coachEvent(eventId);
                    } else if (role == "spiller") {
                        playerEvent(eventId);
                    } else if (role == undefined) {
                        showNearestEvent();
                    }

                    results = i;
                    break;

                } else if (eventDate.getTime() === sevenDays.getTime()) {
                    outputEvent += '<i class="material-icons">fitness_center</i>';
                    outputEvent += '<h3>' + eventName + '</h3>';
                    outputEvent += '<h2 onclick="redirect()">' + dateMonth + '</h2>';
                    outputEvent += '<h4>' + time + '</h4>';

                    if (role == "trener") {
                        coachEvent(eventId);
                    } else if (role == "spiller") {
                        playerEvent(eventId);
                    } else if (role == undefined) {
                        showNearestEvent();
                    }

                    results = i;
                    break;

                } else {

                    var noEventMessage;
                    var createEvent;
                    if (language == "NO") {

                        noEventMessage = "Det er ingen hendelse den neste uken";
                        createEvent = "Opprett ny hendelse";
                    } else {

                        noEventMessage = "There are no events the upcoming week";
                        createEvent = "Create new event";
                    }

                    if (role == "trener") {

                        outputEvent += '<div id="noEvent">';
                        outputEvent += '<h4>' + noEventMessage + '<h4>';
                        outputEvent += '</div>';

                    } else if (role == "spiller") {

                        outputEvent += '<div id="noEvent">';
                        outputEvent += '<h4>' + noEventMessage + '<h4>';
                        outputEvent += '</div>';

                    } else if (role == undefined) {
                        showNearestEvent();
                    }
                }

            }

            $("#list-nearest-event").html(outputEvent);
            
            if(role == undefined){
                showNearestEvent();
            }else if (role == "trener") {
                var outputC = "";
                outputC += '<div id="createbox">';
                outputC += '<i class="material-icons">add_circle</i>';
                outputC += '<p id="create" class="createbtn" onclick="showCreator()">' + createText + '<p>';
                outputC += '</div>';
            }

            $("#list-create-btn").html(outputC);

        }

    });

}

showNearestEvent();


function coachEvent(eventId) {

    var pointer = {
        __type: 'Pointer',
        className: 'data_' + klubbID + "_Events",
        objectId: eventId
    }

    var eventsAnswers = Parse.Object.extend("data_" + klubbID + "_Events_Answers");
    var Query = new Parse.Query(eventsAnswers);
    Query.equalTo("event", pointer);
    Query.find({

        success: function (objects) {

            var coming = 0;
            var notComing = 0;
            for (var j in objects) {

                var attending = objects[j].get("attending");
                if (attending == true) {
                    coming++;
                } else if (attending == false) {
                    notComing++;
                }

            }
            var answered = coming + notComing;
            var notAnswered = amountOfPlayers - answered;

            if (language == "NO") {
                var comingString = " kommer";
                var notComingString = " kommer ikke";
                var notAnsweredString = " ikke svart";
            } else {
                var comingString = " attending";
                var notComingString = " not attending";
                var notAnsweredString = " not answered";
            }

            var outputAttendance = "";
            outputAttendance += '<div class="attendanceInfo">';
            outputAttendance += '<div class="attendance1" id="checked">';
            outputAttendance += '<img class="badge" src="./src/img/checkedBadge.png">';
            outputAttendance += '<p>' + coming + comingString + '</p>';
            outputAttendance += '</div>';
            outputAttendance += '<div class="attendance1" id="cancel">';
            outputAttendance += '<img class="badge" src="./src/img/cancelBadge.png">';
            outputAttendance += '<p>' + notComing + notComingString + '</p>';
            outputAttendance += '</div>';
            outputAttendance += '<div class="attendance1" id="warning">';
            outputAttendance += '<img class="badge" src="./src/img/warningBadge.png">';
            outputAttendance += '<p>' + notAnswered + notAnsweredString + '</p>';
            outputAttendance += '</div>';
            outputAttendance += '</div>';

            $("#list-event-answers").html(outputAttendance);
        }
    });
}

function playerEvent(eventId) {

    var eventAnswers = Parse.Object.extend("data_" + klubbID + "_Events_Answers");
    var answerQuery = new Parse.Query(eventAnswers);

    var eventPointer = {
        __type: 'Pointer',
        className: 'data_' + klubbID + "_Events",
        objectId: eventId
    }

    answerQuery.equalTo("event", eventPointer);
    answerQuery.find({

        success: function (results) {

            var userArray = new Array();
            for (var e in results) {

                var answerId = results[e].id;
                var answerUser = results[e].get("member").id;
                var answerComment = results[e].get("comment");
                var answerAttending = results[e].get("attending");
                userArray.push(answerUser);

                if (answerUser == member.id) {
                    results = e;
                    break;
                }
            }

            var thisUser = member.id;
            var bool = _.contains(userArray, thisUser);

            if (language == "NO") {
                var comingString = "Kommer";
                var notComingString = "Kommer ikke";
                var writeComment = "Skriv din kommentar her";
                var submit = "Send inn";
                var update = "Oppdater svar";
            } else {
                var comingString = "Attending";
                var notComingString = "Not attending";
                var writeComment = "Write your comment here";
                var submit = "Submit";
                var update = "Update answer";
            }

            var outputAnswer = "";
            outputAnswer += '<div class="attendance" id="' + eventId + '" onclick="coming(id)">';
            outputAnswer += '<img class="badge" src="./src/img/checkedBadge.png">';
            outputAnswer += '<p>' + comingString + '</p>';
            outputAnswer += '<div class="box" id="box1" style="display: none;"></div>';
            outputAnswer += '</div>';
            outputAnswer += '<div class="attendance" id="' + eventId + '" onclick="notComing(id)">';
            outputAnswer += '<img class="badge" src="./src/img/cancelBadge.png">';
            outputAnswer += '<p>' + notComingString + '</p>';
            outputAnswer += '<div class="box" id="box2" style="display: none;"></div>';
            outputAnswer += '</div>';

            if (bool == true) {
                if ((answerComment == undefined) || (answerComment == null)) {
                    outputAnswer += '<textarea rows="1" cols="24" name="text" id="commentSection" placeholder="' + writeComment + '"></textarea>';
                } else {
                    outputAnswer += '<textarea rows="1" cols="24" name="text" id="commentSection" placeholder="' + writeComment + '">' + answerComment + '</textarea>';
                }
                outputAnswer += '<p id="saved"></p>';
                outputAnswer += '<button id="' + answerId + '" name="' + answerId + '" onclick="updateAttend(id, name)">' + update + '</button>';
                $("#list-options").html(outputAnswer);
                if (answerAttending == true) {
                    document.getElementById('box1').style.display = 'block';
                } else if (answerAttending == false) {
                    document.getElementById('box2').style.display = 'block';
                }

            } else {
                outputAnswer += '<textarea rows="1" cols="24" name="text" id="commentSection" placeholder="' + writeComment + '"></textarea>';
                outputAnswer += '<button id="' + eventId + '" onclick="submitAttend(id)">' + submit + '</button>';
                $("#list-options").html(outputAnswer);
            }

        }

    });
}

var attending;

function coming() {
    attending = true;

    document.getElementById('box1').style.display = 'block';
    document.getElementById('box2').style.display = 'none';

    $("#saved").html(notSavedText);
}

function notComing(eventId) {
    attending = false;

    document.getElementById('box1').style.display = 'none';
    document.getElementById('box2').style.display = 'block';

    $("#saved").html(notSavedText);
}

$(document).delegate('#commentSection', 'change', function () {
    $("#saved").html(notSavedText);
});

function updateAttend(eventId, answerId) {

    var comment = $('textarea#commentSection').val();

    var usersAnswer = Parse.Object.extend("data_" + klubbID + "_Events_Answers");
    var queryAnswer = new Parse.Query(usersAnswer);
    queryAnswer.equalTo("objectId", answerId);
    queryAnswer.first({
        success: function (object) {

            object.set("comment", comment);
            object.set("attending", attending);
            object.save();

            $("#saved").html(savedText);

        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

}

function submitAttend(eventId) {

    if (attending == undefined) {
        if (language == "NO") {
            var alertMessage = "Register oppmøte før du sender inn";
        } else {
            var alertMessage = "Register attendance before answering";
        }
        alert(alertMessage);
    } else {

        var comment = $('textarea#commentSection').val();

        var eventPointer = {
            __type: 'Pointer',
            className: 'data_' + klubbID + "_Events",
            objectId: eventId
        }

        if (member == undefined) {
            getMember();
            showNearestEvent();
        }


        var eventsAnswers = Parse.Object.extend("data_" + klubbID + "_Events_Answers");
        var newAttendance = new eventsAnswers();
        newAttendance.set("attending", attending);
        newAttendance.set("comment", comment);
        newAttendance.set("member", member);
        newAttendance.set("event", eventPointer);
        newAttendance.save(null, {
            success: function (newAttendance) {
                $("#saved").html(savedText);
            },
            error: function (newPost, error) {
                console.log("Error:" + error.message);
                handleParseError();
            }
        });

    }
}

var running = false;

function showCreator() {

    if (document.getElementById("createEvent")) {
        if (running != false) {

        } else {

            var finishedCreating;

            if (language == "NO") {
                finishedCreating = "Ny hendelse opprettet!";
            } else {
                finishedCreating = "New event created!";
            }

            var eventName = document.getElementById("eventName").value;

            var eventType;

            if (document.getElementById('training').checked) {
                eventType = "training";
            } else if (document.getElementById('other').checked) {
                eventType = "custom";
            }

            var daysArray = new Array();
            var timeArray = new Array();
            if (document.getElementById('check').checked) {

                var days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
                for (var k in days) {
                    if ($('#' + days[k]).is(":checked")) {
                        daysArray.push(true);

                        var timepicker = "#time-pick-" + days[k];

                        var dayTimepicker = $(timepicker).wickedpicker();
                        var eventTimes = dayTimepicker.wickedpicker('time');

                        var hours = eventTimes.substring(0, 2);
                        var minutes = eventTimes.substring(5, 7);

                        var ampm = eventTimes.substring(7, 9);

                        if (ampm == "PM") {
                            hours = parseInt(hours);
                            hours = hours + 12;
                        }

                        minutes = parseInt(minutes);
                        var timeFormat = hours + "." + minutes;

                        timeArray.push(timeFormat);

                    } else {
                        daysArray.push(false);
                        timeArray.push("");
                    }
                }

                var repeatingEvent = Parse.Object.extend("data_" + klubbID + "_RepeatingEvents");
                var queryEvent = new Parse.Query(repeatingEvent);

                queryEvent.find({
                    success: function (results) {
                        if (results.length == 0) {
                            var createEvent = new repeatingEvent();
                            running = true;
                            createEvent.set("eventID", "training");
                            createEvent.set("weekdays", daysArray);
                            createEvent.set("startTimes", timeArray);

                            if (document.getElementById('check2').checked) {
                                createEvent.set("sendPush", true);
                            } else {
                                createEvent.set("sendPush", false);
                            }
                            createEvent.save({
                                success: function (results) {
                                    var outputCreator = "";

                                    outputCreator += '<div id="finCreate">';
                                    outputCreator += '<h4>' + finishedCreating + '</h4>';
                                    outputCreator += '</div>';

                                    $("#list-creator").html(outputCreator);
                                    running = false;
                                    setTimeout(
                                        function () {

                                            var outputCreator = "";

                                            $("#list-creator").html(outputCreator);

                                            showNearestEvent();
                                        }, 1500);
                                }
                            });
                        } else {
                            var updateEvent = results[0];
                            running = true;
                            updateEvent.set("eventID", "training");

                            updateEvent.set("weekdays", daysArray);
                            updateEvent.set("startTimes", timeArray);

                            if (document.getElementById('check2').checked) {
                                updateEvent.set("sendPush", true);
                            } else {
                                updateEvent.set("sendPush", false);
                            }
                            updateEvent.save({
                                success: function (results) {
                                    var outputCreator = "";

                                    outputCreator += '<div id="finCreate">';
                                    outputCreator += '<h4>' + finishedCreating + '</h4>';
                                    outputCreator += '</div>';

                                    $("#list-creator").html(outputCreator);
                                    
                                    running = false;

                                    setTimeout(
                                        function () {

                                            var outputCreator = "";

                                            $("#list-creator").html(outputCreator);

                                            showNearestEvent();
                                        }, 1500);
                                }
                            });
                        }
                    }
                });

            } else {
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

                    

                    var newEvent = Parse.Object.extend("data_" + klubbID + "_Events")
                    var createEvent = new newEvent();
                    running = true;
                    createEvent.set("date", eventDate);
                    createEvent.set("eventID", eventType);
                    createEvent.set("name", eventName);
                    createEvent.save({
                        success: function () {
                            var outputCreator = "";

                            outputCreator += '<div id="finCreate">';
                            outputCreator += '<h4>' + finishedCreating + '</h4>';
                            outputCreator += '</div>';

                            $("#list-creator").html(outputCreator);
                            
                            running = false;
                            
                            setTimeout(
                                function () {

                                    var outputCreator = "";

                                    $("#list-creator").html(outputCreator);

                                    showNearestEvent();
                                }, 1500);
                        }
                    });
                    
                }
            }


        }
    } else {

        var outputCreator = "";

        var training;
        var other;
        var cancel;
        var once;
        var repeated;
        var date;
        var time;
        var eventName;

        var mon;
        var tue;
        var wed;
        var thu;
        var fri;
        var sat;
        var sun;

        var sendPush;
        var notSendPush;

        if (language == "NO") {
            training = "Trening";
            other = "Annet";
            cancel = "Avbryt";
            once = "Enkelthendelse";
            repeated = "Gjentagende";
            date = "Dato";
            time = "Klokkeslett";
            eventName = "Skriv inn navn på hendelsen";

            mon = "Man";
            tue = "Tir";
            wed = "Ons";
            thu = "Tor";
            fri = "Fre";
            sat = "Lør";
            sun = "Søn";

            sendPush = "Send";
            notSendPush = "Ikke send";
        } else {
            training = "Practice";
            other = "Other";
            cancel = "Cancel";
            once = "One time event";
            repeated = "Repeated event";
            date = "Date";
            time = "Time";
            eventName = "Write the name of the event";

            mon = "Mon";
            tue = "Tue";
            wed = "Wed";
            thu = "Thu";
            fri = "Fri";
            sat = "Sat";
            sun = "Sun";

            sendPush = "Send";
            notSendPush = "Do not send";
        }

        outputCreator += '<div id="createEvent">';
        outputCreator += '<button onclick="cancelEvent()">' + cancel + '</button>';
        outputCreator += '<textarea id="eventName" placeholder="' + eventName + '"></textarea>';
        outputCreator += '<form id="eventType">';
        outputCreator += '<input id="training" type="radio" name="gender" value="male" checked>' + training + '<br>';
        outputCreator += '<input id="other" type="radio" name="gender" value="female">' + other + '<br>';
        outputCreator += '</form>';
        outputCreator += '<div class="date-switch" id="date-switch">';
        outputCreator += '<h3 id="single">' + once + '</h3>';
        outputCreator += '<label class="switch">';
        outputCreator += '<input onclick="chooseTime()" id="check" autocomplete="off" type="checkbox">';
        outputCreator += '<div class="slider round"></div>';
        outputCreator += '</label>';
        outputCreator += '<h3 id="plural">' + repeated + '</h3>';
        outputCreator += '</div>';
        outputCreator += '<div id="once-date">';
        outputCreator += '<p id="date-pick">' + date + ': <input type="text" autocomplete="off" id="form-date" class="datepicker"></p>';
        outputCreator += '<p id="time-pick-once">' + time + ': <input type="text" autocomplete="off" id="form-time" class="timepicker"></p>';
        outputCreator += '</div>';
        outputCreator += '<div id="days" style="display: none;">';
        outputCreator += '<p class="day">' + mon + '<input class="day-checkbox" id="mon" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-mon" class="timepicker">';
        outputCreator += '<p class="day">' + tue + '<input class="day-checkbox" id="tue" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-tue" class="timepicker">';
        outputCreator += '<p class="day">' + wed + '<input class="day-checkbox" id="wed" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-wed" class="timepicker">';
        outputCreator += '<p class="day">' + thu + '<input class="day-checkbox" id="thu" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-thu" class="timepicker">';
        outputCreator += '<p class="day">' + fri + '<input class="day-checkbox" id="fri" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-fri" class="timepicker">';
        outputCreator += '<p class="day">' + sat + '<input class="day-checkbox" id="sat" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-sat" class="timepicker">';
        outputCreator += '<p class="day">' + sun + '<input class="day-checkbox" id="sun" type="checkbox"></p>';
        outputCreator += '<input type="text" autocomplete="off" id="time-pick-sun" class="timepicker">';

        outputCreator += '<h2 id="pushText">Push:</h2>';
        outputCreator += '<div class="date-switch" id="push-switch">';
        outputCreator += '<h3 id="single">' + notSendPush + '</h3>';
        outputCreator += '<label class="switch">';
        outputCreator += '<input onclick="chooseTime()" id="check2" autocomplete="off" type="checkbox">';
        outputCreator += '<div class="slider round"></div>';
        outputCreator += '</label>';
        outputCreator += '<h3 id="plural">' + sendPush + '</h3>';
        outputCreator += '</div>';

        outputCreator += '</div>';
        outputCreator += '</div>';

        $("#list-creator").html(outputCreator);

        $(function () {
            $(".datepicker").datepicker();
        });

        $('.timepicker').wickedpicker({

            twentyFour: true,
            upArrow: 'wickedpicker__controls__control-up',
            downArrow: 'wickedpicker__controls__control-down',
            close: 'wickedpicker__close',
            hoverState: 'hover-state',
            title: 'Tid'
        });


    }
}


function cancelEvent() {
    var outputCreator = "";

    $("#list-creator").html(outputCreator);

}

function chooseTime() {

    if (document.getElementById('check').checked) {
        document.getElementById('days').style.display = 'block';
        document.getElementById('createbox').style = 'margin-top: 80px';
        document.getElementById('date-pick').style.display = 'none';
        document.getElementById('time-pick-once').style.display = 'none';
        
        document.getElementById('training').checked = true;
        document.getElementById('other').disabled = true;
    } else {

        document.getElementById('days').style.display = 'none';
        document.getElementById('date-pick').style.display = 'block';
        document.getElementById('time-pick-once').style.display = 'block';
        document.getElementById('createbox').style = 'margin-top: 30px';
        
        document.getElementById('other').disabled = false;
        

    }
}
