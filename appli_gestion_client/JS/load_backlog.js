var login = '';
var pwd = '';
var first = true;
var iTOP_TEAM_NAME_H2i_N2_iSeries 	= 'Support Niveau 2 Iseries';
var iTOP_TEAM_NAME_H2i_N2_Xseries 	= 'Support Niveau 2 Xseries';
var ITOP_URL 				= 'https://itop.hardis.fr';
var ITOP_WS_URL 			= ITOP_URL + "/webservices/rest.php?version=1.3";
var iTopTicketUrl 			= 'https://itop.hardis.fr/pages/UI.php?operation=details&class=UserRequest&id=';
var iTopPbUrl				= 'https://itop.hardis.fr/pages/UI.php?operation=details&class=Problem&id=';
var TICKET_URL_PID_HARDIS 	= 'http://www.hardis.fr/forward/bugredir.html?b=';
var urlBackLogList 			= 'https://itop.hardis.fr/pages/UI.php?operation=search&filter=YTozOntpOjA7czozMjM6IlNFTEVDVCB0aWNrZXQgRlJPTSBVc2VyUmVxdWVzdCBBUyB0aWNrZXQgSk9JTiBPcmdhbml6YXRpb24gQVMgT3JnYW5pemF0aW9uIE9OIHRpY2tldC5vcmdfaWQgPSBPcmdhbml6YXRpb24uaWQgSk9JTiBPcmdhbml6YXRpb24gQVMgb3JnRmlsbGVzIE9OIE9yZ2FuaXphdGlvbi5wYXJlbnRfaWQgQkVMT1cgb3JnRmlsbGVzLmlkIFdIRVJFICgoKGBvcmdGaWxsZXNgLmBpZGAgPSAnMzYwJykgQU5EIChgT3JnYW5pemF0aW9uYC5gaWRgICE9ICc0NTAnKSkgQU5EIChgdGlja2V0YC5gc3RhdHVzYCBOT1QgSU4gKCdjbG9zZWQnLCAncmVzb2x2ZWQnLCAncmVqZWN0ZWQnKSkpIjtpOjE7YTowOnt9aToyO2E6MDp7fX0%3D';
var urlIncidentBackLogList 	= 'https://itop.hardis.fr/pages/UI.php?operation=search&filter=YTozOntpOjA7czozNzE6IlNFTEVDVCB0aWNrZXQgRlJPTSBVc2VyUmVxdWVzdCBBUyB0aWNrZXQgSk9JTiBPcmdhbml6YXRpb24gQVMgT3JnYW5pemF0aW9uIE9OIHRpY2tldC5vcmdfaWQgPSBPcmdhbml6YXRpb24uaWQgSk9JTiBPcmdhbml6YXRpb24gQVMgb3JnRmlsbGVzIE9OIE9yZ2FuaXphdGlvbi5wYXJlbnRfaWQgQkVMT1cgb3JnRmlsbGVzLmlkIFdIRVJFICgoKChgb3JnRmlsbGVzYC5gaWRgID0gJzM2MCcpIEFORCAoYE9yZ2FuaXphdGlvbmAuYGlkYCAhPSAnNDUwJykpIEFORCAoYHRpY2tldGAuYHN0YXR1c2AgTk9UIElOICgnY2xvc2VkJywgJ3Jlc29sdmVkJywgJ3JlamVjdGVkJykpKSBBTkQgKGB0aWNrZXRgLmByZXF1ZXN0X3R5cGVgID0gOnJlcXVlc3RfdHlwZSkpIjtpOjE7YToxOntzOjEyOiJyZXF1ZXN0X3R5cGUiO3M6ODoiaW5jaWRlbnQiO31pOjI7YTowOnt9fQ%3D%3D';
var urlRequestBackLogList 	= 'https://itop.hardis.fr/pages/UI.php?operation=search&filter=YTozOntpOjA7czozNzE6IlNFTEVDVCB0aWNrZXQgRlJPTSBVc2VyUmVxdWVzdCBBUyB0aWNrZXQgSk9JTiBPcmdhbml6YXRpb24gQVMgT3JnYW5pemF0aW9uIE9OIHRpY2tldC5vcmdfaWQgPSBPcmdhbml6YXRpb24uaWQgSk9JTiBPcmdhbml6YXRpb24gQVMgb3JnRmlsbGVzIE9OIE9yZ2FuaXphdGlvbi5wYXJlbnRfaWQgQkVMT1cgb3JnRmlsbGVzLmlkIFdIRVJFICgoKChgb3JnRmlsbGVzYC5gaWRgID0gJzM2MCcpIEFORCAoYE9yZ2FuaXphdGlvbmAuYGlkYCAhPSAnNDUwJykpIEFORCAoYHRpY2tldGAuYHN0YXR1c2AgTk9UIElOICgnY2xvc2VkJywgJ3Jlc29sdmVkJywgJ3JlamVjdGVkJykpKSBBTkQgKGB0aWNrZXRgLmByZXF1ZXN0X3R5cGVgID0gOnJlcXVlc3RfdHlwZSkpIjtpOjE7YToxOntzOjEyOiJyZXF1ZXN0X3R5cGUiO3M6MTU6InNlcnZpY2VfcmVxdWVzdCI7fWk6MjthOjA6e319';
var IMG_PRIO_P3 			= 'https://pid.hardis.fr/jira/images/icons/priorities/minor.png';
var IMG_PRIO_P2 			= 'https://pid.hardis.fr/jira/images/icons/priorities/major.png';
var IMG_PRIO_P1 			= 'https://pid.hardis.fr/jira/images/icons/priorities/blocker.png';
var IMG_INCIDENT 			= 'https://pid.hardis.fr/jira/images/icons/issuetypes/bug.png';
var IMG_REQUEST 			= 'https://pid.hardis.fr/jira/images/icons/issuetypes/genericissue.png';

var ticketsDataClosed;

//chargement animation
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

//annimation chargement	
var spinner = null;
var spinner_div = 0;

