Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse'; 

var members = Parse.Object.extend("data_" + klubbID + "_Members");
var queryMemb = new Parse.Query(members);

var amountOfPlayers = 0;
var member;
    queryMemb.find({
       success: function(membs){
           
           for(var k in membs){
               
               var userRole = membs[k].get("role");
               
               var userId = membs[k].get("user").id;
               var currentUser = Parse.User.current().id;
    
               if(userId == currentUser){
                   member = membs[k];
               }
               
               if(userRole == "spiller"){
                   amountOfPlayers++;
               }
               
           }
       } 
    });

function showNearestEvent(){
    var event = Parse.Object.extend("data_" + klubbID + "_Events");
    var query = new Parse.Query(event);

    query.ascending("date");
    query.find({
        success: function(results){
                    for(var i=0; i < results.length; i++){

                        var eventId = results[i].id;

                        var eventDate = results[i].get("date");
                        
                        var monthNamesNO = ["januar", "februar", "mars", "april", "mai", "juni",
                          "juli", "august", "september", "oktober", "november", "desember"];
                        
                        var monthNamesEN = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];
                        
                        if(language == "NO"){
                            var monthNames = monthNamesNO;
                        }else{
                            var monthNames = monthNamesEN;
                        }
                        
                        var monthInt = eventDate.getMonth();
                        var month = monthNames[monthInt];
                        
                        var date = eventDate.getDate();
                        
                        if(language == "NO"){
                            var dateMonth = date + ". " + month;
                        }else{
                            var dateMonth = date + "th " + month;
                        }
                        
                        var hours = eventDate.getHours();
                        var minutes = eventDate.getMinutes();
                        if(minutes == 0){
                            minutes = '00';
                        }
                        var time = hours + ":" + minutes;
                        
                        eventDate.setHours(0,0,0,0);

                        var dato = eventDate.toString();
                        var datoen = dato.substring(4, 15);

                        var today = new Date();
                        today.setHours(0,0,0,0);

                        var tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() +1);
                        tomorrow.setHours(0,0,0,0);
                        
                        var twoDays = new Date();
                        twoDays.setDate(twoDays.getDate() +2);
                        twoDays.setHours(0,0,0,0);
                        
                        var threeDays = new Date();
                        threeDays.setDate(threeDays.getDate() +3);
                        threeDays.setHours(0,0,0,0);
                        
                        var fourDays = new Date();
                        fourDays.setDate(fourDays.getDate() +4);
                        fourDays.setHours(0,0,0,0);

                        var eventType = results[i].get("eventID");

                        var eventName;

                        if(eventType == "training"){
                                eventName = "Trening";
                            }else if(eventType == "competition"){
                                eventName = "Konkurranse";
                            }

                        var outputEvent = "";

                        if(eventDate.getTime() === today.getTime()){
                                outputEvent += '<i class="material-icons">fitness_center</i>';
                                outputEvent += '<h3>' + eventName + '</h3>';
                                outputEvent += '<h2>' + dateMonth + '</h2>';
                                outputEvent += '<h4>' + time + '</h4>';

                                if(role == "trener"){
                                    coachEvent(eventId);
                                }else if(role == "spiller"){
                                    playerEvent(eventId);
                                }else if(role == undefined){
                                    showNearestEvent();
                                }

                                results = i;
                                break;

                        }else if(eventDate.getTime() === tomorrow.getTime()){
                                outputEvent += '<i class="material-icons">fitness_center</i>';
                                outputEvent += '<h3>' + eventName + '</h3>';
                                outputEvent += '<h2>' + dateMonth + '</h2>';
                                outputEvent += '<h4>' + time + '</h4>';

                                if(role == "trener"){
                                    coachEvent(eventId);
                                }else if(role == "spiller"){
                                    playerEvent(eventId);
                                }else if(role == undefined){
                                    showNearestEvent();
                                }

                                results = i;
                                break;

                        }else if(eventDate.getTime() === twoDays.getTime()){
                                outputEvent += '<i class="material-icons">fitness_center</i>';
                                outputEvent += '<h3>' + eventName + '</h3>';
                                outputEvent += '<h2>' + dateMonth + '</h2>';
                                outputEvent += '<h4>' + time + '</h4>';

                                if(role == "trener"){
                                    coachEvent(eventId);
                                }else if(role == "spiller"){
                                    playerEvent(eventId);
                                }else if(role == undefined){
                                    showNearestEvent();
                                }

                                results = i;
                                break;

                        }else if(eventDate.getTime() === threeDays.getTime()){
                                outputEvent += '<i class="material-icons">fitness_center</i>';
                                outputEvent += '<h3>' + eventName + '</h3>';
                                outputEvent += '<h2>' + dateMonth + '</h2>';
                                outputEvent += '<h4>' + time + '</h4>';

                                if(role == "trener"){
                                    coachEvent(eventId);
                                }else if(role == "spiller"){
                                    playerEvent(eventId);
                                }else if(role == undefined){
                                    showNearestEvent();
                                }

                                results = i;
                                break;

                        }else if(eventDate.getTime() === fourDays.getTime()){
                                outputEvent += '<i class="material-icons">fitness_center</i>';
                                outputEvent += '<h3>' + eventName + '</h3>';
                                outputEvent += '<h2>' + dateMonth + '</h2>';
                                outputEvent += '<h4>' + time + '</h4>';

                                if(role == "trener"){
                                    coachEvent(eventId);
                                }else if(role == "spiller"){
                                    playerEvent(eventId);
                                }else if(role == undefined){
                                    showNearestEvent();
                                }

                                results = i;
                                break;

                        }

                    }

                $("#list-nearest-event").html(outputEvent);

        }

    });

}

