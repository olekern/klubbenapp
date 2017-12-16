Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var cancel;
var confirm;
var athlete;
var emailText;
var phoneText;
var enter;
var toCancel;
var newEmail;
var newPhone;

var validMail;
var validPhone;
var playerCreated;

if (language == "NO") {
    cancel = "Avbryt";
    confirm = "Bekreft";
    athlete = "Utøver";
    emailText = "Email";
    phoneText = "Mobilnummer";
    enter = "Trykk enter for å fullføre";
    toCancel = "eller esc for å avbryte";
    newEmail = "Skriv inn mailadressen";
    newPhone = "Skriv inn telefonnummeret";

    validMail = "Fyll inn en gyldig mail-adresse";
    validPhone = "Fyll inn et gyldig telefonnummer";
    playerCreated = "En utøverbruker er opprettet og lagt til i laget";
} else {
    cancel = "Cancel";
    confirm = "Confirm";
    athlete = "Athlete";
    emailText = "Email";
    phoneText = "Phone number";
    enter = "Press enter to submit";
    toCancel = "or esc to cancel";
    newEmail = "Fill in the email adress";
    newPhone = "Fill in the phone number";

    validMail = "Please insert a valid e-mail address";
    validPhone = "Please insert a valid phone number";
    playerCreated = "An athlete user has been created and added to the team";
}

var team = Parse.Object.extend("data_" + klubbID + "_Members");

function getTeam() {

    var kickOut;
    var changeRole;
    var coach;
    if (language == "NO") {
        kickOut = "Spark ut";
        changeRole = "Endre rolle";
        coach = "Trener";
    } else {
        kickOut = "Kick out";
        changeRole = "Change role";
        coach = "Coach";
    }

    var Query = new Parse.Query(team);
    Query.include("user");
    Query.find({
        success: function (objects, results) {
            var output = "";
            for (var i = 0; i < objects.length; i++) {
                var user = objects[i].get("user");
                var objectId = objects[i].id;
                var userId = user.id;
                if (user != undefined) {
                    var userRole = objects[i].get("role");
                    var name = user.get("name");
                    var email = user.get("username");
                    if (email == undefined) {
                        email = "";
                    } else {
                        var emailFilter = /^([a-åA-Å0-9_.-])+@(([a-åA-Å0-9-])+.)+([a-åA-Å0-9]{2,4})+$/;
                        if (!emailFilter.test(email)) {
                            email = "";
                        }

                    }

                    var phone = user.get("phone");

                    if (phone == undefined) {
                        phone = "";
                    }

                    var thisRole;
                    var changeUser = "";
                    if (userRole == "trener") {
                        thisRole = coach;
                    } else if (userRole == "spiller") {
                        thisRole = athlete;
                        
                        /*
                        changeUser += '<div class="hide-info' + userId + '">';
                        changeUser += '<i class="material-icons" id="' + userId + '" onclick="showEdit(id)">create</i>';
                        changeUser += '</div>';
                        */
                    } else if (userRole == "admin") {
                        thisRole = "Admin";
                    }

                    if ((userRole == "admin") || (userRole == "trener") || (userRole == "spiller")) {
                        var pB = "";
                        var userPB = "";
                        if (user.get("profileImage_small")) {
                            var bilde = user.get("profileImage_small");
                            var url1 = bilde.url();
                            pB = '<img class="pb1" src="' + url1 + '">';
                        } else {
                            userPB = '<img class="pb1" src="./src/img/User_Small.png">';
                        }


                        output += '<div class="player">';
                        output += pB;
                        output += userPB;
                        output += '<div class="playerbox">';
                        output += '<div class="text">';
                        output += '<h3>' + name + '</h3>';
                        output += '<h4>' + thisRole + '</h4>';
                        output += '<div class="phone-mail">';
                        output += '<h6 class="hide-info' + userId + '">' + emailText + ': ' + email + '</h4>';
                        output += '<input type="text" class="edit-user' + userId + '" style="display: none" id="email' + userId + '" placeholder="' + newEmail + '" onkeydown = "if (event.keyCode == 13) validateEdit(id)" value="' + email + '"/>';
                        output += '<h6 class="hide-info' + userId + '">' + phoneText + ': ' + phone + '</h4>';
                        output += '<input type="text" class="edit-user' + userId + '" style="display: none" id="phone' + userId + '" placeholder="' + newPhone + '" onkeydown = "if (event.keyCode == 13) validateEdit(id)" value="' + phone + '"/>';
                        output += '<p class="edit-user' + userId + '" style="display: none">' + enter + '</p>';
                        output += changeUser;
                        output += '<div class="edit-user' + userId + '" id="i2" style="display: none">';
                        output += '<i class="material-icons" id="' + userId + '" onclick="showEdit(id)">cancel</i>';
                        output += '</div>';
                        output += '</div>';
                        output += '</div>';
                        if ((role == "admin") || (role == "trener")) {
                            output += '<div class="kickout">';
                            output += '<div class="kick" id="' + user.id + '" onclick="confirmKick(id);">';
                            output += '<i class="fa fa-user-times" aria-hidden="true"></i>';
                            output += '<p>' + kickOut + '</p>';
                            output += '</div>';
                            output += '<div class="changerole" id="' + user.id + '" onclick="changeRole(id);">';
                            output += '<i class="material-icons">person_outline</i>';
                            output += '<h5>' + changeRole + '</h5>';
                            output += '</div>';
                            output += '</div>';
                        }
                        output += '</div>';
                        output += '</div>';
                    }
                }
            }
            $("#list-team").html(output);
        },
        error: function (error) {
            console.log("Query error:" + error.message);
        }

    });


}

