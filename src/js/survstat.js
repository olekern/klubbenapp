Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';


            var SurveyAnswer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
            var Surveys = Parse.Object.extend("data_" + klubbID + "_Surveys");
            
            var oldSurv = new Array();
            var survName = new Array();
            var survQuestions = new Array();
            var survType = new Array();
   	    var survId = new Array();

            function getAnswers() {
                var Query = new Parse.Query(Surveys);
                Query.descending("day");
                Query.include("survey");

                var monthNames = [
                    "Jan", "Feb", "Mar",
                    "Apr", "May", "Jun", "Jul",
                    "Aug", "Sep", "Oct",
                    "Nov", "Dec"
                ];

                var daysOfTheWeek = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

                var date = new Date();
                var day = date.getDate();
                var monthIndex = date.getMonth();
                var daysIndex = date.getMonth();
                var year = date.getFullYear();

                if (day < 10) {
                    var idag = monthNames[monthIndex] + " " + "0" + day + " " + year;
                } else {
                    var idag = monthNames[monthIndex] + " " + day + " " + year;
                }
                
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(59);
                

                Query.find({
                        success: function(objects) {
                                
                                var j = 0;
                                var id = new Array();
                                var output = "";
                                var outputSurv = "";
                            for (var i = 0; i < objects.length; i++) {
                                
                                var surveyDate = objects[i].get("day");
                                
                                if(surveyDate <= date){ 
                                    
                                    var day2 = surveyDate.getDate();
                                    var monthIndex2 = surveyDate.getMonth();
                                    var daysIndex2 = surveyDate.getMonth();
                                    var year2 = surveyDate.getFullYear();

                                    if (day < 10) {
                                        var dateOfSurv = monthNames[monthIndex2] + " " + "0" + day2 + " " + year2;
                                    } else {
                                        var dateOfSurv = monthNames[monthIndex2] + " " + day2 + " " + year2;
                                    }

                                    surveyDate.setHours(23);
                                    surveyDate.setMinutes(59);
                                    surveyDate.setSeconds(59);
                                    
                                    var showDate = "";
                                    if(idag == dateOfSurv){
                                        showDate = "I dag";
                                    }else{
                                        showDate = dateOfSurv;
                                    }

                                    oldSurv[j] = objects[i];
                                    survId[j] = objects[i].id;
                                    survName[j] = objects[i].get("survey").get("name");
                                    survQuestions[j] = objects[i].get("survey").get("questions");
                                    survType[j] = objects[i].get("survey").get("questionTypeInfo");
                                    var h = 0;
                                    
                                    outputSurv += '<div id="surv">';
                                    outputSurv += '<h3 id="' + j +'" onclick="chooseSurv(id);">' + survName[j] + '</h3>';
                                    outputSurv += '<h4>' + showDate +'</h4>';
                                    outputSurv += '</div>';
                                    
                                    
                                    $("#list-surv").html(outputSurv);
                                    
                                    j++;
                                }
                                
                            }
                            
                        },
                        error: function(error) {
                            console.log("Query error:" + error.message);
                        }

                    });


            }

            
            function chooseSurv(number, name){
                
                var j = number;
                var question = new Array();
                question = survQuestions[j];
                
                var questionType = new Array();
                questionType = survType[j];
                
                var outputans = "";
                var outputnone = "";
                
                $("#draw-charts").html(outputnone);
                
                var SurveyAnswer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
                var query = new Parse.Query(SurveyAnswer);
                query.descending("createdAt");
                query.include("author");
                query.include("survey");
                query.equalTo("survey", oldSurv[j]);
                query.find({
                    success: function(results) {
                        
                            google.charts.load('current', {
                              callback: function () {
                                for(var u = 0; u<question.length; u++){
                                    if(questionType[u]/1){
                                        
                                        var questions = question[u];
                                        
                                  var container = document.getElementById('draw-charts').appendChild(document.createElement('div'));

                                  var data = new google.visualization.DataTable();
                                data.addColumn('string');
                                data.addColumn('number');
                                
                                    for(var k in results){
                                        
                                        var answer = results[k].get("data")[u];
                                        var answerNumber = Number(answer);
                                        var author = results[k].get("author");
                                        var name = author.get("name");
                                        
                                        data.addRows([
                                          [name, answerNumber]
                                        ]);
                                    }

                                var options = {
                                    title: questions,
                                    width:700,
                                    colors: ['#3f88c5'],
                                };
                                  var chart = new google.visualization.BarChart(container);
                                  chart.draw(data, options);
                                }
                                }
                              },
                              packages: ['corechart']
                            });
                                    
                            for(var u = 0; u<question.length; u++){
                                
                                var questions = question[u];
                                outputans += '<div class="ansbox">';
                                if(questionType[u]/1){
                                }else if((questionType[u] == "NO") || (questionType[u] == "YES")){
                                    
                                    outputans += '<h2>' + questions + '</h2>';
                                    
                                   for(var k in results){ 
                                    var answer = results[k].get("data")[u];
                                    var author = results[k].get("author");
                                    var name = author.get("name");

				    var userSurvId = results[k].id; 

                                    outputans += '<h4 id="' + userSurvId + '" onclick="playerSurv(id)">' + name + '</h4>';
                                    if(answer[0] == 'Y'){
                                    var yes = answer.split("±").pop();
                                    outputans += '<p>Ja</p>';
                                    outputans += '<p>' + yes + '</p>';
                                    }else{
                                    var no = answer.split("±").pop();
                                    outputans += '<p>Nei</p>';
                                    outputans += '<p>' + no + '</p>';
                                    }
                                    outputans += '</div>';   
                                }
                                }else{
                                
                                outputans += '<h2>' + questions + '</h2>';
                                
                                for(var k in results){
                                    
                                    var answer = results[k].get("data")[u];
                                    var author = results[k].get("author");
                                    var name = author.get("name");

				    var userSurvId = results[k].id; 

                                    outputans += '<h4 id="' + userSurvId + '" onclick="playerSurv(id)">' + name + '</h4>';
                                    outputans += '<p>' + answer + '</p>';
                                    outputans += '</div>';   
                                }
                                
                            }
                        
                            $("#list-answ").html(outputans);
                        
                        }
                    }
                        
                    });
                           
                           }

            getAnswers();

	function playerSurv(surveyId){
                                    
                        var SurveyAnswer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
                        var query = new Parse.Query(SurveyAnswer);
                        query.descending("createdAt");
                        query.include("author");
			query.include("survey");
                        query.equalTo("objectId", surveyId);
                        query.find({
                                    success: function(results) {

				        var output = "";
					output += '<div id="survey-box">';

					document.getElementById('simpleSurv').style.display = 'block';
                                                
                                                for (var k in results) {

                                                    var surveyName = results[k].get("survey").get("survey").get("name");
                                                    var answerID = results[k].id;
                                                    var question = results[k].get("survey").get("survey").get("questions");
                                                    var surveyData = results[k].get("data");
                                                    var dateAnswer = results[k].get("createdAt");
                                                    var dato = dateAnswer.toString();
                                                    var datoen = dato.substring(4, 15);
                                                    
                                                    var author = results[k].get("author");
                                                    var name = author.get("name");
						    var pB = "";
                        			    var userPB = "";
                       				    if (author.get("profileImage_small")) {
                           			    var bilde = author.get("profileImage_small");
                           			    var url1 = bilde.url();
                            		       	    pB = '<img class="pb1" src="' + url1 + '">';
                        				}
                      				    else {
                          			    userPB = '<img class="pb1" src="../img/User_Small.png">';
                       					 }
                                                    
                                                        output += "<div id=\"survey-player\">";
							output += "<h1>" + surveyName + "</h1>";
							output += "<p>" + datoen + "</p>";
							output += '<div id="profileimg">';
							output += pB;
							output += userPB;
                                                        output += "<h2>" + name + "</h2>";
							output += '</div>';
                                                        
                                                    
                                                    for (var j = 0; j < surveyData.length; j++){
                                                        var questions = question[j];
                                                        var answer = surveyData[j];

							  output += "<h3>" + questions + "</h3>";

							    if(answer[0] == 'Y'){
                                    			    var yes = answer.split("±").pop();
                                    			    output += '<p>Ja</p>';
                                    			    output += '<p>' + yes + '</p>';
                                   			      }else{
                                    		       	    var no = answer.split("±").pop();
                                   			    output += '<p>Nei</p>';
                                   			    output += '<p>' + no + '</p>';
                                   			 }
                                                        
                                                    }
                                                    
                                                    var feedback = results[k].get("feedback");
                                                    
                                                    if(feedback != undefined){
						    output += '<div id="coach-feedback">';
                                                    output += "<h4>Tilbakemelding fra trener</h4>";
						    output += '<i class="material-icons" onclick="show()">edit</i>';
                                                    output += "<p>" + feedback + "</p>";
					            output += '</div>';
						    output += '<div id="change-feedback" style="display: none;">';
						    output += '<textarea  id="feedbackText" placeholder="Skriv en tilbakemelding">' + feedback + '</textarea>';
						    output += '<button type="button" name="' + surveyId +'" onclick="submitFeedback(name)">Publiser</button>';
						    output += '<p onclick="hide()">Avbryt</p>';
						    output += '</div>';
                                                    
                                                    }else{
                                                    output += '<textarea rows="2" cols="30 name="text" id="feedbackText" placeholder="Skriv en tilbakemelding"></textarea>';
                                                    output += '<button type="button" name="' + surveyId +'" onclick="submitFeedback(name)">Publiser</button>';
                                                    }
                                                    output += "</div>";
                                                
                                                }
                                                

					output += '</div>';
                               		$("#simpleSurv").html(output);

					}, error: function(error) {
                                        console.log("Query error:" + error.message);
                                    }
                                            
                                    });
                                  

			}

 function submitFeedback(answerID) {

                var feedback = document.getElementById('feedbackText').value;
                console.log(feedback);
                console.log(answerID);
                
                
                        var answer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
                        var Query = new Parse.Query(answer);
			Query.equalTo("objectId", answerID);
                          Query.find({
                                success: function(objects) {
                                    for (var j in objects) {
                                            objects[j].set("feedback", feedback);
                                            objects[j].save({
                                                       success: function() {
                                                            playerSurv(answerID);
                                                        }
                                                    });
                                            

                                        }

                                    },
                                    error: function(error) {
                                        console.log("Query error:" + error.message);
                                    }
                                });

				}


 function show() {
                if (document.getElementById('change-feedback').style.display == 'none') {
                    document.getElementById('change-feedback').style.display = 'block';
		    document.getElementById('coach-feedback').style.display = 'none';
                }
                return false;
            }

            function hide() {
                if (document.getElementById('change-feedback').style.display == 'block') {
                    document.getElementById('change-feedback').style.display = 'none';
		    document.getElementById('coach-feedback').style.display = 'block';
                }
                return false;
            }

$(document).click(function(event) { 
    if(!$(event.target).closest('#survey-box').length) {
        if($('#survey-box').is(":visible")) {
            var output = "";

            $("#simpleSurv").html(output);

		document.getElementById('simpleSurv').style.display = 'none';
        }
    }        
});
