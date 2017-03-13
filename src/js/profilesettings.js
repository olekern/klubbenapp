Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

function profile(){
                
                var outputProfile = "";
                var outputImg = "";
                var user = Parse.User.current();
                var userImg = "";
                var noUserImg = "";
                if (user.get("profileImage")) {
                    var brukerPB = user.get("profileImage");
                    var PBUrl = brukerPB.url();
                    userImg = "<img src='" + PBUrl + "'>";
                } else{
                    noUserImg = '<img src="../img/User_Big.jpeg">';
                }
                outputImg += "<div id=\"userPB\">";
                outputImg += userImg;
                outputImg += noUserImg;
                outputImg += "</div>"
                $("#profile-img").html(outputImg);
                
                var Query = Parse.Object.extend("Teams");
                var query = new Parse.Query(Query);
                query.equalTo("objectId", klubbID);
                query.find({
                    success: function(results){
                        
                        for(var i in results){
                    var teamName = results[0].get("Name");
                    var username = Parse.User.current().get("name");
                    outputProfile += '<p id="user-txt">' + username + '</p>';
                    outputProfile += '<p id="team-txt">' + teamName + '</p>';
                        
                }
                        $("#list-profile").append(outputProfile);
                }
                    
                });
    
    function changeTeam(){
        
        var teams = Parse.User.current().get("teams");
        console.log(teams);
        
    }
    
    
    function changeSettings(){
        
        var outputSettings = "";
        
        outputSettings += '<h4 id="pass-txt" onclick="showhide()">Endre passord</h4>';
        outputSettings += '<div id="changePass" style="display: none;">';
        outputSettings += '<input type="password" name="password" id="newpass" placeholder="Nytt passord"/>';
        outputSettings += '<input type="password" name="password" id="repeatpass" placeholder="Gjenta passord"/>';
        outputSettings += '<ul id="list-pass"></ul>';
        outputSettings += '<button onclick="changePassword()" id="submitpass">Lagre endring</button>';
        outputSettings += '</div>';
        $("#list-settings").html(outputSettings);
    }
    changeSettings();
}

profile();

function showhide() {
                if (document.getElementById('changePass').style.display == 'none') {
                    document.getElementById('changePass').style.display = 'block';
                    //document.getElementById('date-pick').style.display = 'none';
                }else if (document.getElementById('changePass').style.display == 'block') {
                    document.getElementById('changePass').style.display = 'none';
                    //document.getElementById('date-pick').style.display = 'block';
                }
                return false;
            }

function changePassword(){
    
    var password1 = document.getElementById("newpass").value;
    var password2 = document.getElementById("repeatpass").value;
        
    var outputPass = "";
    outputPass += '<div id="passchange">';
    
    if(password1 == password2){
        
        var user = Parse.User.current();
        user.set("password", password1);
        user.save(null, {
                        success: function () {
                            console.log("Suksess");
                        }
        });
        outputPass += '<p>Passord er endret</p>';
    }else{
        outputPass += '<p>Feltene inneholder ikke samme passord</p>';
    }
    
    outputPass += '</div>';
    
    $("#list-pass").html(outputPass);
}

