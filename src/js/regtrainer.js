//Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI");
        //Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';
        Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");

        function getInfo() {
            
            Parse.User.logOut();
            
            var registerTeams = Parse.Object.extend("RegisterTeams");
            var setTeam = Parse.Object.extend("Teams");
            var teamName = document.reg.elements[0].value;
            var coachName = document.reg.elements[1].value;
            var coachMail = document.reg.elements[2].value;
            var coachPass = document.reg.elements[3].value;
            var invMail = document.invoice.elements[0].value;
            var invMob = document.invoice.elements[1].value;
            var address = document.invoice.elements[2].value;
            var postal = document.invoice.elements[3].value;
            if ((teamName.length == 0) || (coachName.length == 0) || (coachMail.length == 0) || (invMail.length == 0) || (invMob.length == 0) || (address.length == 0) || (postal.length == 0)) {
                console.log("Oopsey");
            }
            else {
                if (document.getElementById('terms').checked) {
                    var team = new registerTeams();
                    team.set("team", teamName);
                    team.set("coachname", coachName);
                    team.set("coachmail", coachMail);
                    team.set("mailinvoice", invMail);
                    team.set("phoneinvoice", invMob)
                    team.set("address", address);
                    team.set("postal", postal);
                    team.save(null, {
                        success: function (gameScore) {
                            var teamSet = new setTeam();
                            teamSet.set("Name", teamName);
                            teamSet.save(null, {
                                
                                success: function (gameScore) {
                                    var teamId;
                                    var teamiD; 
                                    var query = new Parse.Query(setTeam);
                                    query.equalTo("Name", teamName);
                                    query.find({
                                        success: function(results) {
                                            var teamid = results;
                                            teamiD = teamid[0];
                                            teamId = teamiD.id;
                                            console.log(teamiD);
                                        }

                                    });
                                    
                                    var user = new Parse.User();
                                    user.set("name", coachName);
                                    user.set("email", coachMail);
                                    user.set("username", coachMail)
                                    user.set("password", coachPass);
                                    user.addUnique("teams", teamSet);
                                    user.set("team", teamSet);
                                    user.signUp(null, {
                                            success: function(user) {
                                                console.log("New user signed up successfully!");
                                                function logIn() {
                                    var email = coachMail;
                                    var passord = coachPass;

                                    Parse.User.logIn(email, passord, {
                                            success: function() {
                                                console.log("Innlogging  suksessfull");
                                                
                                                var newTeam = Parse.Object.extend("data_" + teamId+ "_Members");
                                                var teamNew = new newTeam();

                                                teamNew.set("user", Parse.User.current());
                                                teamNew.set("role", "trener");
                                                teamNew.set("accepted", true);
                                                teamNew.save(null, {
                                                            success: function () {
                                                                console.log("Signed up team");
                                                                alert('Bruker registrert. Logg inn for å begynne å bruke systemet.');
                                                            }
                                                            , error: function (error) {
                                                                alert('Problem ved registrering');
                                                            }
                                                        });
                                                
                                            },
                                            error: function() {
                                                console.log("Innlogging feilet:" + error.message);
                                            }
                                        })
                                    return false;
                                }
                                logIn();
                        
                                },
                                error: function(user, error) {
                                    console.log("Error: " + error.code + "" + error.message);
                                    alert("Her skjedde det visst en liten feil: " + error.message);
                                }
                            });
                                    
                                    
                                }
                                , error: function (gameScore, error) {
                                    alert('Problem registrering');
                                }
                                });
                        }
                        , error: function (gameScore, error) {
                            alert('Problem');
                        }
                    });
                    
                    
                    
        }
        
                }
            }