//nb demande et incident
var nbTicketAT=0;
var nbTicketEAT=0;
var nbTicketF=0;
var nbDemandeTicketAT=0;
var nbIncidentTicketAT=0;
var nbDemandeTicketEAT=0;
var nbIncidentTicketEAT=0;
var nbDemande=0;
var nbDemandeHotline=0;
var nbDemandeRetD=0;
var nbDemandeTMA=0;
var nbDemandeH2i=0;
var nbDemandeAT=0;
var nbIncident=0;
var nbIncidentHotline=0;
var nbIncidentRetD=0;
var nbIncidentTMA=0;
var nbIncidentH2i=0;
var nbIncidentAT=0;
var nbtotal = 0;
var nbPb = 0;
var nbPbAT = 0;
var nbPbEA = 0;
var nbPbHotline = 0;
var nbPbRetD = 0;
var nbPbTMA = 0;
var nbPbH2i = 0;
var nbPb_AT = 0;
var nbTicketP1=0;
var	nbSLA=0;

//tableaux
var tabTicketAT;
var lesTicketsEnAtt;
var lesTicketsF;
var lesSla;
var lesAgents;


//json
var oJSON;
var xJSON;

//EXECUTION DE AJAXPROBLEM VERIF
var execPb =0;

/**
* fonction appelée au changement ou appui sur refresh donglet si jamais visité 
**/
function  loadPageAfficheBacklog(){	
	execPb =0;		
		
	$('#form select option:last-child').prop('selected',true);
	
	spinner_div = $('#spinner').get(0);
	if(spinner == null) {
	  spinner = new Spinner(opts).spin(spinner_div);
	} else {
	  spinner.spin(spinner_div);
	}
	
	// Json request
	oJSON = {
		operation: 'core/get',
		'class': 'UserRequest',
		key: GetBacklogRequest('UserRequest'),
		output_fields: GetWSColumnsAsString()+ ',request_type'
	};

	
	$.ajax({
		type: "POST",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(oJSON) },
		crossDomain: 'true',
		success: function (data) {
			console.log(data);
			console.log("ajax ticket ");
			console.log(data['objects']);		
			refreshSuccessfull(data);			
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

		}
	}
	);
	
}


/**
* REQUETES
**/

/**
 * Requete pour les userrequest ou problem (typeTicket) non fermés
 */
function GetBacklogRequest(typeTicket)
{
	var request = 'SELECT ticket ';
	request = request + ' FROM '+ typeTicket +' AS ticket JOIN Organization AS Organization ON ticket.org_id = Organization.id ';
	request = request + ' WHERE `Organization`.`name` = "'+ nomOrg +'" AND `ticket`.`status` NOT IN ("closed", "resolved", "rejected")';
	
	return request;
}


/**
 * Requete pour les userrequest ou problem (typeTicket) fermés 
 */
function GetBacklogRequestClose(interval, typeTicket)
{
	var request = 'SELECT ticket ';
	request = request + ' FROM '+ typeTicket +' AS ticket JOIN Organization AS Organization ON ticket.org_id = Organization.id ';
	request = request + ' WHERE `Organization`.`name` = "'+ nomOrg +'" AND `ticket`.`status` IN ("closed", "resolved", "rejected") ';
	request = request + ' AND (resolution_date >= DATE_SUB(NOW(), INTERVAL '+ interval +' MONTH) OR close_date >= DATE_SUB(NOW(), INTERVAL '+ interval +' MONTH) ) ';
	return request;
}


/**
 * Requete pour les userrequest ou problem (typeTicket) ouvert et fermé de priorité 1 ou SLA dépassé 
 */
function GetBacklogRequestP1SLA(interval, typeTicket){
	var request = 'SELECT ticket ';
	request = request + ' FROM '+ typeTicket +' AS ticket JOIN Organization AS Organization ON ticket.org_id = Organization.id ';
	request = request + ' WHERE `Organization`.`name` = "'+ nomOrg +'" AND (sla_respected=1 OR priority="2")';
	request = request + ' AND (start_date >= DATE_SUB(NOW(), INTERVAL '+ interval +' MONTH) OR resolution_date >= DATE_SUB(NOW(), INTERVAL '+ interval +' MONTH) OR close_date >= DATE_SUB(NOW(), INTERVAL '+ interval +' MONTH) ) ';
	return request;
}

/**
* Check connexion itop + affichage + appel ajax ticket fermés p1 et sla
*/
function refreshSuccessfull(data){
			
	// l'utilisateur n'est pas connecté
	if (data.code != 0)
	{
		//stop chargement animation
			spinner.stop(spinner_div);
			
		// Missing password
		// Open login form
		if (! first)
		{
			document.getElementById("errorMessage").innerHTML = data.message + ' ';							
		}
		
		first = false;
		
		$("#login").show();
		$("#connected").hide();
			
	}
	// l'utilisateur est connecté
	else
	{			
			
		document.getElementById("lastExtractDate").innerHTML = 'Extraction du ' + getCurrentDate();

		remplirTableauATEA(data['objects'], 1);
		remplirTableauCountInc();
		remplirTableauCountDem();
		
		//remplissage des valeur dans l'header
		nbtotal = nbTicketAT + nbTicketEAT;
		$('#ticketOuvert h2').html("");
		var str = nbtotal + " ticket(s) ouvert(s) dans iTOP";
		$('#ticketOuvert h2').html(str);
		
		//ticket a traiter
		$('#headerTicketAT h3').html("")
		var str = nbTicketAT + " ticket(s) à traiter:";
		$('#headerTicketAT h3').html(str);
		
		$('#headerTicketAT h3 + ul li:first-child').html("");
		var str = nbIncidentTicketAT + " incident(s)";
		$('#headerTicketAT h3 + ul li:first-child').html(str);
		
		
		$('#headerTicketAT h3 + ul li:last-child').html("");
		var str = nbDemandeTicketAT + " demande(s)";
		$('#headerTicketAT h3 + ul li:last-child').html(str);
		
		
		//ticket en attente
		
		$('#headerTicketEAT h3').html("");
		var str2 = nbTicketEAT + " ticket(s) en attente";
		$('#headerTicketEAT h3').html(str2);
		
		
		$('#headerTicketEAT h3 + ul li:first-child').html("");
		var str = nbIncidentTicketEAT + " incident(s)";
		$('#headerTicketEAT h3 + ul li:first-child').html(str);
		
		
		$('#headerTicketEAT h3 + ul li:last-child').html("");
		var str = nbDemandeTicketEAT + " demande(s)";
		$('#headerTicketEAT h3 + ul li:last-child').html(str);

		ajaxTicketFermePeriode(3, 'UserRequest');
		ajaxTicketP1SLAPeriode(3, 'UserRequest');
		ajaxProblem();	
		
		$("#connected").show();
				
	}
			
}

