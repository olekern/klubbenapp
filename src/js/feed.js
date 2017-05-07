Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse'; 

function show() {
            if (document.getElementById('comments').style.display == 'none') {
                document.getElementById('comments').style.display = 'block';
            }
            return false;
        }

        function hide() {
            if (document.getElementById('comments').style.display == 'block') {
                document.getElementById('comments').style.display = 'none';
            }
            return false;
        }

        function handleParseError(err) {
            switch (err.code) {
            case Parse.Error.INVALID_SESSION_TOKEN:
                Parse.User.logOut();
                location.href = "registration.html";
                break;
            }
        }
        var currentUserName = Parse.User.current().get("name");
        var currentUserId = Parse.User.current().id;

    function chooseGroup(){
        
        var outputGroup = "";
        outputGroup += '<div id="groupSet">';
        outputGroup += '<i id="group" class="material-icons">group</i>';
        outputGroup += '<i id="info" class="material-icons">info</i>';
        outputGroup += '<div id="group-info">';
        outputGroup += '<p>Spesifiser gruppe for at kun enkelte brukere skal kunne se innlegget</p>';
        outputGroup += '</div>';
        outputGroup += '<select class="select-members" id="selectmemb" multiple="multiple">';
        
        var groups = Parse.Object.extend("data_" + klubbID + "_Groups");
        var queryGroups = new Parse.Query(groups);
        queryGroups.include("members.user");
        queryGroups.find({
            success: function(results){
                for(var j in results){
                    var groupId = results[j].id;
                    var groupName = results[j].get("name");
                    var members = results[j].get("members");
                    var userArray = new Array();
                    for(var t in members){
                        var userId = members[t].get("user").id;
                        userArray.push(userId);
                    }

                    if(_.contains(userArray, currentUserId)){
                        outputGroup += '<option value="' + groupId + '">' + groupName + '</option>';
                    }
                }
                
                outputGroup += '</select>';
                outputGroup += '</div>';

                $("#list-group").html(outputGroup);
                $('select').multipleSelect();
            }
            
        });
    }
