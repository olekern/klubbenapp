Parse.initialize('wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI');
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';
        
        function logIn() {
            var name = document.login.elements[0].value;
            var pass = document.login.elements[1].value;
            var loginError = "";

            Parse.User.logIn(name, pass, {
                    success: function() {
                        window.location = "newsFeed.html";
                    },
                    error: function(error) {
                        console.log("Innlogging feilet:" + error.message);
                        loginError += '<p>Ser ut til at enten brukernavn eller passord er skrevet feil</p>'
                        $("#list-error").html(loginError);
                    }
                })
            return false;
        }