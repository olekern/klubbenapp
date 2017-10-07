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
                            
                                if((userRole == "admin") || (userRole == "trener") || (userRole == "spiller")){
                                var pB = "";
                                var userPB = "";
                                if (user.get("profileImage_small")) {
                                    var bilde = user.get("profileImage_small");
                                    var url1 = bilde.url();
                                    pB = '<img class="pb1" src="' + url1 + '">';
                                } else {
                                    userPB = '<img class="pb1" src="../src/img/User_Small.png">';
                                         }
                                
                                output += '<div class="player">';
                                output += pB;
                                output += userPB;
                                output += '<div class="playerbox">';
                                output += '<div class="text">';
                                output += '<h3>' + navn + '</h3>';
                                output += '<h4>' + userRole + '</h4>';
                                output += '</div>';
                                if ((role == "admin") || (role == "trener")) {
                                    output += '<div class="kickout">';
                                    output += '<div class="kick" id="' + user.id + '" onclick="confirmKick(id);">';
                                    output += '<i class="fa fa-user-times" aria-hidden="true"></i>';
                                    output += '<p>Spark ut</p>';
                                    output += '</div>';
                                    output += '<div class="changerole" id="' + user.id + '" onclick="changeRole(id);">';
                                    output += '<i class="material-icons">person_outline</i>';
                                    output += '<h5>Endre rolle</h5>';
                                    output += '</div>';
                                    output += '</div>';
                                }
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

            setTimeout(function(){
                    getTeam();
                }, 1000);
            
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
                setTimeout(function(){
                    acceptPlayersTeam();
                }, 1000);
            
            function respondPlayerRequest(id, respond) {
                
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
                                if(respond == 'true'){
                                objects[a].set("accepted", true);
                                objects[a].set("role", "spiller");
                                Parse.Cloud.run("setPlayersTeam", {                                             user: userId,
                                teamId: klubbID
                                    });
                                objects[a].save(null, {
                                    success: function () {
                                        acceptPlayersTeam();
                                    }
                                });
                            }else if(respond == 'false'){
                                objects[a].destroy({
                                  success: function(myObject) {
                                    acceptPlayersTeam();
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

    function confirmKick(userId){
        
        var userPointer = {
            __type: 'Pointer',
            className: '_User',
            objectId: userId   
                };
        
        var members = Parse.Object.extend("data_" + klubbID + "_Members");
        var Query = new Parse.Query(members);
        Query.equalTo("user", userPointer);
        Query.include("user");
        Query.find({
            success: function(objects){
                var outputConfirm = "";
                for(var l in objects){
                    var playerName = objects[l].get("user").get("name");
                    outputConfirm += '<div class="confirm">';
                    outputConfirm += '<h2>Sikker på at du vil slette <span>' + playerName + '</span> fra laget?</h2>';
                    outputConfirm += '<button class="no" id="none" name="cancel" onclick="kickUser(id ,name)">Avbryt</button>';
                    outputConfirm += '<button class="yes" id="' + userId + '" name="confirm" onclick="kickUser(id, name)">Bekreft</button>';
                    outputConfirm += '</div>';
                }
                $("#list-confirmation").html(outputConfirm);
            }
        });
        
    }

$(document).click(function(event) { 
    if(!$(event.target).closest('.confirm').length) {
        if($('.confirm').is(":visible")) {
            var outputConfirm = "";

            $("#list-confirmation").html(outputConfirm);
        }
    }        
});

    function kickUser(userId, confirmation){
        
        if(confirmation == "cancel"){
            var outputConfirm = "";
            $("#list-confirmation").html(outputConfirm);
        }else if(confirmation == "confirm"){
        
        var userPointer = {
            __type: 'Pointer',
            className: '_User',
            objectId: userId   
                };
        
        var members = Parse.Object.extend("data_" + klubbID + "_Members");
        var Query = new Parse.Query(members);
        Query.equalTo("user", userPointer);
        Query.find({
            success: function(results){
                for(var i in results){
                console.log(results[i]);
                    
                results[i].destroy({
                  success: function() {
                    Parse.Cloud.run("removePlayersTeam", {        
                    user: userId,
                    teamId: klubbID
                            }).then(function(response){
                        var outputConfirm = "";

                    $("#list-confirmation").html(outputConfirm);
                    getTeam();
                        
                    });
                  },
                  error: function(error) {
                    console.log(error.message);
                  }
                });
                
                }
            }
        });
        }
    }

    function changeRole(userId){
        
        var userPointer = {
            __type: 'Pointer',
            className: '_User',
            objectId: userId   
                };
        
        var outputRole = "";
        
        var memberclass = Parse.Object.extend("data_" + klubbID + "_Members");
        var queryM = new Parse.Query(memberclass);
        queryM.equalTo("user", userPointer);
        queryM.include("user");
        queryM.find({
            success: function(results){
                for(var u in results){
                    var userrole = results[u].get("role");
                    var username = results[u].get("user").get("name");
                    if(userrole == "trener"){
                        
                        outputRole += '<div class="role">';
                        outputRole += '<h2>Er du sikker på at du vil endre rollen til <span>' + username + '</span> fra trener til spiller?</h2>';
                        outputRole += '<button class="no" id="none" name="cancel" onclick="kickUser(id ,name)">Avbryt</button>';
                    outputRole += '<button class="yes" id="' + userId + '" name="confirm" onclick="roleChange(id, name)">Bekreft</button>';
                        outputRole += '</div>';
                        
                    }else if(userrole == "spiller"){
                        outputRole += '<div class="role">';
                        outputRole += '<h2>Er du sikker på at du vil endre rollen til <span>' + username + '</span> fra spiller til trener?</h2>';
                        outputRole += '<button class="no" id="none" name="cancel" onclick="roleChange(id ,name)">Avbryt</button>';
                    outputRole += '<button class="yes" id="' + userId + '" name="confirm" onclick="roleChange(id, name)">Bekreft</button>';
                        outputRole += '</div>';
                    }
                }
                $("#list-roles").html(outputRole);
            }
        });
        

    }

    function roleChange(userId, confirmation){
        
        if(confirmation == "cancel"){
            
            var outputRole = "";

            $("#list-roles").html(outputRole);
            
        }else if(confirmation == "confirm"){
        var userPointer = {
            __type: 'Pointer',
            className: '_User',
            objectId: userId   
                };
        
        var memb = Parse.Object.extend("data_" + klubbID + "_Members");
        var queryMembers = new Parse.Query(memb);
        queryMembers.equalTo("user", userPointer);
        queryMembers.include("user");
        queryMembers.find({
            success: function(objects){
                for(var t in objects){
                    var roleUser = objects[t].get("role");

                    if(roleUser == "trener"){
                        objects[t].set("role", "spiller");
                        objects[t].save(null, {
                            success: function(){
                                getTeam();
                                
                                var outputRole = "";

                                $("#list-roles").html(outputRole);
                            }
                        });
                    }else if(roleUser == "spiller"){
                        objects[t].set("role", "trener");
                        objects[t].save(null, {
                            success: function(){
                                getTeam();
                                
                                var outputRole = "";

                                $("#list-roles").html(outputRole);
                            }
                        });
                    }
                }
            }
            
        });
        }
        
    }

$(document).click(function(event) { 
    if(!$(event.target).closest('.role').length) {
        if($('.role').is(":visible")) {
            var outputRole = "";

            $("#list-roles").html(outputRole);
        }
    }        
});
        

    function groups(){
        if ((role == "admin") || (role == "trener")) {
        var outputGroups = "";
        outputGroups += '<h2>Grupper</h2>';
        
            var groups = Parse.Object.extend("data_" + klubbID + "_Groups");
            var queryGroups = new Parse.Query(groups);
            queryGroups.descending("createdAt");
            queryGroups.include("members.user");
            queryGroups.find({
                success: function (results) {
                    
                    outputGroups += '<div class="groups">';
                    
                    for(var i in results){
                        
                        var group = results[i];
                        var groupId = results[i].id;
                        var groupName = group.get("name");
                        var user = results[i].get("members");
                        outputGroups += '<h3>' + groupName + '</h3>';
                        
                        for(var j in user){
                            var username = user[j].get("user").get("name");
                            var userId = user[j].id;
                            
                            outputGroups += '<div class="username">';
                            outputGroups += '<button id="' + userId + '" name="' + groupId + '" onclick="removeUser(id, name);">' + username + '</button>';
                            outputGroups += '<hr></hr>';
                            outputGroups += '</div>';
                        }
                        outputGroups += '<div class="change-group" >';
                        outputGroups += '<div class="nohide" id="' + groupId + '" onclick="listMembers(id);">';
                        outputGroups += '<i class="material-icons">person_add</i>';
                        outputGroups += '<p>Legg til personer</p>';
                        outputGroups += '</div>';
                        outputGroups += '</div>';
                        
                    }
                    
                    outputGroups += '</div>';
                    outputGroups += '<div id="new" onclick="listMembers(id);" class="nohide">';
                    outputGroups += '<i class="material-icons">group_add</i>';
                    outputGroups += '<p>Lag en ny gruppe</p>';
                    outputGroups += '</div>';
        
                    $("#list-groups").html(outputGroups);
                    
                    
                }
                
            });
        }
    }
        setTimeout(function(){
        groups();
                }, 1000);


function listMembers(groupId){
    var outputMemb = "";
    
    outputMemb += '<div id="members" class="nohide">';
    outputMemb += '<div id="list-users"></div>';
    
    if(groupId == "new"){
        
        var users = Parse.Object.extend("data_" + klubbID + "_Members");
        var queryUsers = new Parse.Query(users);
        queryUsers.descending("createdAt");
        queryUsers.include("user");
        queryUsers.find({
                success: function (results) {
                    
                    var outputUser = "";
                    
                    outputUser += '<div class="addmembers">';
                    outputUser += '<input type="text" id="groupname" placeholder="Navn på gruppe"/>';
                    outputUser += '<p>Legg til brukere:</p>';
                    
                    outputUser += '<select class="select-members" id="selectmemb" multiple="multiple">';
                    for(var i in results){
                    
                        var member = results[i].get("user").get("name");
                        var memberid = results[i].get("user").id;
                        outputUser += '<option value="' + memberid + '">' + member + '</option>';
                    }
                    
                    outputUser += '</select>';
                    outputUser += '<button class="finishgroup" onclick="newGroup();">Fullfør</button>';
                    outputUser += '</div>';
                    $("#list-users").html(outputUser);
                    
                    $('select').multipleSelect();
                }
        });
        
    }else{
        
        var extGroup = Parse.Object.extend("data_" + klubbID + "_Groups");
        var queryGroup = new Parse.Query(extGroup);
        queryGroup.equalTo("objectId", groupId);
        queryGroup.include("members.user");
        queryGroup.find({
            success: function(objects){
                
                for(var k in objects){
                    
                    var members = objects[k].get("members");
                    var membersArray = new Array();
                    
                    for(var j in members){
                        var userId = members[j].id;
                        membersArray.push(userId);
                    }
                    
                    var users = Parse.Object.extend("data_" + klubbID + "_Members");
                    var queryUsers = new Parse.Query(users);
                    queryUsers.descending("createdAt");
                    queryUsers.include("user");
                    queryUsers.find({
                            success: function (results) {
                                
                                var outputUser = "";
        
                                outputUser += '<div class="addnewmembers">';
                                outputUser += '<p>Legg til brukere:</p>';

                                outputUser += '<select class="select-members" id="selectmember" multiple="multiple">';
                                for(var i in results){

                                    var member = results[i].get("user").get("name");
                                    var memberid = results[i].id;
                                    if($.inArray(memberid, membersArray) == -1){
                                        outputUser += '<option value="' + memberid + '">' + member + '</option>';
                                    }else{

                                    }
                                }
        
                                outputUser += '</select>';
                                outputUser += '<button class="finishgroup" id="' + groupId + '" onclick="addUser(id);">Fullfør</button>';
                                outputUser += '</div>';
                                $("#list-users").html(outputUser);

                                $('select').multipleSelect();
                            }
                    });
                }
            }
        });
    }
    
    
    outputMemb += '</div>';
    
    $("#list-members").html(outputMemb);
}

function addUser(groupId){
    
    var groupClass = new Parse.Object.extend("data_" + klubbID + "_Groups");
    var query = new Parse.Query(groupClass);
    query.equalTo("objectId", groupId);
    query.first({
        success: function(results){

                var chosenmembs = $('#selectmember').val();
                for(var j = 0; j<chosenmembs.length; j++){
                    
                    var memberPointer = {
                                          __type: 'Pointer',
                                          className: 'data_' + klubbID + '_Members',
                                          objectId: chosenmembs[j]
                                        };
                    results.addUnique("members", memberPointer);
                    
                }
                
                results.save({
                success: function () {
                var outputUser = "";
                $("#list-users").html(outputUser);
                groups();
            }
                    });
            
        }
    });
}

$(document).click(function(event) { 
    if(!$(event.target).closest('.nohide').length) {
        if($('#members').is(":visible")) {
            var outputMemb = "";

            $("#list-members").html(outputMemb);
        }
    }        
});

function newGroup(){
    
    var title = document.getElementById("groupname").value;
    
    var chosenmembs = $('#selectmemb').val();
    
    var groupclass = Parse.Object.extend("data_" + klubbID + "_Groups");

    var newgroup = new groupclass();
    newgroup.set("name", title);
      
        var pointers = _.map(chosenmembs, function(memberId) {
        var pointer = new Parse.User("data_" + klubbID + "_Members");
        pointer.id = memberId;
        return pointer;
        });
        
        var group = Parse.Object.extend("data_" + klubbID + "_Members");
        var groupQuery = new Parse.Query(group);
        groupQuery.containedIn("user", pointers);
        groupQuery.find({
            success: function (results) {

                for(var k in results){
                    var user = results[k];
                    newgroup.addUnique("members", user);
                }
                
                newgroup.save({
            success: function () {
                
                var outputNone = "";
                $("#list-members").html(outputNone);
                groups();
            }
    });
                    
            }
            
        });

}

function removeUser(userId, groupId){

    var groupClass = new Parse.Object.extend("data_" + klubbID + "_Groups");
    var query = new Parse.Query(groupClass);
    query.equalTo("objectId", groupId);
    query.first({
        success: function(results){
                
                var memberarray = results.get("members");
                var membersArray = new Array();
                for(var k in memberarray){
                    var membersId = memberarray[k].id;
                    if(memberarray[k].id == userId){
                        
                    }else{
                    membersArray.push(membersId);
                    }
                }

                var pointers = _.map(membersArray, function(memberId) {
                var pointer = new Parse.Object("data_" + klubbID + "_Members");
                pointer.id = memberId;
                return pointer;
                });
            console.log(pointers);

                results.set("members", pointers);
            
                results.save({
                success: function () {
                var outputUser = "";
                $("#list-users").html(outputUser);
                groups();
            }
                    }); 
            
        }
    });    
    
}

