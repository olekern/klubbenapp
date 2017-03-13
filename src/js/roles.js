Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var role;
            function roles() {
                var klubbID = Parse.User.current().get("team").id;
                var Query = Parse.Object.extend("data_" + klubbID + "_Members");
                var query = new Parse.Query(Query);
                query.find().then(function() {
                        }, function(err) {
                handleParseError(err);
                        });
                
                var outputRole = "";
                var outputReq = "";
                query.equalTo("user", Parse.User.current());
                query.find({
                        success: function(objects) {
                            role = objects[0].get("role");
                            outputRole += "<div id=\"userRole\">";
                            outputRole += "<p>" + role + "</p>";
                            outputRole += "</div>"
                            $("#list-role").html(outputRole);
                            if (role == "admin") {
                            } else if (role == "trener") {
                                //document.getElementById("forberedelser").remove();
                                //document.getElementById("evaluering").remove();
                            } else {
                                document.getElementById("rapporter").remove();
                                document.getElementById("evaluering").remove();
                               
                            }
                            
                        },
                        error: function(error) {
                            alert("Error: " + error.code + " " + error.message);
                            handleParseError();
                        }
                    });
            }
            roles();
