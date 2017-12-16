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
                    noUserImg = '<img src="./src/img/User_Big.jpeg">';
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
    
    
    function changeSettings(){
        
        var outputSettings = "";
        
        outputSettings += '<h4 id="pass-txt" onclick="showhide()">Endre passord</h4>';
        outputSettings += '<div id="changePass" style="display: none;">';
        outputSettings += '<input type="password" name="password" id="newpass" placeholder="Nytt passord"/>';
        outputSettings += '<input type="password" name="password" id="repeatpass" placeholder="Gjenta passord"/>';
        outputSettings += '<ul id="list-pass"></ul>';
        outputSettings += '<button onclick="changePassword()" id="submitpass">Lagre endring</button>';
        outputSettings += '</div>';
        outputSettings += '<ul id="list-teams"></ul>';
        outputSettings += '<h4>Endre profilbilde:</h4>';
        outputSettings += '<input id="pb-file" class="pbInput" onChange="changePB(this.value);" type="file"/>';
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

function changeTeam(){
    
    var user = Parse.User.current();
    var userId = user.get("username");
    var users = Parse.Object.extend("User");
    var queryUsers = new Parse.Query(users);
    queryUsers.equalTo("username", userId);
    queryUsers.include("teams");
    queryUsers.find({
        success:function(results){
            for(var i in results){
                    var outputTeams = "";
                var team = results[i].get("teams");
                    outputTeams += '<div id="change-team">';
                    outputTeams += '<h4>Bytt lag</h4>';
                    outputTeams += '<select id="select-team" onchange="saveChange()">';
                for(var k = 0; k<team.length; k++){
                    var teamName = team[k].get("Name");
                    var teamid = team[k].id;
                    
                    if(teamid == klubbID){
                            outputTeams += '<option id="' + teamid +'" selected>' + teamName +'</option>';
                        }else{
                            outputTeams += '<option id="' + teamid +'">' + teamName +'</option>';
                        }
                
                }
                        outputTeams += '</select>';
                        outputTeams += '</div>';
                        $("#list-teams").html(outputTeams);
                
            }
            
        }
    });
    
}
changeTeam();

function saveChange(){
    var team = document.getElementById('select-team');
    var type = team.options[team.selectedIndex].id;
    
    localStorage.setItem('clubId', type);
    
    window.location = "profile.html";
    
}

function changePB(){
    
    var user = Parse.User.current();
    
    var bilde = document.getElementById("pb-file");
    
    var file = bilde.files[0];
                
                var reader = new FileReader();
                  reader.onloadend = function() {
                      var base64 = reader.result;
                      console.log(base64);
                      var newFile = new Parse.File("img.txt", { base64: base64 });

                newFile.save({
                    success: function () {
                        console.log("YAYA");
                    }
                    , error: function (file, error) {
                        console.log("Files Save Error:" + error.message);
                    }
                }).then(function (theFile) {
                    user.set("profileImage", theFile);
                    user.set("profileImage_small", theFile);
                    user.save({
                        success: function () {
                            location.href = "profile.html";
                        }
                        , error: function (error) {
                            console.log("Post Save with File Error:" + error.message);
                            handleParseError();
                        }
                    });
                });
                  }
                  reader.readAsDataURL(file);
                
}