showNearestEvent();


function coachEvent(eventId){
    
    var pointer = {
      __type: 'Pointer',
      className: 'data_' + klubbID + "_Events",
      objectId: eventId
    }

    var eventsAnswers = Parse.Object.extend("data_" + klubbID + "_Events_Answers");
    var Query = new Parse.Query(eventsAnswers);
    Query.equalTo("event", pointer);
    Query.find({
       
        success: function(objects){
            
            var coming = 0;
            var notComing = 0;
            for(var j in objects){
                
                var attending = objects[j].get("attending");
                if(attending == true){
                    coming++;
                }else if(attending == false){
                    notComing++;
                }
                
            }
            var answered = coming + notComing;
            var notAnswered = amountOfPlayers - answered;
            
            if(language == "NO"){
                var comingString = " kommer";
                var notComingString = " kommer ikke";
                var notAnsweredString = " ikke svart";
            }else{
                var comingString = " attending";
                var notComingString = " not attending";
                var notAnsweredString = " not answered";
            }
            
            var outputAttendance = "";
            outputAttendance += '<div class="attendanceInfo">';
            outputAttendance += '<div class="attendance1" id="checked">';
            outputAttendance += '<img class="badge" src="../src/img/checkedBadge.png">';
            outputAttendance += '<p>' + coming + comingString + '</p>';
            outputAttendance += '</div>';
            outputAttendance += '<div class="attendance1" id="cancel">';
            outputAttendance += '<img class="badge" src="../src/img/cancelBadge.png">';
            outputAttendance += '<p>' + notComing + notComingString + '</p>';
            outputAttendance += '</div>';
            outputAttendance += '<div class="attendance1" id="warning">';
            outputAttendance += '<img class="badge" src="../src/img/warningBadge.png">';
            outputAttendance += '<p>' + notAnswered + notAnsweredString + '</p>';
            outputAttendance += '</div>';
            outputAttendance += '</div>';
            
            $("#list-nearest-event").append(outputAttendance);
        }
    });
}

