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

function CDS(){
	//récuperer le CDS du client

	function getContratWMS(){
		var requete = 'SELECT ctc FROM Contact AS ctc ';
		requete += 'JOIN lnkContactToContract AS link ON link.contact_id = ctc.id ';
		requete += 'JOIN Contract AS ctr ON link.contract_id = ctr.id ';
		requete += 'JOIN Organization AS org ON ctr.org_id=org.id ';
		requete += 'WHERE org.name="'+nomOrg+'"';
		requete += 'AND  link.contract_name LIKE "%WMS" ';
		requete += 'AND link.role_name="Centre de service Reflex"';
		return requete;
	}

	wmsJSON = {
		operation: 'core/get',
		'class': 'Contact',
		key: getContratWMS(),
		output_fields: "name"
	}

	$.ajax({
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(wmsJSON)},
		crossDomain: 'true',
		success: function(data){
			var rep = data['objects'];
			//console.log("nomorg" + nomOrg);
			//console.log("WMS rep "+rep);
			if(rep!=null){
				$.each(rep, function(index, value){
					//console.log("TEST FORMULAIRE 2 name "+value['fields']['name']);
					cds = value['fields']['name'];
				});
			}else{
				cds="PAS DE CDS";
			}
			loadPageSelectInfo();
		},
		error: function(data){
			console.log("cds error");
		}
	});
}


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
				$('.cds').text(cds);
				$('body h1').css("position", "relative");
				$('body h1').first().css("margin-bottom", "0px");
				$('.cds').css("width", "90%");
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
