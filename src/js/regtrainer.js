Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse'; 

        function getInfo() {
            
            Parse.User.logOut();
            
            var teamName = document.reg.elements[0].value;
            var coachName = document.reg.elements[1].value;
            var coachMail = document.reg.elements[2].value;
            var coachPass = document.reg.elements[3].value;
            /*
            var invMail = document.invoice.elements[0].value;
            var invMob = document.invoice.elements[1].value;
            var address = document.invoice.elements[2].value;
            var postal = document.invoice.elements[3].value;
            */
            if ((teamName.length == 0) || (coachName.length == 0) || (coachMail.length == 0) || (coachPass.length == 0)) {
                alert('Har du fylt ut alle feltene?');
            }
            else {
                if (document.getElementById('terms').checked) {
                    document.getElementById('reg').style.cssText = "display: none;";
                    
                    var user = new Parse.User();
                    user.set("name", coachName);
                    user.set("email", coachMail);
                    user.set("username", coachMail)
                    user.set("password", coachPass);
                    user.signUp(null, {
                            success: function(user) {
                                console.log("New user signed up successfully!");
                                function logIn() {
                                    var email = coachMail;
                                    var passord = coachPass;

                                    Parse.User.logIn(email, passord, {
                                            success: function() {
                                                console.log("Innlogging  suksessfull");
                                                var userId = Parse.User.current().id;
                                                console.log(teamName);
                                                console.log(userId);
                                                Parse.Cloud.run("registerTeam", {
                                                teamName: teamName,
                                                userId: userId
                                                }).then(function(response){
                                                    document.getElementById('reg').style.cssText = "display: block;";
                                                    alert("Ditt nye lag ble nå opprettet. Logg inn med brukeren din for å begynne");
                                                    location.href = "./src/html/registration.html";
                                                });
                                                
                                            },
                                            error: function() {
                                                console.log("Innlogging feilet:" + error.message);
                                                document.getElementById('reg').style.cssText = "display: block;";
                                            }
                                        })
                                    return false;
                                }
                                logIn();
                        
                                },
                                error: function(user, error) {
                                    console.log("Error: " + error.code + "" + error.message);
                                    alert("Her skjedde det visst en liten feil: " + error.message);
                                    document.getElementById('reg').style.cssText = "display: block;";
                                }
                            });
                             
                    
        } else{
            alert('Du må bekrefte at du har lest og akseptert våre vilkår og betingelser før du kan registrere deg.');
        }
        
                }
                
            }