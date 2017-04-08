Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var klubbID;
        if(localStorage.getItem("clubId")){
            klubbID = localStorage.getItem("clubId");
        }else{
            if(Parse.User.current().get("team") == undefined){
                window.location = "club.html";
            }else{
            klubbID = Parse.User.current().get("team").id;
            localStorage.setItem('clubId', klubbID);
            }
        }
