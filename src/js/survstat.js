//Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI");
             //Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';
            Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
            
            var klubbID = Parse.User.current().get("team").id;

            var SurveyAnswer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
            var Surveys = Parse.Object.extend("data_" + klubbID + "_Surveys");
            
            var oldSurv = new Array();
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
                
                console.log(idag);

                Query.find({
                        success: function(objects) {
                                
                                var j = 0;
                                var survId = new Array();
                                var navn = new Array();
                                var id = new Array();
                                var output = "";
                                var outputSurv = "";
                            for (var i = 0; i < objects.length; i++) {
                                
                                var surveyDate = objects[i].get("day");

                                if(surveyDate <= date){
                                    oldSurv[j] = objects[i];
                                    survId[j] = objects[i].id;
                                    navn[j] = objects[i].get("survey").get("name");
                                    var h = 0;
                                    
                                    outputSurv += '<div id="surv">';
                                    outputSurv += '<h3 id="' + survId[j] +'" onclick="chooseSurv(id);">' + navn[j] + '</h3>';
                                    outputSurv += '</div>';
                                    
                                    
                                    var SurveyAnswer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
                                    var query = new Parse.Query(SurveyAnswer);
                                    query.descending("createdAt");
                                    query.include("author");
                                    query.include("survey");
                                    query.equalTo("survey", objects[i]);
                                    query.find({
                                            success: function(results) {
                                                
                                                var username = new Array();
                                                var author = new Array();
                                                
                                                //console.log(objects[i]);
                                                
                                                for (var k in results) {
                                                    var question = results[k].get("survey").get("survey").get("questions");
                                                    var questiontype = results[k].get("survey").get("survey").get("questionTypes");
                                                    var value = results[k].get("data");
                                                    var length = question.length;
                                                    //console.log(results[k]);
                                                    
                                                    /*
                                                    for(var l = 0; l<length; l++){
                                                        
                                                        if(value[l]/1){
                                                            console.log("Tall er gøy");
                                                        }else{
                                                            
                                                        }
                                                        
                                                        console.log(question[l]);
                                                        console.log(questiontype[l]);
                                                        
                                                    }
                                                    */
                                                    
                                                    /*
                                                    
                                                    
                                                    var name = results[k].get("survey").get("survey").get("name");
                                                    console.log(name);
                                                    author = results[k].get("author");
                                                    username = author.get("name");
                                                    console.log(username);
                                                    console.log(value);  
                                                    var length = value.length;
                                                    
                                                    
                                                    console.log(length);
                                                    var answerID = results[k].id;
                                                    var question = results[k].get("survey").get("survey").get("questions");
                                                    var surveyData = results[k].get("data");
                                                    var dateAnswer = results[k].get("createdAt");
                                                    var dato = dateAnswer.toString();
                                                    var datoen = dato.substring(4, 15);
                                                    
                                                    var author = results[k].get("author");
                                                    var name = author.get("name");
                                                    
                                                        output += "<div id=\"feedBack\">";
                                                        output += "<h1>" + id + "</h1>";
                                                        output += "<h2>" + name + "</h2>";
                                                        output += "<p>" + datoen + "</p>";
                                                        output += "<p>" + surveyData[0] + "</p>";
                                                        
                                                    
                                                    for (var j = 0; j < surveyData.length; j++){
                                                        var questions = question[j];
                                                        var answer = surveyData[j];
                                                        
                                                        output += "<h3>" + questions + "</h3>";
                                                        output += "<p>" + answer + "</p>";
                                                        
                                                    }
                                                    
                                                    
                                                    var feedback = results[k].get("feedback");
                                                    
                                                    if(feedback != undefined){
                                                    output += "<h4>Tilbakemelding fra din trener</h4>";
                                                    output += "<p>" + feedback + "</p>";
                                                    
                                                    }else{
                                                    output += '<textarea rows="2" cols="30 name="text" id="text' + h + '" placeholder="Skriv en tilbakemelding"></textarea>';
                                                    output += '<button type="button" name="' + answerID +'" id="' + h + '" onclick="submitFeedback(id, name)">Publiser</button>';
                                                    }
                                                    output += "</div>";
                                                    */
                                                    h++;
                                                    
                                                
                                                }
                                                
                                                $("#list-surv").html(outputSurv);
                                                $("#list-answer").html(output);
                                            }
                                            
                                    });
                                    
                                    j++;
                                }
                                
                                
                                /*
                            var navn = objects[i].get("survey").get("name");
                                if (navn == "Forberedelse til trening/kamp") {
                                    var SurveyAnswer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
                                    var query = new Parse.Query(SurveyAnswer);
                                    query.descending("createdAt");
                                    query.include("author");
                                    query.equalTo("survey", objects[i]);
                                    query.find({
                                            success: function(objects) {
                                                var outputSkade = "";
                                                var output = "";
                                                var sovn = new Array();
                                                var opplagt = new Array();
                                                var motivasjon = new Array();
                                                var name = new Array();
                                                var author = new Array();
                                                var feedback = new Array();
                                                for (var j in objects) {
                                                    var date = objects[j].get("createdAt");
                                                    var dato = date.toString();
                                                    var datoen = dato.substring(4, 15);

                                                    if (idag == datoen) {

                                                        sovn[j] = parseInt(objects[j].get("data")[0]);
                                                        opplagt[j] = parseInt(objects[j].get("data")[1]);
                                                        motivasjon[j] = parseInt(objects[j].get("data")[3]);
                                                        author[j] = objects[j].get("author");
                                                        feedback[j] = objects[j].get("data")[4];

                                                        name[j] = author[j].get("name");

                                                        var evaluering = feedback[j];
                                                        name[j] = author[j].get("name");
                                                        navn = name[j];

                                                        var user;
                                                        var userName = "";
                                                        var skade = "";
                                                        if (objects[j].get("data")[2]) {
                                                            user = objects[j].get("author");
                                                            userName = user.get("name");
                                                            skade = objects[j].get("data")[2];

                                                        }

                                                        outputSkade += "<div id=\"injury\">";
                                                        outputSkade += "<h4>" + userName + "</h4>";
                                                        outputSkade += "<p>" + skade + "</p>";
                                                        outputSkade += "</div>";

                                                        output += "<div id=\"feedBack\">";
                                                        output += "<h4>" + navn + "</h4>";
                                                        output += "<p>" + evaluering + "</p>";
                                                        output += "</div>";
                                                        
                                                        
                                                        var data = {
                                                            labels: name,
                                                            series: [sovn]
                                                            
                                                        }

                                                        var data2 = {
                                                            labels: name,
                                                            series: [opplagt]
                                                            
                                                        }

                                                        var data3 = {
                                                            labels: name,
                                                            series: [motivasjon]
                                                            
                                                        }

                                                        var options = {
                                                            ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                                                            width: '85em',
                                                            height: '23em',
                                                            high: 10,
                                                            low: 0

                                                        };
                                                        
                                                        new Chartist.Bar('#chart1', data, options);
                                                        new Chartist.Bar('#chart2', data2, options);
                                                        new Chartist.Bar('#chart3', data3, options);
                                                        $("#list-posts").html(output);
                                                        $("#list-skade").html(outputSkade);

                                                    }
                                                }

                                            },
                                            error: function(error) {
                                                console.log("Query error:" + error.message);
                                            }
                                        });
                                }
                                */
                            }
                            
                        },
                        error: function(error) {
                            console.log("Query error:" + error.message);
                        }

                    });


            }
            
            function chooseSurv(survId){
                
                console.log(oldSurv);
                
                var SurveyAnswer = Parse.Object.extend("data_" + klubbID + "_Surveys_Answers");
                var query = new Parse.Query(SurveyAnswer);
                query.descending("createdAt");
                query.include("author");
                query.include("survey");
                query.equalTo("survey", survId);
                query.find({
                    success: function(results) {
                        
                            for(var k in results){
                                
                                //var answers = results[k].get("data");
                                console.log("TURID");
                        
                            }
                        }
                        
                    });
                
            }

            getAnswers();