function playerEvent(eventId){
    
        var eventAnswers = Parse.Object.extend("data_" + klubbID + "_Events_Answers");
        var answerQuery = new Parse.Query(eventAnswers);
    
        var eventPointer = {
          __type: 'Pointer',
          className: 'data_' + klubbID + "_Events",
          objectId: eventId
        }
        
        answerQuery.equalTo("event", eventPointer);
        answerQuery.find({
            
            success: function(results){
                
                var userArray = new Array();
                for(var e in results){
                    
                    var answerId = results[e].id;
                    var answerUser = results[e].get("member").id;
                    var answerComment = results[e].get("comment");
                    var answerAttending = results[e].get("attending");
                    userArray.push(answerUser);
                    
                    if(answerUser == member.id){
                        results = e;
                        break;
                    }
                }
                
                var thisUser = member.id;
                var bool = _.contains(userArray, thisUser);
                
                if(language == "NO"){
                    var comingString = "Kommer";
                    var notComingString = "Kommer ikke";
                    var writeComment = "Skriv din kommentar her";
                    var submit = "Send inn";
                    var update = "Oppdater svar";
                }else{
                    var comingString = "Attending";
                    var notComingString = "Not attending";
                    var writeComment = "Write your comment here";
                    var submit = "Submit";
                    var update = "Update answer";
                }

                var outputAnswer = "";
                outputAnswer += '<div class="attendance" id="' + eventId + '" onclick="coming(id)">';
                outputAnswer += '<img class="badge" src="../src/img/checkedBadge.png">';
                outputAnswer += '<p>' + comingString + '</p>';
                outputAnswer += '<div class="box" id="box1" style="display: none;"></div>';
                outputAnswer += '</div>';
                outputAnswer += '<div class="attendance" id="' + eventId + '" onclick="notComing(id)">';
                outputAnswer += '<img class="badge" src="../src/img/cancelBadge.png">';
                outputAnswer += '<p>' + notComingString + '</p>';
                outputAnswer += '<div class="box" id="box2" style="display: none;"></div>';
                outputAnswer += '</div>';
                
                if(bool == true){
                        outputAnswer += '<textarea rows="1" cols="24" name="text" id="commentSection" placeholder="' + writeComment + '">' + answerComment + '</textarea>';
                        outputAnswer += '<button id="' + answerId + '" name="' + answerId + '" onclick="updateAttend(id, name)">' + update + '</button>';
                    $("#list-options").html(outputAnswer);
                    if(answerAttending == true){
                        document.getElementById('box1').style.display = 'block';
                    }else if(answerAttending == false){
                        document.getElementById('box2').style.display = 'block';
                    }

                    }else{
                        outputAnswer += '<textarea rows="1" cols="24" name="text" id="commentSection" placeholder="' + writeComment + '"></textarea>';
                        outputAnswer += '<button id="' + eventId + '" onclick="submitAttend(id)">' + submit + '</button>';
                        $("#list-options").html(outputAnswer);
                    }
                    
            }
            
        });
}

var attending;

function coming(){
    attending = true;
    
    document.getElementById('box1').style.display = 'block';
    document.getElementById('box2').style.display = 'none';
}

function notComing(eventId){
     attending = false;
    
    document.getElementById('box1').style.display = 'none';
    document.getElementById('box2').style.display = 'block';
}


function updateAttend(eventId, answerId){

    var comment = $('textarea#commentSection').val();
    
    var usersAnswer = Parse.Object.extend("data_" + klubbID + "_Events_Answers");
    var queryAnswer = new Parse.Query(usersAnswer);
    queryAnswer.equalTo("objectId", answerId);
    queryAnswer.first({
      success: function(object) {

        object.set("comment", comment);
        object.set("attending", attending);
        object.save();


      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
    
}

function submitAttend(eventId){
    
    if(attending == undefined){
        if(language == "NO"){
            var alertMessage = "Register oppmøte før du sender inn";
        }else{
            var alertMessage = "Register attendance before answering";
        }
        alert(alertMessage);
    }else{
        
        var comment = $('textarea#commentSection').val();

        var eventPointer = {
          __type: 'Pointer',
          className: 'data_' + klubbID + "_Events",
          objectId: eventId
        }
        
        if(member == undefined){
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
                        
                    }
                    , error: function (newPost, error) {
                        console.log("Error:" + error.message);
                        handleParseError();
                    }
                });
                
    }
}