chooseGroup();

        var post1 = Parse.Object.extend("Post");
        var Post = Parse.Object.extend("data_" + klubbID + "_Posts");

        function Submit() {
            
            document.getElementById('submit-btn').style.cssText = "display: none;";
            
            var newPost = new post1();
            var text = document.post.elements[0].value;
            var bilde = document.getElementById("post-file");
            var bildePath = document.getElementById("post-file").value;
            var bildeNavn = bildePath.split("\\").pop();
            var chosengroups = $('#selectmemb').val();
            var pointers = _.map(chosengroups, function(memberId) {
            var pointer = new Parse.Object("data_" + klubbID + "_Groups");
            pointer.id = memberId;
            return pointer;
            });
            newPost.set("content", text);
            newPost.set("author", Parse.User.current());
            newPost.set("clubId", klubbID);
            newPost.set("audiences", pointers);
            document.getElementById("postbtn").value = "";
            if (bilde.files.length > 0) {
                var file = bilde.files[0];
                var newFile = new Parse.File(bildeNavn, file);
                newFile.save({
                    success: function () {}
                    , error: function (file, error) {
                        console.log("Files Save Error:" + error.message);
                    }
                }).then(function (theFile) {
                    newPost.set("Image", theFile);
                    newPost.save({
                        success: function () {
                            getPosts();
                            document.getElementById("post-file").value = "";
                            location.href = "newsFeed.html";
                        }
                        , error: function (error) {
                            console.log("Post Save with File Error:" + error.message);
                            handleParseError();
                        }
                    });
                });
            }
            else {
                newPost.save(null, {
                    success: function (newPost) {
                        getPosts();
                        document.getElementById("post-file").value = "";
                        location.href = "newsFeed.html";
                    }
                    , error: function (newPost, error) {
                        console.log("Error:" + error.message);
                        handleParseError();
                    }
                });
            }
            
        }

        function getPosts() {
            var query = new Parse.Query(Post);
            query.descending("createdAt");
            query.include("author");
            query.include("comments");
            query.include("likes");
            query.find().then(function () {}, function (err) {
                handleParseError(err);
            });
            query.find({
                success: function (results) {
                    var output = "";
                    var commentid = new Array();
                    for (var i in results) {
                        results[i].toJSON();
                        var content = results[i].get("content");
                        var author = results[i].get("author");
                        var name = "Anonymous";
                        var postID = results[i];
                        var posts = postID.id;
                        var realPost = posts;
                        var date = results[i].get("createdAt");
                        var dato = date.toString();
                        var datoen = dato.substring(4, 15);
                        if (author != null) {
                            name = author.get("name");
                        }
                        var pB = "";
                        var userPB = "";
                        if (author.get("profileImage_small")) {
                            var bilde = author.get("profileImage_small");
                            var url1 = bilde.url();
                            pB = '<img class="pb1" src="' + url1 + '">';
                        }
                        else {
                            userPB = '<img class="pb1" src="../img/User_Small.png">';
                        }
                        var img = "";
                        if (results[i].get("Image")) {
                            var file = results[i].get("Image");
                            var url = file.url();
                            img = "<img src='" + url + "'>";
                        }
                        
                        var confirmation = "yes";
                        var group = results[i].get("audiences");
                        if(group != undefined){
                            if(group.length != 0){
                                confirmation = "no";
                                for(var k in group){
                                    var groupMembers = group[k].get("members");
                                    var groupName = group[k].get("name");
                                    for(var j in groupMembers){
                                        var memberId = groupMembers[j].get("user").id;
                                        var userId = Parse.User.current().id;
                                        if(userId == memberId){
                                            confirmation = "yes";
                                        }
                                    }
                                }
                            }
                        }
                        if(confirmation == "yes"){

                        output += "<div id=\"feedPost\">";
                        output += "<div id=\"feedCell\">";
                        output += "<div id=\"post\">";
                        output += "<div id=\"profilBilde\">";
                        output += pB;
                        output += userPB;
                        output += "</div>"
                        output += "<h4>" + name + "</h4>";
                        output += "<h5>" + datoen + "</h5>";
                        output += "<p>" + content + "</p>";
                        output += img;
                        output += "</div>";
                        var likes = results[i].get("likes");
                        output += "<div id=\"like-comment\">";
                        if ($.inArray(currentUserId, likes) !== -1) {
                            output += '<img src="../img/like_red.png" name="likeIconPressed" id="' + realPost + '" onclick="dislike(id);"></img>';
                        }
                        else {
                            output += '<img src="../img/like_blank.png" id="' + realPost + '" name="likeIcon" onclick="like(id);"></img>';
                        }
                        if (likes != null) {
                            output += "<h4>" + likes.length + " likerklikk</h4>";
                        }
                        else if (likes == undefined) {
                            output += "<h4>0 likerklikk</h4>";
                        }
                        else if (likes == 0) {
                            output += "<h4>0 likerklikk</h4>";
                        }
                        /*
                        var User = Parse.Object.extend("User");
                        var query3 = new Parse.Query(User);
                        output += '<span>likeName</span>';
                        query3.containedIn("objectId", likes);
                        query3.find({
                                success: function(results) {
                                    for (var i in results) {
                                        if (results[i] != null) {
                                            var liked = results[i];
                                            var likeName = liked.get("name");
                                            if (liked != null) {
                                            }
                                            output += '<span>likeName</span>';
                                            
                                        }
                                    }
                                
                                }
                                
                            });
                            */
                        commentid = results[i].get("comments");
                        if (commentid != null) {
                            if (commentid.length == 1) {
                                output += '<p onclick="return show();">' + commentid.length + ' kommentar</p>';
                            }
                            else {
                                output += '<p onclick="return show();">' + commentid.length + ' kommentarer</p>';
                            }
                        }
                        else if (commentid == undefined) {
                            output += "<p>0 kommentarer</p>";
                        }
                        else if (commentid == 0) {
                            output += "<p>0 kommentarer</p>";
                        }
                        output += "</div>";
                        output += "</div>";
                        output += '<div id="all-comments">';
                        output += '<div id="commentSection">';
                        output += '<i class="fa fa-comment-o" id="commentIcon" aria-hidden="true"></i>';
                        output += '<textarea rows="1" cols="40 name="text" id="text' + i + '" placeholder="Skriv en kommentar"></textarea>';
                        output += '<div class="cmt-btn">';
                        output += '<button type="button" name="' + realPost + '" id="' + i + '" onclick="submitComment(id, name)">Publiser</button>';
                        output += '</div>';
                        output += '</div>';
                        commentid = results[i].get("comments");
                        var m;
                        if (commentid != null) {
                            for (var i in commentid) {
                                if (commentid[i] != null) {
                                    var ct = commentid[i];
                                    var ctxt = ct.get("text");
                                    var ctauth = ct.get("author");
                                    var ctname = ctauth.get("name");
                                    var ctdate = results[i].get("createdAt");
                                    var ctdato = ctdate.toString();
                                    var ctdatoen = ctdato.substring(4, 15);
                                    var pB = "";
                                    var userPB = "";
                                    if (ctauth.get("profileImage_small")) {
                                        var bilde = ctauth.get("profileImage_small");
                                        var url1 = bilde.url();
                                        pB = '<img src="' + url1 + '">';
                                    }
                                    else {
                                        userPB = '<img src="../img/User_Small.png">';
                                    }
                                    output += '<div class="comments" id="comments' + i + '">';
                                    output += "<div id=\"profilBildeC\">";
                                    output += pB;
                                    output += userPB;
                                    output += "</div>"
                                    output += "<div id=\"commentTextC\">"
                                    output += "<h4>" + ctname + "</h4>";
                                    output += "<h5>" + ctdatoen + "</h5>";
                                    output += "<p>" + ctxt + "</p>";
                                    output += "</div>"
                                    output += "</div>"
                                }
                            }
                        }
                            
                        output += "</div>";
                        output += "</div>";
                    $("#list-posts").html(output);
                        }
            
                    }
                }
                , error: function (error) {
                    console.log("Query error:" + error.message);
                    /*
                    alert('Siden er under ombygging. Last ned appen fra App Store eller Google Play for å begynne å bruke plattformen.');*/
                    handleParseError();
                }
            });
        }

        function like(id) {
            var query = new Parse.Query(Post);
            query.descending("createdAt");
            query.include("author");
            query.find().then(function () {}, function (err) {
                handleParseError(err);
            });
            query.find({
                success: function (results) {
                    var user = Parse.User.current();
                    var userId = user.id;
                    for (var i = 0; i < results.length; i++) {
                        var post = results[i].id;
                        if (post === id) {
                            results[i].addUnique("likes", userId);
                            results[i].save(null, {
                                success: function (newPost) {
                                    console.log("Fantastisk");
                                    getPosts();
                                }
                                , error: function (newPost, error) {
                                    console.log("Error:" + error.message);
                                    handleParseError();
                                }
                            });
                        }
                    }
                }
            });
        }

        function dislike(id) {
            var query = new Parse.Query(Post);
            query.descending("createdAt");
            query.include("author");
            query.find().then(function () {}, function (err) {
                handleParseError(err);
            });
            query.find({
                success: function (results) {
                    var user = Parse.User.current();
                    var userId = user.id;
                    for (var i = 0; i < results.length; i++) {
                        var post = results[i].id;
                        if (post === id) {
                            console.log(post);
                            results[i].remove("likes", userId);
                            results[i].save(null, {
                                success: function (newPost) {
                                    console.log("Fantastisk");
                                    getPosts();
                                }
                                , error: function (newPost, error) {
                                    console.log("Error:" + error.message);
                                    handleParseError();
                                }
                            });
                        }
                    }
                }
            });
        }

        function submitComment(number, postID) {
            
            document.getElementById(number).style.cssText = "display: none;";
            
            var Comment = Parse.Object.extend("data_" + klubbID + "_Comments");
            var commenting = new Comment();
            var postComment = document.getElementById("text" + number).value;
            commenting.set("text", postComment);
            commenting.set("author", Parse.User.current());
            commenting.save({
                success: function (commenting) {
                    var objectID = commenting.id;
                    console.log(objectID);
                    console.log(postComment);
                    var post = Parse.Object.extend("data_" + klubbID + "_Posts");
                    var Query = new Parse.Query(post);
                    Query.find({
                        success: function (objects) {
                            for (var j = 0; j < objects.length; j++) {
                                var post = objects[j].id;
                                if (post == postID) {
                                    objects[j].addUnique("comments", commenting);
                                    objects[j].save({
                                        success: function () {
                                            getPosts();
                                            location.href = "newsFeed.html";
                                        }
                                    });
                                }
                            }
                        }
                        , error: function (error) {
                            console.log("Query error:" + error.message);
                            handleParseError();
                        }
                    });
                }
                , error: function (error) {
                    console.log("Ikkje bra");
                    handleParseError();
                }
            });
        }
        getPosts();