function showEdit(objectId) {

    var hideInfo = ".hide-info" + objectId;
    var editUser = ".edit-user" + objectId;
    $(hideInfo).toggle();
    $(editUser).toggle();
}

function validateEdit(objectId) {
    var id = objectId.substring(5, 15);
    var emailId = "#email" + id;
    var newEmail = $(emailId).val();


    var phoneId = "#phone" + id;
    var newPhone = $(phoneId).val();

    var emailFilter = /^([a-åA-Å0-9_.-])+@(([a-åA-Å0-9-])+.)+([a-åA-Å0-9]{2,4})+$/;
    var phoneFilter = /^\d+$/;

    if (newEmail != "") {
        if (!emailFilter.test(newEmail)) {
            alert(validMail);
        } else {
            if (newPhone != "") {
                if (!phoneFilter.test(newPhone)) {
                    alert(validPhone);
                } else {
                    saveEdit(id, newPhone, newEmail);
                }
            } else {
                saveEdit(id, newPhone, newEmail);
            }
        }
    } else {
        if (newPhone != "") {
            if (!phoneFilter.test(newPhone)) {
                alert(validPhone);
            } else {
                saveEdit(id, newPhone, newEmail);
            }
        } else {
            saveEdit(id, newPhone, newEmail);
        }
    }
}

function saveEdit(userId, phone, email) {

    console.log(userId);
    console.log(phone);
    console.log(email);
}

function acceptPlayersTeam() {

    if ((role == "admin") || (role == "trener")) {

        var requests;
        if (language == "NO") {
            requests = "Forespørsler";
        } else {
            requests = "Requests";
        }

        var outputReq = "";
        var query = Parse.Object.extend("data_" + klubbID + "_Members");
        var queryQ = new Parse.Query(query);
        queryQ.descending("createdAt");
        queryQ.include("user");
        queryQ.find({
            success: function (objects) {
                outputReq += '<h1 id="request-heading">' + requests + "</h1>";
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
            },
            error: function (error) {
                console.log("Query error:" + error.message);
            }
        });
    }
}

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
                    if (respond == 'true') {
                        objects[a].set("accepted", true);
                        objects[a].set("role", "spiller");
                        Parse.Cloud.run("setPlayersTeam", {
                            user: userId,
                            teamId: klubbID
                        });
                        objects[a].save(null, {
                            success: function () {
                                acceptPlayersTeam();
                            }
                        });
                    } else if (respond == 'false') {
                        objects[a].destroy({
                            success: function (myObject) {
                                acceptPlayersTeam();
                            },
                            error: function (myObject, error) {
                                console.log("error:" + error);
                            }
                        });
                    }
                }
            }
        },
        error: function (error) {
            console.log("Query error:" + error.message);
            handleParseError();
        }
    });

}

