Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
            Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';  

            var team = Parse.Object.extend("data_" + klubbID + "_Members");

            function getTeam() {
                var Query = new Parse.Query(team);
                Query.include("user");
                Query.find({
                        success: function(objects, results) {
                            var output = "";
                            for (var i = 0; i < objects.length; i++) {
                                var user = objects[i].get("user");
                                var userRole = objects[i].get("role");
                                var navn = user.get("name");
                                var role = objects[i].get("role");
                            
                                if((role == "admin") || (role == "trener") || (role == "spiller")){
                                var pB = "";
                                var userPB = "";
                                if (user.get("profileImage_small")) {
                                    var bilde = user.get("profileImage_small");
                                    var url1 = bilde.url();
                                    pB = '<img class="pb1" src="' + url1 + '">';
                                } else {
                                    userPB = '<img class="pb1" src="../img/User_Small.png">';
                                         }
                                
                                output += '<div class="player">';
                                output += pB;
                                output += userPB;
                                output += '<div class="text">';
                                output += '<h3>' + navn + '</h3>';
                                output += '<h4>' + role + '</h4>';
                                output += '</div>';
                                output += '</div>';
                                }
                            }
                            $("#list-team").html(output);
                        },
                        error: function(error) {
                            console.log("Query error:" + error.message);
                        }
                            
                    });


            }

            getTeam();
                setTimeout(function(){
            function acceptPlayersTeam(){
            if ((role == "admin") || (role == "trener")) {
                        var outputReq ="";
                        var query = Parse.Object.extend("data_" + klubbID + "_Members");
                        var queryQ = new Parse.Query(query);
                        queryQ.descending("createdAt");
                        queryQ.include("user");
                        queryQ.find({
                            success: function (objects) {
                                outputReq += '<h1 id="request-heading">' + "Forespørsler" + "</h1>";
                                for (var a in objects) {
                                    var content = objects[a].get("accepted");
                                    var user = objects[a].get("user");
                                    var name = user.get("name");
                                    var accept = objects[a].get("accepted");
                                    if (accept == false) {
                                        console.log(name);
                                        outputReq += "<div id=\"all-requests\">";
                                        outputReq += "<p>" + name + "</p>";
                                        outputReq += "<div id=\"check\">";
                                        outputReq += '<button name="' + name + '" id="false" onclick="respondPlayerRequest(name, id);" class="choose"><i class="material-icons" id="close">close</i></button>';
                                        outputReq += '<button name="' + name + '" id="true" onclick="respondPlayerRequest(name, id);" class="choose"><i class="material-icons" id="check">check</i></button>';
                                        outputReq += "</div>";
                                        outputReq += "</div>";
                                    }
                                }
                                $("#list-req").html(outputReq);
                            }
                            , error: function (error) {
                                console.log("Query error:" + error.message);
                            }
                        });
                    }
            }
                    acceptPlayersTeam();
                }, 900);
            
            function respondPlayerRequest(id, respond) {
                console.log(id + respond);
                
                var query = Parse.Object.extend("data_" + klubbID + "_Members");
                var queryQ = new Parse.Query(query);
                queryQ.descending("createdAt");
                queryQ.include("user");
                queryQ.find().then(function () {}, function (err) {
                    handleParseError(err);
                });
                queryQ.find({
                    success: function (objects) {
                        for (var a in objects) {
                            var content = objects[a].get("accepted");
                            var user = objects[a].get("user");
                            var userId = user.id;
                            var name = user.get("name");
                            if (name == id) {
                                console.log(name);
                                if(respond == 'true'){
                                objects[a].set("accepted", true);
                                objects[a].set("role", "spiller");
                                Parse.Cloud.run("setPlayersTeam", {                                             user: userId,
                                teamId: klubbID
                                    });
                                objects[a].save(null, {
                                    success: function () {
                                        window.location.reload();
                                    }
                                });
                            }else if(respond == 'false'){
                                objects[a].destroy({
                                  success: function(myObject) {
                                    console.log("Forespørsel slettet");
                                    window.location.reload();
                                  },
                                  error: function(myObject, error) {
                                    console.log("error:" + error);
                                  }
                                });
                            }
                            }
                        }
                    }
                    , error: function (error) {
                        console.log("Query error:" + error.message);
                        handleParseError();
                    }
                });
            
        }