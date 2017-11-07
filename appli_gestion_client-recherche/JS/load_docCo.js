var login		= '';
var pwd			= '';
var first		= true;	
var ITOP_URL	= 'https://itop.hardis.fr';
var ITOP_WS_URL	= ITOP_URL + "/webservices/rest.php?version=1.3";
var iTopDocCo_URL 	= 'https://itop.hardis.fr/pages/UI.php?operation=details&class=MultiDoc&id=';

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
var lst_org;
var oJSON;


/**
* 1 (numero dexecution)
* fonction appelée au changement ou appui sur refresh donglet si jamais visité
**/
function loadPageAfficheDocCo(){

	//test page formulaire ou affichage direct
	if(page=='afficheSelectInfo'){
		spinner_div = $('#spinner').get(0);
		if(spinner == null) {
		  spinner = new Spinner(opts).spin(spinner_div);
		}else {
		  spinner.spin(spinner_div);
		}
	
		/**
		** INITIALISATION DES VARIABLES JSON  
		**/
		oJSON = {
			operation: 'core/get',
			'class': 'MultiDoc',
			key: GetBacklogRequestDocCo(),
			output_fields: GetWSColumnsAsStringDocCo()
		};
			
	}else{
		//json test connection user
		oJSON = {
			operation: 'core/get',
			'class': 'Organization',
			key: "SELECT org FROM Organization AS org ",
			output_fields: "name"
		};
	}
	
	//appel ajax pour multidoc
	ajaxMultiDoc();
	
}

/**
* 3
* Check connexion itop + affichage
*/
function refreshSuccessfullDocCo(data){
	
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
		
		document.getElementById("login").style.display = 'block';
		if(page=='afficheSelectInfo')
			document.getElementById("connected").style.display = 'none';
		else
			document.getElementById("form").style.display = 'none';
		
	}
	else
	{	

		
		document.getElementById("login").style.display = 'none';
		document.getElementById("errorMessage").innerHTML = '';
		
		if(page=='afficheSelectInfo'){
			
			doc = data["objects"];
			
			//vidage de la page 
			$("#nomDocp").html("");
			$("#statDocp").html("");
			$("#majByDocp").html("");
			$("#lienitopp").html("");
			
			$.each(data['objects'], function(index, value){
				
				$("#nomDocp").html(value['fields']['name']);
				$("#statDocp").html(convertStatut(value['fields']['status']));
				$("#majByDocp").html(value['fields']['modifiedby_id_friendlyname']);
				var desc = value['fields']['description'];
			
				//pour les saut de lignes
				i=desc.indexOf("\n");
				while (i >= 0) {
					desc=desc.replace("\n","<br>");
					i=desc.indexOf("\n");
				}

				$("#contentDoc").html(desc);
				$("#lienitopp").html("<a onclick=\"window.open('"+iTopDocCo_URL+value['key']+"')\">"+iTopDocCo_URL+value['key']+'</a>');
				
			});
			

			document.getElementById("connected").style.display = 'block';	

		}else{
	
			document.getElementById("form").style.display = 'block';	
			document.getElementById("client").value = '';
			document.getElementById('alertFormError').value = '';			
		}
		//stop chargement animation
		spinner.stop(spinner_div);
	}
}


/****
** APPEL AJAX
******/
/**
* 2
*appel ajax pour functionalIC
**/
function ajaxMultiDoc(){
	$.ajax({
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(oJSON)},
		crossDomain: 'true',
		success: function (data){
			refreshSuccessfullDocCo(data);
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";
						
		}
	});
}


/****
** REQUETES
******/	
function GetBacklogRequestDocCo(){
	// renvoi les bd et vm de dev du client 
	var request = 'SELECT doc FROM MultiDoc AS doc ';
	request = request + ' WHERE documenttype_name="Connexions Reflex WMS/TMS"';
	request = request + ' AND status!="Obsolète"';
	request = request + ' AND (org_name = "'+ nomOrg +'")';
	
	return request;
}


/**
**	FONCTIONS UTILES
**/

/**
* Retourne toutes les colonne de DatabaseCluster en string utile pour oJSON
**/
function GetWSColumnsAsStringDocCo()
{	
	//nom des colonnes qui nous interessent
	var col =  'name, description, documenttype_name, status, modifiedby_id_friendlyname';
	//var col =  'finalclass';
	col = col.trim();
	return col;
}

/**
* convertir les statut des doc
**/
function convertStatut(stat){
	var result;
	
	if(stat=="published")
		result = "Publié";
	else if(stat=="uncomplete")
		result = "Incomplet";
	else 
		result = "Brouillon"
	
	return result;
}