function confirmKick(userId) {

    var userPointer = {
        __type: 'Pointer',
        className: '_User',
        objectId: userId
    };

    var youSure;
    var fromTeam;
    if (language == "NO") {
        youSure = "Sikker på at du vil slette";
        fromTeam = "fra laget";
    } else {
        youSure = "Are you sure you want to delete";
        fromTeam = "from the team";
    }

    var members = Parse.Object.extend("data_" + klubbID + "_Members");
    var Query = new Parse.Query(members);
    Query.equalTo("user", userPointer);
    Query.include("user");
    Query.find({
        success: function (objects) {
            var outputConfirm = "";
            for (var l in objects) {
                var playerName = objects[l].get("user").get("name");
                outputConfirm += '<div class="confirm">';
                outputConfirm += '<h2>' + youSure + ' <span>' + playerName + '</span> ' + fromTeam + '?</h2>';
                outputConfirm += '<button class="no" id="none" name="cancel" onclick="kickUser(id ,name)">' + cancel + '</button>';
                outputConfirm += '<button class="yes" id="' + userId + '" name="confirm" onclick="kickUser(id, name)">' + confirm + '</button>';
                outputConfirm += '</div>';
            }
            $("#list-confirmation").html(outputConfirm);
        }
    });

}

$(document).click(function (event) {
    if (!$(event.target).closest('.confirm').length) {
        if ($('.confirm').is(":visible")) {
            var outputConfirm = "";

            $("#list-confirmation").html(outputConfirm);
        }
    }
});

function kickUser(userId, confirmation) {

    if (confirmation == "cancel") {
        var outputConfirm = "";
        $("#list-confirmation").html(outputConfirm);
    } else if (confirmation == "confirm") {

        var userPointer = {
            __type: 'Pointer',
            className: '_User',
            objectId: userId
        };

        var members = Parse.Object.extend("data_" + klubbID + "_Members");
        var Query = new Parse.Query(members);
        Query.equalTo("user", userPointer);
        Query.find({
            success: function (results) {
                for (var i in results) {

                    results[i].destroy({
                        success: function () {
                            Parse.Cloud.run("removePlayersTeam", {
                                user: userId,
                                teamId: klubbID
                            }).then(function (response) {
                                var outputConfirm = "";

                                $("#list-confirmation").html(outputConfirm);
                                getTeam();

                            });
                        },
                        error: function (error) {
                            console.log(error.message);
                        }
                    });

                }
            }
        });
    }
}

function changeRole(userId) {

    var userPointer = {
        __type: 'Pointer',
        className: '_User',
        objectId: userId
    };

    var outputRole = "";

    var sureChange;
    var coachPlayer;
    var playerCoach;

    if (language == "NO") {
        sureChange = "Er du sikker på at du vil endre rollen til";
        coachPlayer = "fra trener til utøver";
        playerCoach = "fra utøver til trener";
    } else {
        sureChange = "Are you sure you want to change the role of";
        coachPlayer = "from coach to athlete";
        playerCoach = "from athlete to coach";
    }

    var memberclass = Parse.Object.extend("data_" + klubbID + "_Members");
    var queryM = new Parse.Query(memberclass);
    queryM.equalTo("user", userPointer);
    queryM.include("user");
    queryM.find({
        success: function (results) {
            for (var u in results) {
                var userrole = results[u].get("role");
                var username = results[u].get("user").get("name");
                if (userrole == "trener") {

                    outputRole += '<div class="role">';
                    outputRole += '<h2>' + sureChange + ' <span>' + username + '</span> ' + coachPlayer + '?</h2>';
                    outputRole += '<button class="no" id="none" name="cancel" onclick="roleChange(id ,name)">' + cancel + '</button>';
                    outputRole += '<button class="yes" id="' + userId + '" name="confirm" onclick="roleChange(id, name)">' + confirm + '</button>';
                    outputRole += '</div>';

                } else if (userrole == "spiller") {
                    outputRole += '<div class="role">';
                    outputRole += '<h2>' + sureChange + ' <span>' + username + '</span> ' + playerCoach + '?</h2>';
                    outputRole += '<button class="no" id="none" name="cancel" onclick="roleChange(id ,name)">' + cancel + '</button>';
                    outputRole += '<button class="yes" id="' + userId + '" name="confirm" onclick="roleChange(id, name)">' + confirm + '</button>';
                    outputRole += '</div>';
                }
            }
            $("#list-roles").html(outputRole);
        }
    });


}

