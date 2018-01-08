var login		= '';
var pwd			= '';
var first		= true;
var ITOP_URL	= 'https://itop.hardis.fr';
var ITOP_WS_URL	= ITOP_URL + "/webservices/rest.php?version=1.3";
var iTopOrgUrl 	= 'https://itop.hardis.fr/itop/pages/UI.php?operation=details&class=Organization&id=';

//pour l'animation de chargement
var opts = {
      lines: 11, // The number of lines to draw
      length: 15, // The length of each line
      width: 10, // The line thickness
      radius: 23, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb
      speed: 1.4, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
};

var spinner = null;
var spinner_div = 0;

/**
* fonction appelée au changement ou appui sur refresh donglet si jamais visité
**/
function loadPageOrg(){
	//test page formulaire ou affichage direct
	if(page=='afficheSelectInfo'){
		spinner_div = $('#spinner').get(0);
		if(spinner == null) {
		  spinner = new Spinner(opts).spin(spinner_div);
		}else {
		  spinner.spin(spinner_div);
		}

		// Json request for contact
		bJSON = {
			operation: 'core/get',
			'class': 'Person',
			key: requeteOrgContact(),
			output_fields: "name"
		}

	}else{
		//json test connection user
		oJSON = {
			operation: 'core/get',
			'class': 'Organization',
			key: "SELECT org FROM Organization AS org ",
			output_fields: "name"
		};
	}

	//ajax pour avoir un objet Contat
	$.ajax(
	{
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(bJSON)},
		crossDomain: 'true',
		success: function (data) {
			org = data["objects"];
			refreshSuccessfullOrg(data);
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";

		}
	});

}

/**
* Check si connecté ou pas a itop
*/
function refreshSuccessfullOrg(data){
	console.log(data);
	// Check code
	if (data.code != 0){
		if(page=='afficheSelectInfo')
			//stop chargement animation
			spinner.stop(spinner_div);

		// Missing password -> itop not connect
		// Open login form
		if (!first)
		{
			document.getElementById("errorMessage").innerHTML = data.message + ' ';
		}

		first = false;

		$("#login").show();
		if(page=='afficheSelectInfo')
			$("#connected").hide();
		else
			$("#form").hide();
	}
	else
	{
		$("#login").hide();
		document.getElementById("errorMessage").innerHTML = '';

		if(page=='afficheSelectInfo'){

			$("#connected").show();

		}else{

			$("#form").show();
			document.getElementById("client").value = '';
			document.getElementById('alertFormError').value = '';
		}

		//stop chargement animation
		spinner.stop(spinner_div);

		//vidage la liste
		$("#listeOrg").empty();
		var listOrg = $('#listeOrg');


		console.log('org: ');
		console.log(org);


		//affichage des org
		if(org!=null){
			lesClients = [];
			//parcours de tout les org
			$.each(org, function(i, v){
				//si valeur pas presente dans liste
				if(lesClients.indexOf(v['fields']['friendlyname']===-1)){
					//remplissage de la liste des clients
					lesClients.push(v['fields']['friendlyname']);
				}

				// creation d'une ligne + ajout a la liste
				var li = document.createElement('li');
				listOrg.append(li);

				// creation d'un lien + ajout a la ligne
				var a = document.createElement('a');
				//a.href=iTopOrgUrl+v['key'];
        a.href="../appli_gestion_client/afficheInfo.html?client="+v['fields']['friendlyname'];
				a.innerHTML = v['fields']['friendlyname'];
				a.target= '_BLANK';

				li.append(a);
			});

			$('#tab_CIOrg').click(function(){
				ChangeOnglet('tab_CIOrg', 'content_CIOrg');
			});

			$("#tab_CIOrg").css("color", "#1c94c4");
			$("#tab_CIOrg").css("cursor", "pointer");
			$("#tab_CIOrg").css("background-color", "#464c54");

		}//si le collabo n'a pas de client
		else{
			// creation d'une ligne + ajout a la liste
			var li = document.createElement('li');
			listOrg.append(li);
			li.innerHTML = "Ce collaborateur n'a pas de client";


			$('#tab_CIOrg').click(function(){
				console.log('NOPE');
				$("#content_CIOrg").empty();
				return false;
			});

			$("#tab_CIOrg").css("color", "#7D8080");
			$("#tab_CIOrg").css("cursor", "default");
			$("#tab_CIOrg").css("background-color", "#2f343a");
		}
	}
}

/****
** REQUETES
******/

//pour un objet de type Contact
function requeteOrgContact(){
	var request = 'SELECT org';
	request+= ' FROM Organization AS org';
	request+= ' JOIN Contract AS ctr ON ctr.org_id = org.id';
	request+= ' JOIN lnkContactToContract AS link ON link.contract_id=ctr.id';
	request+= ' JOIN Contact AS ctc ON link.contact_id = ctc.id ';
	request+= ' WHERE ctc.status = "Active"';
	request+= ' AND ctc.finalclass="Person"';
	request+= ' AND link.contract_name LIKE "%WMS"';
	request+= ' AND ctc.friendlyname ="'+ $('#collabo').val() +'"';


	return request;
}

/***
/* FONCTON UTILE
/***/

//cleanArray removes all duplicated elements
function cleanArray(array) {
  var i, j, len = array.length, out = [], obj = {};
  for (i = 0; i < len; i++) {
    obj[array[i]] = 0;
  }
  for (j in obj) {
    out.push(j);
  }
  return out;
}
