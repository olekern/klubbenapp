Parse.initialize("wSHRpQQxW6jgmxRQV8UXogZcOiRvO8s8VoVmlMYI", "imVCWFzFX4fVRGcqX8ioidD686IPb5ELzHd3WkJw");
Parse.serverURL = 'https://klubbenheroku.herokuapp.com/parse';

var klubbID;
        if(localStorage.getItem("clubId")){
            klubbID = localStorage.getItem("clubId");
            
        }else{
            klubbID = Parse.User.current().get("team").id;
            if(klubbID == undefined){
            localStorage.setItem('clubId', klubbID);
            }else{
                window.location = "noteam.html";
            }
        }