function roleChange(userId, confirmation) {

    if (confirmation == "cancel") {

        var outputRole = "";

        $("#list-roles").html(outputRole);

    } else if (confirmation == "confirm") {
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
            success: function (objects) {
                for (var t in objects) {
                    var roleUser = objects[t].get("role");

                    if (roleUser == "trener") {
                        objects[t].set("role", "spiller");
                        objects[t].save(null, {
                            success: function () {
                                getTeam();

                                var outputRole = "";

                                $("#list-roles").html(outputRole);
                            }
                        });
                    } else if (roleUser == "spiller") {
                        objects[t].set("role", "trener");
                        objects[t].save(null, {
                            success: function () {
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

$(document).click(function (event) {
    if (!$(event.target).closest('.role').length) {
        if ($('.role').is(":visible")) {
            var outputRole = "";

            $("#list-roles").html(outputRole);
        }
    }
});


function groups() {
    var groupText;
    var addMembers;
    var newGroup;
    if (language == "NO") {
        groupText = "Grupper";
        addMembers = "Legg til personer";
        newGroup = "Lag en ny gruppe";
    } else {
        groupText = "Groups";
        addMembers = "Add members";
        newGroup = "Create a new group";
    }
    if (role == undefined) {
        groups();
    } else {
        if ((role == "admin") || (role == "trener")) {
            var outputGroups = "";
            outputGroups += '<h2>' + groupText + '</h2>';

            var groups = Parse.Object.extend("data_" + klubbID + "_Groups");
            var queryGroups = new Parse.Query(groups);
            queryGroups.descending("createdAt");
            queryGroups.include("members.user");
            queryGroups.find({
                success: function (results) {

                    outputGroups += '<div class="groups">';

                    for (var i in results) {

                        var group = results[i];
                        var groupId = results[i].id;
                        var groupName = group.get("name");
                        var user = results[i].get("members");
                        outputGroups += '<h3>' + groupName + '</h3>';

                        for (var j in user) {
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
                        outputGroups += '<p>' + addMembers + '</p>';
                        outputGroups += '</div>';
                        outputGroups += '</div>';

                    }

                    outputGroups += '</div>';
                    outputGroups += '<div id="new" onclick="listMembers(id);" class="nohide">';
                    outputGroups += '<i class="material-icons">group_add</i>';
                    outputGroups += '<p>' + newGroup + '</p>';
                    outputGroups += '</div>';

                    $("#list-groups").html(outputGroups);


                }

            });
        }
    }
}

function listMembers(groupId) {

    var nameOfGroup;
    var addMembers;
    var finish;
    if (language == "NO") {
        nameOfGroup = "Navn på gruppe";
        addMembers = "Legg til brukere";
        finish = "Fullfør";
    } else {
        nameOfGroup = "Name of group";
        addMembers = "Add members";
        finish = "Confirm";
    }
    var outputMemb = "";

    outputMemb += '<div id="members" class="nohide">';
    outputMemb += '<div id="list-users"></div>';

    if (groupId == "new") {

        var users = Parse.Object.extend("data_" + klubbID + "_Members");
        var queryUsers = new Parse.Query(users);
        queryUsers.descending("createdAt");
        queryUsers.include("user");
        queryUsers.find({
            success: function (results) {

                var outputUser = "";

                outputUser += '<div class="addmembers">';
                outputUser += '<input type="text" id="groupname" placeholder="' + nameOfGroup + '"/>';
                outputUser += '<p>' + addMembers + ':</p>';

                outputUser += '<select class="select-members" id="selectmemb" multiple="multiple">';
                for (var i in results) {

                    var member = results[i].get("user").get("name");
                    var memberid = results[i].get("user").id;
                    outputUser += '<option value="' + memberid + '">' + member + '</option>';
                }

                outputUser += '</select>';
                outputUser += '<button class="finishgroup" onclick="newGroup();">' + finish + '</button>';
                outputUser += '</div>';
                $("#list-users").html(outputUser);

                $('select').multipleSelect();
            }
        });

    } else {

        var extGroup = Parse.Object.extend("data_" + klubbID + "_Groups");
        var queryGroup = new Parse.Query(extGroup);
        queryGroup.equalTo("objectId", groupId);
        queryGroup.include("members.user");
        queryGroup.find({
            success: function (objects) {

                for (var k in objects) {

                    var members = objects[k].get("members");
                    var membersArray = new Array();

                    for (var j in members) {
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
                            outputUser += '<p>' + addMembers + ':</p>';

                            outputUser += '<select class="select-members" id="selectmember" multiple="multiple">';
                            for (var i in results) {

                                var member = results[i].get("user").get("name");
                                var memberid = results[i].id;
                                if ($.inArray(memberid, membersArray) == -1) {
                                    outputUser += '<option value="' + memberid + '">' + member + '</option>';
                                } else {

                                }
                            }

                            outputUser += '</select>';
                            outputUser += '<button class="finishgroup" id="' + groupId + '" onclick="addUser(id);">' + finish + '</button>';
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

function addUser(groupId) {

    var groupClass = new Parse.Object.extend("data_" + klubbID + "_Groups");
    var query = new Parse.Query(groupClass);
    query.equalTo("objectId", groupId);
    query.first({
        success: function (results) {

            var chosenmembs = $('#selectmember').val();
            for (var j = 0; j < chosenmembs.length; j++) {

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

$(document).click(function (event) {
    if (!$(event.target).closest('.nohide').length) {
        if ($('#members').is(":visible")) {
            var outputMemb = "";

            $("#list-members").html(outputMemb);
        }
    }
});

function newGroup() {

    var title = document.getElementById("groupname").value;

    var chosenmembs = $('#selectmemb').val();

    var groupclass = Parse.Object.extend("data_" + klubbID + "_Groups");

    var newgroup = new groupclass();
    newgroup.set("name", title);

    var pointers = _.map(chosenmembs, function (memberId) {
        var pointer = new Parse.User("data_" + klubbID + "_Members");
        pointer.id = memberId;
        return pointer;
    });

    var group = Parse.Object.extend("data_" + klubbID + "_Members");
    var groupQuery = new Parse.Query(group);
    groupQuery.containedIn("user", pointers);
    groupQuery.find({
        success: function (results) {

            for (var k in results) {
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

function removeUser(userId, groupId) {

    var groupClass = new Parse.Object.extend("data_" + klubbID + "_Groups");
    var query = new Parse.Query(groupClass);
    query.equalTo("objectId", groupId);
    query.first({
        success: function (results) {

            var memberarray = results.get("members");
            var membersArray = new Array();
            for (var k in memberarray) {
                var membersId = memberarray[k].id;
                if (memberarray[k].id == userId) {

                } else {
                    membersArray.push(membersId);
                }
            }

            var pointers = _.map(membersArray, function (memberId) {
                var pointer = new Parse.Object("data_" + klubbID + "_Members");
                pointer.id = memberId;
                return pointer;
            });

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

var currentTeam;

function changePassword() {

    var changePass;
    var currentPass;
    var createPass;
    if (language == "NO") {
        changePass = "Endre lagpassord";
        currentPass = "Nåværende lagpassord";
        createPass = "Opprett lagpassord";
    } else {
        changePass = "Change team password";
        currentPass = "Current team password";
        createPass = "Create a team password";
    }

    var teams = Parse.Object.extend("Teams");
    var queryTeam = new Parse.Query(teams);
    queryTeam.equalTo('objectId', klubbID);
    queryTeam.find({

        success: function (objects) {

            currentTeam = objects[0];
            if (role == undefined) {
                changePassword();
            } else {
                if (role == "trener") {

                    var passwordBox = "";

                    passwordBox += '<div id="password-box">';

                    var existingTeamPassword = objects[0].get("password");

                    if ((existingTeamPassword != undefined) && (existingTeamPassword != "")) {
                        passwordBox += '<h3>' + currentPass + ': <span>' + existingTeamPassword + '</span></h3>';
                    } else {
                        passwordBox += '<h3>' + createPass + '</h3>';
                    }

                    passwordBox += '<input type="text" id="change-password-input" placeholder="' + changePass + '" onkeydown="if (event.keyCode == 13) submitUpdatedPassword(team);"/>';
                    passwordBox += '<h4>' + enter + '<h4>';
                    passwordBox += '</div>';

                    $('#change-password').html(passwordBox);
                }
            }
        }
    });
}

changePassword();

function submitUpdatedPassword() {
    var emptyPass;
    if (language == "NO") {
        emptyPass = "Passordfeltet er tomt. Prøv igjen.";
    } else {
        emptyPass = "The password input field is empty. Try again.";
    }

    var newPassword = document.getElementById("change-password-input").value;

    if ((newPassword == "") || (newPassword == " ")) {
        alert(emptyPass);
    } else {
        currentTeam.set("password", newPassword);
        currentTeam.save({
            success: function () {
                changePassword();
            }
        });
    }

}

function createScheme() {

    var addMember;

    if (language == "NO") {
        addMember = "Legg til medlem";
    } else {
        addMember = "Add new member";
    }

    var outputCreate = "";

    outputCreate += '<div id="create">';
    outputCreate += '<div id="list-form"></div>';
    outputCreate += '<div id="add-box" onclick="createForm()">';
    outputCreate += '<h2>' + addMember;
    outputCreate += '<i class="material-icons">create</i>';
    outputCreate += '</h2>';
    outputCreate += '</div>';
    outputCreate += '</div>';

    $("#create-member").html(outputCreate);
}

var checked = false;

function createForm(cancel) {


    if (cancel != undefined) {
        if (cancel == "cancel") {
            $("#list-form").html("");
            checked = false;
        } else {
            createForm();
        }
    } else {
        if (checked == true) {

            var uName = document.getElementById("username").value;
            var uPhone = document.getElementById("userphone").value;
            var uMail = document.getElementById("usermail").value;

            /*
            var p1Name = document.getElementById("parent1name").value;
            var p1Name = document.getElementById("parent1phone").value;
            var p1Name = document.getElementById("parent1mail").value;
            
            var p2Name = document.getElementById("parent2name").value;
            var p2Name = document.getElementById("parent2phone").value;
            var p2Name = document.getElementById("parent2mail").value;
            */

            if (uName == undefined) {

            } else {

                var emailFilter = /^([a-åA-Å0-9_.-])+@(([a-åA-Å0-9-])+.)+([a-åA-Å0-9]{2,4})+$/;
                var phoneFilter = /^\d+$/;
                /*
                                if (!emailFilter.test(uMail)) {
                                    alert(validMail);
                                }
                                */
                Parse.Cloud.run("registerMember", {
                    role: "spiller",
                    phone: uPhone,
                    mail: uMail,
                    name: uName,
                    clubID: klubbID
                }).then(function (response) {
                    alert(playerCreated);

                    checked = false;

                    createScheme();
                    groups();
                    getTeam();
                    acceptPlayersTeam();
                });



            }

        } else if (checked == false) {
            var name;
            var phone;
            var mail;
            var parent;
            var optional;

            if (language == "NO") {
                name = "Navn";
                phone = "Telefon";
                mail = "E-post";
                parent = "Foresatt";
                optional = "Valgfritt";
            } else {
                name = "Name";
                phone = "Phone";
                mail = "E-mail";
                parent = "Parent";
                optional = "Optional";
            }


            var outputForm = "";

            outputForm += '<form id="form">';
            outputForm += '<div id="cancel" onclick="createForm(id)">';
            outputForm += '<i class="material-icons">close</i>';
            outputForm += '</div>';

            outputForm += '<h3 id="athlete">' + athlete + '</h3>';
            outputForm += '<input id="username" type="text" placeholder="' + name + '"/>';
            outputForm += '<input id="userphone" type="tel" placeholder="' + phone + '"/>';
            outputForm += '<input id="usermail" type="mail" placeholder="' + mail + '"/>';
            /*
            outputForm += '<h3>' + parent + ' 1 (' + optional +')</h3>';
            outputForm += '<input id="parent1name" type="text" placeholder="' + name + '"/>';
            outputForm += '<input id="parent1phone" type="tel" placeholder="' + phone + '"/>';
            outputForm += '<input id="parent1mail" type="mail" placeholder="' + mail + '"/>';

            outputForm += '<h3>' + parent + ' 2 (' + optional +')</h3>';
            outputForm += '<input id="parent2name" type="text" placeholder="' + name + '"/>';
            outputForm += '<input id="parent2phone" type="tel" placeholder="' + phone + '"/>';
            outputForm += '<input id="parent2mail" type="mail" placeholder="' + mail + '"/>';
            */
            outputForm += '</form>';

            $("#list-form").html(outputForm);
            checked = true;
        }
    }
}

var role;

function getRole() {

    var currentUserId = Parse.User.current().id;
    var userPointer = {
        __type: 'Pointer',
        className: '_User',
        objectId: currentUserId
    };


    var memb = Parse.Object.extend("data_" + klubbID + "_Members");
    var queryMembers = new Parse.Query(memb);
    queryMembers.equalTo("user", userPointer);
    queryMembers.include("user");
    queryMembers.find({
        success: function (objects) {
            for (var t in objects) {
                role = objects[t].get("role");

                if (role == "trener") {

                    createScheme();
                    groups();
                    getTeam();
                    acceptPlayersTeam();
                }
            }
        }

    });
}
getRole();
