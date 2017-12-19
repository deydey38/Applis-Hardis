var login		= '';
var pwd			= '';
var first		= true;
var ITOP_URL	= 'https://itop.hardis.fr';
var ITOP_WS_URL	= ITOP_URL + "/webservices/rest.php?version=1.3";
var lst_org;
var oJSON		={
		operation: 'core/get',
		'class': 'Organization',
		key: "SELECT org FROM Organization AS org",
		output_fields: "name"
	};


/**
* fonction appelée au chargement de body check connexion itop + affichage
**/
function loadPageSelectInfo(){

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
			console.log("DATA CODE "+data.message);
	if(data.code != 0){
		// Missing password -> itop not connect
		// Open login form
		if (!first)
		{
			//document.getElementById("errorMessage").innerHTML = data.message + ' ';
		}

		first = false;
		loginVisible=1;
		$("#login").show();
		$("#refresh").hide();

		if(page=='afficheSelectInfo')
			$("#connected").hide();
		else
			$("#form").hide();
	}
	else
	{
		document.getElementById("errorMessage").innerHTML = '';


		if(modifClient==0){
			$("#refresh").hide();
		}

		$("#login").hide();
		document.getElementById("errorMessage").innerHTML = '';

		if(page=='afficheSelectInfo'){
			if(nomOrg!='undefined' || nomCI!='undefined'){
				$('.tabbed_area').show();
			}

			$("#connected").show();


		}else{

			$("#form").show();
			document.getElementById("client").value = '';
			document.getElementById('alertFormError').value = '';
		}
	}
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";

		}
	});

}