/**
* pour changer les tableaux en fonction de la periode sélectionnée
**/
function loadTabPeriode(){
	var interval;
	var periode = $("#periode option:selected").text();
	if(periode=="1 mois"){
		interval = 1;
	}else if(periode=="2 mois"){
		interval = 2;
	}else{
		interval = 3;
	}
	
	ajaxTicketFermePeriode(interval, 'UserRequest');
	ajaxTicketP1SLAPeriode(interval, 'UserRequest');
	ajaxTicketFermePeriode(interval, 'Problem');
	ajaxTicketP1SLAPeriode(interval, 'Problem');

}


/**
* REQUETES AJAX
**/

/**
* ajax problem
**/
function ajaxProblem(){
	nbPb=0;
	// Json request pour recupérer les tickets fermés
	xJSON = {
		operation: 'core/get',
		'class': 'Problem',
		key: GetBacklogRequest('Problem'),
		output_fields: GetWSColumnsAsString()
	};

	$.ajax(
	{
		type: "POST",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(xJSON) },
		crossDomain: 'true',
		success: function (data){
			if(execPb==0){
				execPb =1;
				console.log("LES PROBLEEEEEEMES");
				console.log(data);
				//nbUserRequest
				var nbUR = nbtotal;
				
				if(data['objects']!=null){
					nbPb= Object.keys(data['objects']).length;
					nbtotal+= nbPb;
				}
				
				$('#ticketOuvert h2').html("");
				$('#ticketOuvert h2').html(nbtotal+' ticket(s) ouvert(s) dans iTOP ('+ nbUR +' demande(s)/incident(s), '+ nbPb +' Problème(s))');
				
				remplirTableauATEA(data['objects'], 0);
				remplirTableauPb();
				ajaxTicketFermePeriode(3, 'Problem');
				ajaxTicketP1SLAPeriode(3, 'Problem');
			}
			
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";	
		}
	});
	
	
}

/**
* ajax ticket fermé / typeticket = userrequest ou problem
**/
function ajaxTicketFermePeriode(periode, typeTicket){
	spinner_div = $('#spinner').get(0);
	if(spinner == null) {
	  spinner = new Spinner(opts).spin(spinner_div);
	} else {
	  spinner.spin(spinner_div);
	}
			
	var outputF= GetWSColumnsAsString();

	if(typeTicket=='UserRequest')
		outputF+=',request_type' 
	// Json request pour recupérer les tickets fermés
	xJSON = {
		operation: 'core/get',
		'class': typeTicket,
		key: GetBacklogRequestClose(periode, typeTicket),
		output_fields: outputF
	};

	$.ajax(
	{
		type: "POST",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(xJSON) },
		crossDomain: 'true',
		success: function (data) {
			
			console.log(data);
			
			if(typeTicket=='UserRequest')
				remplirTableauTicketFerme(data['objects'], 1);
			else
				remplirTableauTicketFerme(data['objects'], 0);
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";	
		}
	});

}

/**
* ajax ticket p1 et sla / typeticket = userrequest ou problem
**/
function ajaxTicketP1SLAPeriode(periode, typeTicket){
	var outputF= GetWSColumnsAsString();

	if(typeTicket=='UserRequest')
		outputF+=',request_type' 
	
	// Json request pour recupérer les tickets fermés
	xJSON = {
		operation: 'core/get',
		'class': typeTicket,
		key: GetBacklogRequestP1SLA(periode, typeTicket),
		output_fields: outputF
	};

	$.ajax(
	{
		type: "POST",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(xJSON) },
		crossDomain: 'true',
		success: function (data) {	
			if(typeTicket=='UserRequest')
				remplirTableauTicketP1SLSA(data['objects'], 1);
			else 
				remplirTableauTicketP1SLSA(data['objects'], 0);

			if(typeTicket=='Problem')
				//stop chargement animation
				spinner.stop(spinner_div);
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";	
		}
	});
}


/******
// remplissage des tableaux
******/

function remplirTableauCountInc(){
	//vidage des tableaux
	var nbLignes = document.getElementById("tableRecapCountInc").rows.length; 
	//si tableau n'est pas vide
	if(nbLignes!=1){
		for(var i = 1; i < nbLignes; i++){
			document.getElementById('tableRecapCountInc').deleteRow(1);
		}
	}
	
	//modif du titre du tableau avec le total
	$('#tableRecapCountInc caption').text(""); 
	var str ='Incidents - total: '+ nbIncident;
	$('#tableRecapCountInc caption').html(str); 
	
	var str='<tr><td>'+ nomOrg +'</td>';
	str += '<td>'+ nbIncidentHotline +'';
	str += '<td>'+ nbIncidentTMA +'</td>';	
	str += '<td>'+ nbIncidentRetD +'</td>';	
	str += '<td>'+ nbIncidentH2i +'</td>';	
	str += '<td>'+ nbIncidentAT +'</td></tr>';	
	$("#tableRecapCountInc tbody:last").append(str);
}

function remplirTableauCountDem(){
	//vidage des tableaux
	var nbLignes = document.getElementById("tableRecapCountDem").rows.length; 
	//si tableau n'est pas vide
	if(nbLignes!=1){
		for(var i = 1; i < nbLignes; i++){
			document.getElementById('tableRecapCountDem').deleteRow(1);
		}
	}
	
	//modif du titre du tableau avec le total
	$('#tableRecapCountDem caption').text("");
	var str ='Demandes - total: '+ nbDemande;
	$('#tableRecapCountDem caption').html(str); 
	
	var str='<tr><td>'+ nomOrg +'</td>';
	str += '<td>'+ nbDemandeHotline +'';
	str += '<td>'+ nbDemandeTMA +'</td>';	
	str += '<td>'+ nbDemandeRetD +'</td>';	
	str += '<td>'+ nbDemandeH2i +'</td>';	
	str += '<td>'+ nbDemandeAT +'</td></tr>';	
	$("#tableRecapCountDem tbody:last").append(str);
}

