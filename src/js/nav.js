var outputSM = "";

outputSM += '<div class="nav">';
outputSM += '<a href="newsFeed.html"><img src="../img/Icon-white.png" id="logo"></a>';
outputSM += '<ul>';
outputSM += '<li>';
outputSM += '<div class="loggut">';
outputSM += '<a href="registration.html" class="material-icons" id="signOut" onclick="logOut()">exit_to_app</a>';
outputSM += '<a href="profile.html">';
outputSM += '<p id="brukernavn" class="navn">';
outputSM += '</p></a>';
outputSM += '<ul id="profile-pb">';
outputSM += '</ul>';
outputSM += '</div>';
outputSM += '</li>';
outputSM += '</ul>';
outputSM += '</div>';
outputSM += '<div id="side-menu">';
outputSM += '<div id="top">';
outputSM += '<div id="dashbord" class="square">';
outputSM += '<div class="box" id="dashBox"></div>';
outputSM += '<a href="newsFeed.html" class="material-icons">home<p>Dashbord</p></a>';
outputSM += '</div>';
outputSM += '<div id="rapporter" class="square">';
outputSM += '<div class="box" id="repBox"></div>';
outputSM += '<a href="reports.html" class="material-icons">today<p>Kalender</p></a>';
outputSM += '</div>';
outputSM += '<div id="evaluering" class="square">';
outputSM += '<div class="box" id="evBox"></div>';
outputSM += '<a href="evalueringT.html" class="material-icons">insert_chart<p>Rapporter</p></a>';
outputSM += '</div>';
outputSM += '<div id="team" class="square">';
outputSM += '<div class="box" id="teamBox"></div>';
outputSM += '<a href="team.html" class="material-icons">group<p>Laget</p></a>';
outputSM += '</div>';
outputSM += '</div>';
outputSM += '<div id="btm">';
outputSM += '<p>&copy 2017 Lustek AS</p>';
outputSM += '</div>';
outputSM += '</div>';


$("#list-sm").html(outputSM);
