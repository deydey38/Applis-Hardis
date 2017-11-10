function checkConnection(){
  var login		= '';
  var pwd			= '';
  var ITOP_URL	= 'https://itop.hardis.fr';
  var ITOP_WS_URL	= ITOP_URL + "/webservices/rest.php?version=1.3";
  var oJSON		={
  		operation: 'core/get',
  		'class': 'Organization',
  		key: "SELECT org FROM Organization AS org",
  		output_fields: "name"
  	};

    $.ajax({
  		type: "GET",
  		url: ITOP_WS_URL,
  		dataType: 'jsonp',
  		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(oJSON)},
  		crossDomain: 'true',
  		success: function (data){
  			// Check code
  			console.log("DATA "+data);
  			console.log("DATA CODE "+data.code);
        if(data.code!=0){//non connnecté
          $("#login").show();
          $("header").hide();
          $(".contenu").hide();
        }else{
          $("#login").hide();
          $("header").show();
          $(".contenu").show();
          $(".contenu p").show();
          $(".row").show();
          $(".choix").show();
        }
      },
  		error: function (data) {
        console.log("DATA code ERROR");
  		}
  	});
}

$(document).ready(function(){

  $(".choix").hover(function(){
  	//$(this).fadeTo("fast", 0.5);
    $(this).find(".text").fadeTo("fast", 1);
  },
  function(){
    //$(this).fadeTo("fast", 1);
    $(this).find(".text").fadeTo("fast", 0);
    });
});