function remplirTableauPb(){
	//vidage du tableaux
	$("#tableRecapCountProblem tbody").html(''); 
		
	//modif du titre du tableau avec le total
	$('#tableRecapCountProblem caption').text("");
	var str ='Problèmes - total: '+ nbPb;
	$('#tableRecapCountProblem caption').html(str); 
	
	var str='<tr><td>'+ nomOrg +'</td>';
	str += '<td>'+ nbPbHotline +'';
	str += '<td>'+ nbPbTMA +'</td>';	
	str += '<td>'+ nbPbRetD +'</td>';	
	str += '<td>'+ nbPbH2i +'</td>';	
	str += '<td>'+ nbPb_AT +'</td></tr>';	
	$("#tableRecapCountProblem tbody:last").append(str);
}


/***
* fonction replissage tableau a traiter et en attente / vidageTab = 1 pour vider les tableaux et nb
***/
function remplirTableauATEA(object, vidageTab){
	if(vidageTab==1){
		//vidage des tableaux
		$("#tableTicketEA tbody").html(''); 
		$("#tableTicketAT tbody").html(''); 

		//vidage des nb 
		nbTicketAT=0;
		nbDemandeHotline=0;
		nbIncidentHotline=0;
		nbDemandeRetD=0;
		nbIncidentRetD=0;
		nbDemandeTMA=0;
		nbIncidentTMA=0;
		nbDemandeH2i=0;
		nbIncidentH2i=0;
		nbDemandeAT=0;
		nbIncidentAT=0;
		nbDemande=0;
		nbIncident=0;
		nbDemandeTicketAT=0;
		nbTicketEAT=0;
		nbIncidentTicketAT=0;
		nbIncidentTicketEAT=0;
		nbDemandeTicketEAT=0;
	}	
	
	//vidage des nb pour les problemes
	nbPbAT=0;
	nbPbEA=0;
	nbPbHotline = 0;
	nbPbRetD = 0;
	nbPbTMA = 0;
	nbPbH2i = 0;
	nbPb_AT = 0;

	tabTicketAT= new Object;
	lesTicketsEnAtt = new Object();
	
	//lecture des ticket 
	$.each(object, function(index, value){
		var idTicket= value['key'];
		var statut=getStatusLabel(value['fields']['status']);
		var team = getTeamName(value['fields']);
		var rawTeam = value['fields']['team_name'];
		var datePlan = value['fields']['expected_request_date'];
		var typeTicket = getTypeTicketName(value['class']);
		var public_log = '';	
		var ref_itop= value['fields']['ref'];
		var titre= value['fields']['title'];
		var date_crea= value['fields']['start_date'];
		var dateMaj= value['fields']['last_update'];
		var agent = value['fields']['agent_id_friendlyname'];
		var serviceId = value['fields']['service_id'];
		if(agent==" /  ()")
			agent = "";
		
		//initialisation du commentaire	
		if(value['fields']['public_log']['entries'].length!=0){
			public_log = '<i>'+value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['date'] + '</i><br> ' + value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['user_login'] + ": "+ value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['message'];

			var id_pub_log= value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['user_login'] + value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['date'] +  value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['message'].substr(0, 5);
			id_pub_log= id_pub_log.replace(/ /g, "").replace(/-/g, "").replace(/:/g, "");
					
			//si le commentaire est trop long 
			if(public_log.length>87){
				 public_log=public_log.substr(0,87)+ '<br><div class="tooltip">Voir la suite<span class="tooltiptext">'+value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['message']+'</span></div>';		
			}
		
		}
		
		if(typeTicket=="Problème"){
			
			//incrementation des nb de demande pour chaque equipe pour les probleme
			if(team.startsWith('Hotline')){
				nbPbHotline++;
				var class_name = 'hotline';
			}else if(team=='R&D'){
				nbPbRetD++;
				var class_name = 'retd';
			}else if(team=='TMA'){
				nbPbTMA++;
				var class_name = 'tma';
			}else if(team.startsWith('Support')){
				nbPbH2i++;
				var class_name = 'h2i';
			}else if(team=='AT'){
				nbPb_AT++;
				var class_name = 'at';
			}
		}

		//remplissage du tableau ticket a traiter
		//le tiquet n'est pas en attente
		if(!statut.startsWith('En attente')){				
			nbTicketAT++;
			
			if(typeTicket=='Problème'){
				nbPbAT++;
			}
			
			tabTicketAT[nbTicketAT]= new Object;			
			
			if(value['fields']['request_type']=='service_request'){
				if(typeTicket!='Problème')
					typeTicket='Demande';
				nbDemande++;
				nbDemandeTicketAT++;
				
				//incrementation des nb de demande pour chaque equipe
				if(team.startsWith('Hotline')){
					nbDemandeHotline++;
					var class_name = 'hotline';
				}else if(team=='R&D'){
					nbDemandeRetD++;
					var class_name = 'retd';
				}else if(team=='TMA'){
					nbDemandeTMA++;
					var class_name = 'tma';
				}else if(team.startsWith('Support')){
					nbDemandeH2i++;
					var class_name = 'h2i';
				}else if(team=='AT'){
					nbDemandeAT++;
					var class_name = 'at';
				}
				
				var type ='<img src="'+IMG_REQUEST+'" alt="Demande" />';
				
			}else{
				if(typeTicket!='Problème')
					typeTicket='Incident';
				nbIncident++;
				nbIncidentTicketAT++;
				
				//incrementation des nb d'incident pour chaque equipe
				if(team.startsWith('Hotline')){
					nbIncidentHotline++;
					var class_name = 'hotline';
				}else if(team=='R&D'){
					nbIncidentRetD++;
					var class_name = 'retd';
				}else if(team=='TMA'){
					nbIncidentTMA++;
					var class_name = 'tma';
				}else if(team.startsWith('Support')){
					nbIncidentH2i++;
					var class_name = 'h2i';
				}else if(team=='AT'){
					nbIncidentAT++;
					var class_name = 'at';
				}

				var type='<img src="'+IMG_INCIDENT+'" alt="Incident" />';
			
			}
			
			//remplissage du tableau temporaire
			tabTicketAT[nbTicketAT]['id']=idTicket;
			tabTicketAT[nbTicketAT]['prio']=value['fields']['priority'];
			tabTicketAT[nbTicketAT]['type']=type;
			tabTicketAT[nbTicketAT]['statut']=statut;
			tabTicketAT[nbTicketAT]['refitop']=ref_itop;
			tabTicketAT[nbTicketAT]['titre']=titre;
			tabTicketAT[nbTicketAT]['datecrea']=date_crea;
			tabTicketAT[nbTicketAT]['dateMaj']=dateMaj;
			tabTicketAT[nbTicketAT]['team']=team;
			tabTicketAT[nbTicketAT]['rawTeam']=rawTeam;
			tabTicketAT[nbTicketAT]['agent']=agent;
			tabTicketAT[nbTicketAT]['serviceId']=serviceId;
			tabTicketAT[nbTicketAT]['datePlan']=datePlan;
			tabTicketAT[nbTicketAT]['public_log']=public_log;
			tabTicketAT[nbTicketAT]['typeTicket']=typeTicket;

		}
		//le tiquet est en attente
		else{
			nbTicketEAT++;
			lesTicketsEnAtt[nbTicketEAT]= new Object();
			
			if(typeTicket=='Problème'){
				nbPbEA++;
			}
			//cest une demande
			if(value['fields']['request_type']=='service_request'){
				if(typeTicket!='Problème')
					typeTicket='Demande';
				nbDemande++;
				nbDemandeTicketEAT++;
				if(team.startsWith('Hotline')){
					nbDemandeHotline++;
					var class_name = 'hotline';
				}else if(team=='R&D'){
					nbDemandeRetD++;
					var class_name = 'retd';
				}else if(team=='TMA'){
					nbDemandeTMA++;
					var class_name = 'tma';
				}else if(team.startsWith('Support')){
					nbDemandeH2i++;
					var class_name = 'h2i';
				}else if(team=='AT'){
					nbDemandeAT++;
					var class_name = 'at';
				}
				
				type ='<img src="'+IMG_REQUEST+'" alt="Demande" />';
			}
			//cest un incident
			else{
				if(typeTicket!='Problème')
					typeTicket='Incident';
				nbIncident++;
				nbIncidentTicketEAT++;
				if(team.startsWith('Hotline')){
					nbIncidentHotline++;
					var class_name = 'hotline';
				}else if(team=='R&D'){
					nbIncidentRetD++;
					var class_name = 'retd';
				}else if(team=='TMA'){
					nbIncidentTMA++;
					var class_name = 'tma';
				}else if(team.startsWith('Support')){
					nbIncidentH2i++;
					var class_name = 'h2i';
				}else if(team=='AT'){
					nbIncidentAT++;
					var class_name = 'at';
				}
				
				type='<img src="'+IMG_INCIDENT+'" alt="Incident" />';
			}
			
			//remplissage du tableau temporaire
			lesTicketsEnAtt[nbTicketEAT]['id']=idTicket;
			lesTicketsEnAtt[nbTicketEAT]['prio']=value['fields']['priority'];
			lesTicketsEnAtt[nbTicketEAT]['type']=type;
			lesTicketsEnAtt[nbTicketEAT]['statut']=statut;
			lesTicketsEnAtt[nbTicketEAT]['refitop']=ref_itop;
			lesTicketsEnAtt[nbTicketEAT]['titre']=titre;
			lesTicketsEnAtt[nbTicketEAT]['datecrea']=date_crea;
			lesTicketsEnAtt[nbTicketEAT]['dateMaj']=dateMaj;
			lesTicketsEnAtt[nbTicketEAT]['team']=team;
			lesTicketsEnAtt[nbTicketEAT]['rawTeam']=rawTeam;
			lesTicketsEnAtt[nbTicketEAT]['agent']=agent;
			lesTicketsEnAtt[nbTicketEAT]['serviceId']=serviceId;
			lesTicketsEnAtt[nbTicketEAT]['datePlan']=datePlan;
			lesTicketsEnAtt[nbTicketEAT]['public_log']=public_log;
			lesTicketsEnAtt[nbTicketEAT]['typeTicket']=typeTicket;
			
		}
	});
	
	//remplissage nb probleme 
	$('#headerPbAT h3').html("");
	$('#headerPbAT h3').html(nbPbAT+" problème(s) à traiter");
	
	$('#headerPbEAT h3').html("");
	$('#headerPbEAT h3').html(nbPbEA+" problème(s) en attente");
	
	//tiquet a traiter
	//modif du titre du tableau avec le total
	$('#tableTicketAT caption').text("");
	var str ='Liste des tickets à traiter - total: '+ nbTicketAT;
	$('#tableTicketAT caption').html(str); 	
	
	//tiquet en attente
	//modif du titre du tableau avec le total
	$('#tableTicketEA caption').text("");
	var str ='Liste des tickets en attente - total: '+ nbTicketEAT;
	$('#tableTicketEA caption').html(str);

	
	//tri et remplissage des tableaux
	//ticket a traiter
	reIndexage(tabTicketAT);
	triTabBy('prio', tabTicketAT);
	$.each(tabTicketAT, function(index, value){
		if(value['team'].startsWith('Hotline')){
			var class_name = 'hotline';
		}else if(value['team']=='R&D'){
			var class_name = 'retd';
		}else if(value['team']=='TMA'){
			var class_name = 'tma';
		}else if(value['team']=='H2i'){
			var class_name = 'h2i';
		}else if(value['team']=='AT'){
			var class_name = 'at';
		}
				
		if(value['prio']== '4'){
			var prio = '<img src="'+IMG_PRIO_P3+'" alt="Priorité 3" />';
		}
		else if(value['prio']== '3'){
			var prio= '<img src="'+IMG_PRIO_P2+'" alt="Priorité 2" />';
		}else{
			var prio= '<img src="'+IMG_PRIO_P1+'" alt="Priorité 1" />';
		}
			
		var str='<tr><td>'+value['typeTicket']+'</td>';
		str += '<td>'+ prio +'</td>';
		str += '<td>'+ value['type'] +'</td>';
		str += '<td>'+ value['statut'] +'</td>';
		if(value['typeTicket']=='Problème'){
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td id='titre"+value['id']+"'><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}else{
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td id='titre"+value['id']+"'><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}
		
		str += '<td>'+ value['datecrea'] +'</td>';
		str += "<td class='"+ class_name +"'>"+ value['team'] +'</td>';
		str += '<td>'+ value['agent'] +'</td>';
		str += '<td>'+ value['public_log'] +'</td></tr>';
		$("#tableTicketAT tbody:last").append(str);	
	});
	
	//ticket en attente
	triTabBy('prio', lesTicketsEnAtt);
	$.each(lesTicketsEnAtt, function(index, value){
		if(value['team'].startsWith('Hotline')){
			var class_name = 'hotline';
		}else if(value['team']=='R&D'){
			var class_name = 'retd';
		}else if(value['team']=='TMA'){
			var class_name = 'tma';
		}else if(value['team'].startsWith('Support')){
			var class_name = 'h2i';
		}else if(value['team']=='AT'){
			var class_name = 'at';
		}
				
		if(value['prio']== '4'){
			var prio = '<img src="'+IMG_PRIO_P3+'" alt="Priorité 3" />';
		}
		else if(value['prio']== '3'){
			var prio= '<img src="'+IMG_PRIO_P2+'" alt="Priorité 2" />';
		}else{
			var prio= '<img src="'+IMG_PRIO_P1+'" alt="Priorité 1" />';
		}
			
		var str='<tr><td>'+value['typeTicket']+'</td>';
		str+= '<td>'+ prio +'</td>';
		str += '<td>'+ value['type'] +'</td>';
		str += '<td>'+ value['statut'] +'</td>';
		if(value['typeTicket']=='Problème'){
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td id='titre"+value['id']+"'><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}else{
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td id='titre"+value['id']+"'><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';		
		}

		str += '<td>'+ value['datecrea'] +'</td>';
		str += "<td class='"+ class_name +"'>"+ value['team'] +'</td>';
		str += '<td>'+ value['agent'] +'</td>';
		str += '<td>'+ value['public_log'] +'</td></tr>';
		$("#tableTicketEA tbody:last").append(str);	
	});	
}

