Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse'; 

    function show() {
                if (document.getElementById('form-input').style.display == 'none') {
                    document.getElementById('form-input').style.display = 'block';
                }
                return false;
            }

            function hide() {
                if (document.getElementById('form-input').style.display == 'block') {
                    document.getElementById('form-input').style.display = 'none';
                }
                return false;
            }

    function logInUser(){
        var outputLog = "";
            if(Parse.User.current()){
                var name = Parse.User.current().get("name");
                outputLog += '<h3>Logget inn som: <span>' + name + '</span></h3>';
                outputLog += '<h5 onclick="logOut()">Er ikke denne brukeren deg? Logg ut.</h5>';
            }else{
                outputLog += '<div id="log-form">';
                outputLog += '<div id="form-input" class="form" style="display: block;">';
                outputLog += '<form name="login">';
                outputLog += '<input type="text" class="text" name="username" placeholder="Mail"/>';
                outputLog += '<input type="password" class="text" name="password" placeholder="Passord"/>';
                outputLog += '</form>';
                outputLog += '<button onclick="logIn()">Logg inn</button>';
                outputLog += '<h4 onclick="return hide()">Har du ikke en bruker? Registrer deg her</h4>';
                outputLog += '</div>';
                outputLog += '<div id="create-coach">';
                outputLog += '<form name="registration">';
                outputLog += '<input type="text" class="text" name="coachName" placeholder="Fullt navn"/>';
                outputLog += '<input type="text" class="text" name="coachMail" placeholder="Mail"/>';
                outputLog += '<input type="password" class="text" name="coachPass" placeholder="Passord"/>';
                outputLog += '</form>';
                outputLog += '<button onclick="newCoach()">Registrer!</button>';
                outputLog += '<h4 onclick="return show()">Har allerede en bruker? Logg inn</h4>';
                outputLog += '</div>';
                outputLog += '</div>';
            }
            
            $("#list-log").html(outputLog);
        
    }
    logInUser();

    function logIn() {
            var name = document.login.elements[0].value;
            var pass = document.login.elements[1].value;
            var loginError = "";
            Parse.User.logIn(name, pass, {
                    success: function() {
                        window.location.reload();
                    },
                    error: function(error) {
                        console.log("Innlogging feilet:" + error.message);
                        alert('Ser ut til at enten brukernavn eller passord er skrevet feil.');
                    }
                })
            return false;
        }

    function logOut() {
            Parse.User.logOut(
                console.log("Logger ut"));
            window.location.reload();

        }

    function newCoach(){
            var coachName = document.registration.elements[0].value;
            var coachMail = document.registration.elements[1].value;
            var coachPass = document.registration.elements[2].value;
        
            if ((coachName.length == 0) || (coachMail.length == 0) || (coachPass.length == 0)) {
                alert('Har du fylt ut alle feltene?');
            }else{
                console.log(coachMail);
                console.log(coachName);
                console.log(coachPass);
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
                        window.location.reload();
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
            return false;
            }
    }

        function getInfo() {

            if (Parse.User.current()) {
                
                var teamName = document.regteam.elements[0].value;
                if((teamName.length == 0)){
                    alert("Du må fylle inn et lagnavn for å opprette et nytt lag.");
                }else{
                    
                    if (document.getElementById('terms').checked) {
                    document.getElementById('reg').style.cssText = "display: none;";
                    
                                    var userId = Parse.User.current().id;
                                    console.log(teamName);
                                    console.log(userId);
                                    Parse.Cloud.run("registerTeam", {                                             teamName: teamName,
                                    userId: userId
                                    }).then(function(response){
                                        document.getElementById('reg').style.cssText = "display: block;";
                                        alert("Ditt nye lag ble nå opprettet.");
                                        location.href = "./src/html/registration.html";
                                            });
                                                
                                    return false;
                    
            }else{
                alert('Du må bekrefte at du har lest og akseptert våre vilkår og betingelser før du kan registrere deg.');
            }
                }
                    
            }else{
                alert('Ser ikke ut som at du er logget inn. Opprett en ny bruker eller logg inn med en eksisterende.');
            }
            
        }
