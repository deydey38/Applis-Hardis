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
*fonction appelée au chargement de body check connexion itop + affichage
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
	if (data.code != 0){		
		// Missing password -> itop not connect
		// Open login form
		if (!first)
		{
			document.getElementById("errorMessage").innerHTML = data.message + ' ';							
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
		$("#finishRapport").hide();		
		$("#login").hide();
		document.getElementById("errorMessage").innerHTML = '';
		
		
		if(page=='afficheSelectInfo'){
			if(nomOrg!='undefined'){
				
				$('.tabbed_area').show();
				loadPageAfficheCI();
				ChangeOnglet('tab_CIs', 'content_CIs');
				
				dejaVisiteContact=0;
				dejaVisiteBacklog=0;
				dejaVisiteDocCo=0;
				
				$('body h1').text(" ");
				$('body h1').text("Bienvenue sur l'application de gestion du client " + nomOrg.toUpperCase());
				$('body h1').css("position", "relative");
			}
			
			$("#connected").show();	
			$("#refresh").show();
			
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