/*
* fonction de remplissage du tableau des ticket fermé, vidageTab = 1 pour vider le tableau + nbticketF
/*/
function remplirTableauTicketFerme(object, vidageTab){
	if(vidageTab==1){
		$("#tableTicketF tbody").html('');
		nbTicketF=0;
	}
		
	lesTicketsF = new Object();
	var statutf;
	$.each(object, function(index, value){
		nbTicketF++;
		lesTicketsF[nbTicketF] = new Object();
		
		var typeTicket = getTypeTicketName(value['class']);		
		var idTicket= value['key'];
		var team = getTeamName(value['fields']);
		var rawTeam = value['fields']['team_name'];		
		var ref_itop= value['fields']['ref'];
		var titre = value['fields']['title'];
		var date_crea= value['fields']['start_date'];
		var dateMaj= value['fields']['last_update'];
		var agent = value['fields']['agent_id_friendlyname'];
		statutf = getStatusLabel(value['fields']['status']);
		var serviceId = value['fields']['service_id'];
		if(value['fields']['close_date']!=""){
			var date_ferm= value['fields']['close_date'];
		}else{
			var date_ferm= value['fields']['resolution_date'];
		}
		
		var public_log = '';
		
		if(value['fields']['public_log']['entries'].length!=0){
			public_log = '<i>'+value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['date'] + '</i><br> ' + value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['user_login'] + ": "+ value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['message'];

			var id_pub_log= value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['user_login'] + value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['date'] +  value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['message'].substr(0, 5);
			id_pub_log= id_pub_log.replace(/ /g, "").replace(/-/g, "").replace(/:/g, "");
					
			//si le commentaire est trop long 
			if(public_log.length>87){
				 public_log=public_log.substr(0,87)+ '<br><div class="tooltip">Voir la suite<span class="tooltiptext">'+value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['message']+'</span></div>';		
			}
		
		}
		if(value['fields']['request_type']=='service_request'){
			if(typeTicket!='Problème')
				typeTicket='Demande';
			if(team.startsWith('Hotline')){
				var class_name = 'hotline';
			}else if(team=='R&D'){
				var class_name = 'retd';
			}else if(team=='TMA'){
				var class_name = 'tma';
			}else if(team.startsWith('Support')){
				var class_name = 'h2i';
			}else if(team=='AT'){
				nbDemandeAT++;
				var class_name = 'at';
			}
			
			type ='<img src="'+IMG_REQUEST+'" alt="Demande" />';
		}else if(value['fields']['request_type']!='service_request'){
			if(typeTicket!='Problème')
				typeTicket='Incident';
			if(team.startsWith('Hotline')){
				var class_name = 'hotline';
			}else if(team=='R&D'){
				var class_name = 'retd';
			}else if(team=='TMA'){
				var class_name = 'tma';
			}else if(team.startsWith('Support')){
				var class_name = 'h2i';
			}else if(team=='AT'){
				var class_name = 'at';
			}
			
			type='<img src="'+IMG_INCIDENT+'" alt="Incident" />';
		}
		
		//remplissage du tableau temporaire
		lesTicketsF[nbTicketF]['id']=idTicket;
		lesTicketsF[nbTicketF]['type']=type;
		lesTicketsF[nbTicketF]['refitop']=ref_itop;
		lesTicketsF[nbTicketF]['titre']=titre;
		lesTicketsF[nbTicketF]['datecrea']=date_crea;
		lesTicketsF[nbTicketF]['dateMaj']=dateMaj;
		lesTicketsF[nbTicketF]['dateferm']=date_ferm;
		lesTicketsF[nbTicketF]['team']=team;
		lesTicketsF[nbTicketF]['rawTeam']=rawTeam;
		lesTicketsF[nbTicketF]['agent']=agent;
		lesTicketsF[nbTicketF]['public_log']=public_log;
		lesTicketsF[nbTicketF]['serviceId']=serviceId;
		lesTicketsF[nbTicketF]['statut']=statutf;
		lesTicketsF[nbTicketF]['typeTicket']= typeTicket;

	});
	
	//modif du titre du tableau avec le total
	if(typeof nbTicketF === 'undefined')
		nbTicketF=0;
	var str = ' Liste des tickets fermés/résolus/rejetés sur la période - total: '+ nbTicketF;
	$('#tableTicketF caption').html(str); 
	
	//tri est remplissage des tableaux
	//ticket a traiter
	triTabBy('dateferm', lesTicketsF);
	$.each(lesTicketsF, function(index, value){
		if(value['team'].startsWith('Hotline')){
			var class_name = 'hotline';
		}else if(value['team']=='R&D'){
			var class_name = 'retd';
		}else if(value['team']=='TMA'){
			var class_name = 'tma';
		}else if(value['team'].startsWith('Support')){
			var class_name = 'h2i';
		}else if(value['team']=='AT'){
			var class_name = 'at';
		}
			
		var str = '<tr><td>'+value['typeTicket']+'</td>';
		str += '<td>'+ value['type'] +'</td>';
		if(value['typeTicket']=='Problème'){
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			//remplacer ' dans titre sinon probleme !!!!!!!!!!!!!!!!!!!!!!!!
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['titre'].replace(/'/g, " ") +'</a></td>';
		}else{
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			//remplacer ' dans titre sinon probleme !!!!!!!!!!!!!!!!!!!!!!!!
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['titre'].replace(/'/g, " ") +'</a></td>';
		}

		
		str += '<td>'+ value['datecrea'] +'</td>';
		str += '<td>'+ value['dateferm'] +'</td>';
		str += "<td class='"+ class_name +"'>"+ value['team'] +'</td>';
		str += '<td>'+ value['agent'] +'</td>';
		str += '<td>'+ value['public_log'] +'</td></tr>';
		
		$("#tableTicketF tbody:last").append(str);	
	});
}


/*
* fonction de remplissage tableau ticket P1 et SLA, vidageTab= 1 pour vider les tableau + nbticket
*/
function remplirTableauTicketP1SLSA(object, vidageTab){
	
	if(vidageTab==1){
		//vidage des tableaux
		//tableau P1
		$("#tableTicketP1 tbody").html(''); 

		//clear titre 
		var str = ' Liste des tickets P1 sur la période - total: 0';
		$('#tableTicketP1 caption').html(str); 

		//tableau SLA
		$("#tableSLA tbody").html(''); 
		
		//clear titre
		var str = ' Liste des SLA dépassées sur la période - total: 0';
		$('#tableSLA caption').html(str); 
		
		nbTicketP1=0;
		nbSLA=0;
	}
	


	lesSla= new Object();
	$.each(object, function(index, value){
		var typeTicket = getTypeTicketName(value['class']);		
		var idTicket= value['key'];
		var team = getTeamName(value['fields']);		
		var ref_itop= value['fields']['ref'];
		var titre = value['fields']['title'];
		var date_crea= value['fields']['start_date'];

		if(value['fields']['close_date']!=""){
			var date_ferm= value['fields']['close_date'];
		}else{
			var date_ferm= value['fields']['resolution_date'];
		}
		
		var public_log = '';
	
		if(value['fields']['public_log']['entries'].length!=0){
			public_log = '<i>'+value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['date'] + '</i><br> ' + value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['user_login'] + ": "+ value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['message'];

			var id_pub_log= value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['user_login'] + value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['date'] +  value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['message'].substr(0, 5);
			id_pub_log= id_pub_log.replace(/ /g, "").replace(/-/g, "").replace(/:/g, "");
					
			//si le commentaire est trop long 
			if(public_log.length>87){
				 public_log=public_log.substr(0,87)+ '<br><div class="tooltip">Voir la suite<span class="tooltiptext">'+value['fields']['public_log']['entries'][value['fields']['public_log']['entries'].length-1]['message']+'</span></div>';		
			}
		
		}

		if(typeTicket!='Problème'){
			if(value['fields']['request_type']=='service_request'){
				typeTicket='Demande';
			}else if(value['fields']['request_type']!='service_request'){
				typeTicket='Incident';
			}
		}
			
		//remplissage du tableau P1
		if(value['fields']['priority'] == "2"){				
			nbTicketP1++;		
			if(team.startsWith('Hotline')){
				var class_name = 'hotline';
			}else if(team=='R&D'){
				var class_name = 'retd';
			}else if(team=='TMA'){
				var class_name = 'tma';
			}else if(team.startsWith('Support')){
				var class_name = 'h2i';
			}else if(team=='AT'){
				var class_name = 'at';
			}
			
			var str = '<tr><td>'+ typeTicket+'</td>'
			if(typeTicket=='Problème'){
				str += "<td><a href='"+ iTopPbUrl + idTicket +"' target='_blank'>"+ ref_itop +'</a></td>';
				str += "<td><a href='"+ iTopPbUrl + idTicket +"' target='_blank'>"+ titre +'</a></td>';
			}else{
				str += "<td><a href='"+ iTopTicketUrl + idTicket +"' target='_blank'>"+ ref_itop +'</a></td>';
				str += "<td><a href='"+ iTopTicketUrl + idTicket +"' target='_blank'>"+ titre +'</a></td>';
			}

			str += '<td>'+ date_crea +'</td>';
			str += '<td>'+ date_ferm +'</td>';
			str += "<td class='"+ class_name +"'>"+ team +'</td>';
			str += '<td>'+ public_log +'</td></tr>';	
			$("#tableTicketP1 tbody:last").append(str);	
				
			//modif du titre du tableau avec le total
			if(typeof nbTicketP1==='undefined')
				nbTicketP1=0;
			var str = ' Liste des tickets P1 sur la période - total: '+ nbTicketP1;
			$('#tableTicketP1 caption').html(str); 

		}
		//remplissage du tableau ticket SLA dépassée
		else if(value['fields']['sla_respected'] == "oui"){
			nbSLA++;	
			lesSla[nbSLA]= new Object();
			var sla = value['fields']['sla_overdue'];
			if(typeof nbSLA==='undefined')
				nbSLA=0;
			//modif du titre du tableau avec le total
			var str = ' Liste des SLA dépassées sur la période - total: '+ nbSLA;
			$('#tableSLA caption').html(str); 
			
			lesSla[nbSLA]['id']=idTicket;
			lesSla[nbSLA]['refitop']=ref_itop;
			lesSla[nbSLA]['titre']=titre;
			lesSla[nbSLA]['datecrea']=date_crea;
			lesSla[nbSLA]['dateferm']=date_ferm;
			lesSla[nbSLA]['team']=team;
			lesSla[nbSLA]['public_log']=public_log;
			lesSla[nbSLA]['sla']=sla;
			lesSla[nbSLA]['typeTicket']=typeTicket;
			
		}
	});	

	//tri est remplissage des tableaux
	//ticket a traiter
	triTabBy('sla', lesSla);
	$.each(lesSla, function(index, value){
		
		if(value['team'].startsWith('Hotline')){
			var class_name = 'hotline';
		}else if(value['team']=='R&D'){
			var class_name = 'retd';
		}else if(value['team']=='TMA'){
			var class_name = 'tma';
		}else if(value['team'].startsWith('Support')){
			var class_name = 'h2i';
		}else if(value['team']=='AT'){
			var class_name = 'at';
		}
		
		
		var jourSla = Math.floor(value['sla'] / 86400);
		var heureSla = Math.floor((value['sla']  % 86400)/3600);
		var minSla = Math.floor((value['sla']  % 3600)/60);
		var secSla = Math.floor(value['sla']  % 60);
		
		var slaTime = jourSla+ " jour(s) " + heureSla +"h "+ minSla+ "min "+ secSla+ "sec";

		var str = '<tr><td>'+value['typeTicket']+'</td>'
		if(value['typeTicket']=='Problème'){
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}else{
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}

		str += '<td>'+ value['datecrea'] +'</td>';
		str += '<td>'+ value['dateferm'] +'</td>';
		str += "<td class='"+ class_name +"'>"+ value['team'] +'</td>';
		str += '<td>'+ value['public_log'] +'</td>';	
		str += '<td>'+ slaTime +'</td></tr>';	
		$("#tableSLA tbody:last").append(str);	
	});	
	
	//add border
	if(nbTicketP1>=nbSLA){
		$('#ticketP1').css('border-right', '1px dotted black');
	}else if(nbTicketP1< nbSLA){
		$('#SLA').css('border-left', '1px dotted black');
	}
	
}



/**
* FONCTION UTILE
**/

/**
 * Return Web Service columns in a string
 */
function GetWSColumnsAsString()
{	
	var col = 'ref, org_id, org_name, team_id, team_name, agent_id, agent_id_friendlyname, agent_name, site_id, site_name, title, start_date, end_date, last_update, close_date, resolution_date, closedby_id, ticket_status, status, impact, priority, resolvedby_id, service_id, service_name, service_provider_name, serviceelement_id, serviceelement_name, solution, resolutioncode_id, resolutioncode_name, ref_ticket_customer, ref_ticket_bug, url_ticket_bug, sla_overdue, sla_respected, public_log, private_log, expected_request_date';
	col = col.trim();
	return col;
}

/**
* fonction de tri de tableau en fonction de byWhat 
**/
function triTabBy(byWhat, tab){
	var i ,j ,tmp;
 
    for(j=1;j<getSizeTabIndex(tab);j++){
        for(i=1;i<getSizeTabIndex(tab);i++){			
            if(tab[i] && (tab[i][byWhat] > tab[i+1][byWhat])){
                tmp = tab[i];
                tab[i] = tab[i+1];
                tab[i+1] = tmp;
            }
        }
    }
}

/**
* get type tiquet en français
**/
function getTypeTicketName(tt){
	var typeT="";
	
	if(tt=="UserRequest")
		typeT="Demande du client";
	else 
		typeT="Problème";
	
	return typeT;
}

/**
* date JJ/MM/AAAA HH:MM:SS
**/
function getCurrentDate(){
	var now = new Date();	
	var aaaa = now.getFullYear();	
	var mm = now.getMonth() + 1;
	if (mm < 10)
		mm = '0' + mm;		 
	var dd = now.getDate();
	if (dd < 10)
		dd = '0' + dd;	
	var hh   = now.getHours();
	if (hh < 10)
		hh = '0' + hh;	
	var min  = now.getMinutes();
	if (min < 10)
		min = '0' + min;	
	var ss = now.getSeconds();
	if (ss < 10)
		ss = '0' + ss;	
	return dd + '/' + mm + '/' + aaaa + ' ' + hh + ':' + min + ':' + ss;	
}

/**
* get statut français
**/
function getStatusLabel(value)
{
	if (value == 'assigned')
		return 'Assigné agent';
	else if (value == 'pending_customer')
		return 'En attente client';
	else if (value == 'pending_internal')
		return 'En attente interne';
	else if (value == 'pending_bugfix')
		return 'En attente correction';
	else if (value == 'pending_planed')
		return 'En attente planifiée';
	else if (value == 'waiting_for_approval')
		return 'En attente d\'approbation';
	else if (value == 'new')
		return 'Nouveau';
	else if (value == 'assigned_team')
		return 'Assigné équipe';
	else if (value == 'resolved')
		return 'Résolu';
	else if (value == 'closed')
		return 'Fermé';
	else if (value == 'work_in_progress' || value == 'workinprogress')
		return 'Travail en cours';
	else if (value == 'approuved')
		return 'Approuvé';
		
	return value;
}

/**
* get correspondance team
**/
function getTeamName(fields){
	var team_name;

	if (fields['status'] == 'pending_bugfix' && fields['ref_ticket_bug'] != '' && (fields['ref_ticket_bug'].startsWith('WRD') || fields['ref_ticket_bug'].startsWith('RD-'))){
		team_name = 'R&D';
	}else if (fields['team_name'] == 'Reflex CDS FM' || fields['team_name'] == 'Reflex WMS TMA'){
		team_name = 'TMA';
	}else if (fields['team_name'] == 'Reflex WMS N1'){
		team_name = 'Hotline N1';
	}else if(fields['team_name'] == 'Reflex WMS N2'){
		team_name = 'Hotline N2';
	}//h2i
	else if (fields['team_name'] == 'Support Niveau 1' ){
		team_name = 'Support Niveau 1';
	}//h2i
	else if( fields['team_name'] == 'Support Niveau 2 Iseries' || fields['team_name'] == 'Support Niveau 2 Xseries'){
		team_name = 'Support Niveau 2';
	}else if(fields['team_name'] == 'Reflex AT'){
		team_name = 'AT';		
	}else
		team_name = fields['team_name'];

	return team_name;
}

/**
* get taille arr
**/
function getSizeTabIndex(arr){
    var size = 0;
    for (var key in arr) 
    {
        if (arr.hasOwnProperty(key)) size++;
    }
    return size;
}

/**
* reindexage avec int de tab
**/
function reIndexage(tab){
	var newTab = new Object();
	var i =0;
	
    $.each(tab, function(ind, val){		
		newTab[i]=val;	
		i++;
    });
	return newTab;
}