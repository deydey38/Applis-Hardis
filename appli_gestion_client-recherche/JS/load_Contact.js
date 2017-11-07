var login		= '';
var pwd			= '';
var first		= true;	
var ITOP_URL	= 'https://itop.hardis.fr';
var ITOP_WS_URL	= ITOP_URL + "/webservices/rest.php?version=1.3";
var iTopCIUrl 	= 'https://itop.hardis.fr/pages/UI.php?operation=details&class=FunctionalCI&id=';
var iTopContactUrl 	= 'https://itop.hardis.fr/itop/pages/UI.php?operation=details&class=Person&id=';

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
function loadPageAfficheContact(){
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
			key: GetBacklogRequestContact(),
			output_fields: "friendlyname, email, phone, mobile_phone, site_name"
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
			contact = data["objects"];	
			refreshSuccessfullContact(data);			
			chargementPageContact();				
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";
						
		}
	});	
	
}


/****
** REQUETES
******/	
/**
* pour un objet de type Contact 
**/
function GetBacklogRequestContact(){
	var request = 'SELECT ctc ';
	request = request + ' FROM Contact AS ctc';
	request = request + ' WHERE org_name="'+ nomOrg +'"';
	request = request + ' AND ctc.status = "Active"';
	request = request + ' AND ctc.finalclass="Person"';

	return request;
}


/**
* Check si connecté ou pas a itop + affichage 
*/
function refreshSuccessfullContact(data){
	
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
						
			document.getElementById("connected").style.display = 'block';	
			
		}else{
	
			document.getElementById("form").style.display = 'block';	
			document.getElementById("client").value = '';
			document.getElementById('alertFormError').value = '';			
		}
	}
}

/**
* charge le contenu des tableaux
**/
function chargementPageContact(){
	//stop chargement animation
	spinner.stop(spinner_div);
	
	//vidage du tableau
	$("#table_contactC tbody").html(''); 					
	var tableContact = $("#table_contactC tbody:last");
	console.log(contact);	
	
	
	//affichage des contacts
	if(contact!=null){	

		//parcours de tout les contact
		$.each(contact, function(i, v){
			//creation d'une ligne + ajout au tableau
			var tr = document.createElement('tr');
			tableContact.append(tr);
			
			//creation d'un lien
			var a = document.createElement('a');
			a.href=iTopContactUrl+v['key'];
			a.target='_BLANK';
			a.innerHTML = v['fields']['friendlyname'];
			
			//création d'une céllule + ajout a la ligne + ajout du lien a la cellule  
			var tdName = document.createElement('td');			
			tr.append(tdName);
			tdName.append(a);
			
			//création d'une cellule + ajout après la cellule précédente
			var tdMatricule = document.createElement('td');
			tdMatricule.innerHTML = v['fields']['site_name'];	
			tdName.after(tdMatricule);
			
			//création d'une cellule + ajout après la cellule précédente
			var tdMail = document.createElement('td');
			tdMail.innerHTML = v['fields']['email'];	
			tdMatricule.after(tdMail);
			
			//création d'une cellule + ajout après la cellule précédente
			var tdTel = document.createElement('td');
			tdTel.innerHTML = v['fields']['phone'];	
			tdMail.after(tdTel);
			
			//création d'une cellule + ajout après la cellule précédente
			var tdTelP = document.createElement('td');
			tdTelP.innerHTML = v['fields']['mobile_phone'];	
			tdTel.after(tdTelP);
			
		});
		
	}else{
		var tr = document.createElement('tr');
		tableContact.append(tr);
				
		//création d'une céllule + ajout a la ligne  
		var td = document.createElement('td');
		td.innerHTML = "Il n'y a aucun contact";
		tr.append(td);
	}
		
}






