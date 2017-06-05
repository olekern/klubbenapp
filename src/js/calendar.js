Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';  

$(document).ready(function() {

	var eventsArray = new Array();

	var reports = Parse.Object.extend("data_" + klubbID + "_Surveys");
	var query = new Parse.Query(reports);
	query.descending("createdAt");
	query.include("survey");
	query.find({
		success: function(results){
			for(var i in results){
				var surveyId = results[i].id;
				var surveyDate = results[i].get("day");
				var surveyName = results[i].get("survey").get("name");

				var activity = {date: surveyDate, title: surveyName, id: surveyId};
				eventsArray.push(activity);
			}
			createCalendar();
		}, error: function(error){
			console.log(error);
		}
	});

    // page is now ready, initialize the calendar...
	
	function createCalendar(){	

    $('#calendar').fullCalendar({
        // put your options and callbacks here
	    height: 600,
	    header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay,listWeek'
		},
	    events: eventsArray,
	    eventClick: function(calEvent, jsEvent, view) {

		var surveyId = calEvent.id;
		var surveyTitle = calEvent.title;
		localStorage.setItem("surveyId", surveyId);
		location.href = "evalueringT.html";

    }
    })
	}

});



function chooseSurv(surveyId, surveyTitle){
                console.log(surveyTitle);
	//	document.getElementById('simpleSurv').style.display = 'block';
                var outputans = "";
                var outputnone = "";
		
		var out = "";
		out += '<h1>' + surveyTitle + '</h1>'; 
		$("#listing").html(out);
                
                $("#draw-charts").html(outputnone);
                
                var SurveyAnswer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
                var query = new Parse.Query(SurveyAnswer);
                query.descending("createdAt");
                query.include("author");
                query.include("survey");
                query.equalTo("survey", surveyId);
                query.find({
                    success: function(results) {
                        console.log("asdfasdf");
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
$(document).click(function(event) { 
    if(!$(event.target).closest('#survey-box').length) {
        if($('#survey-box').is(":visible")) {
            var output = "";

            $("#simpleSurv").html(output);

		document.getElementById('simpleSurv').style.display = 'none';
        }
    }        
})
