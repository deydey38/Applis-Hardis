var login = '';
var pwd = '';
var first = true;
var ITOP_URL 				= 'https://itop.hardis.fr';
var ITOP_WS_URL 			= ITOP_URL + "/webservices/rest.php?version=1.3";
var iTopTicketUrl 			= 'https://itop.hardis.fr/pages/UI.php?operation=details&class=UserRequest&id=';
var iTopPbUrl 				= 'https://itop.hardis.fr/pages/UI.php?operation=details&class=Problemt&id=';
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
var nbtotal = 0;
var nbPb = 0;
var nbPbAT = 0;
var nbPbEA = 0;
var nbTicketP1=0;
var	nbSLA=0;

//tableaux
var tabTicketAT;
var lesTicketsEnAtt;
var lesTicketsF;
var lesSla;

//json
var oJSON;
var xJSON;
var fJSON;

//EXECUTION DE AJAXPROBLEM VERIF
var execPb =0;

/**
* fonction appelée au changement ou appui sur refresh donglet si jamais visité
**/
function loadBacklog(){
	execPb =0;
	$('#form select option:first-child').prop('selected',true);

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
		output_fields: GetWSColumnsAsString()
	};


	$.ajax({
		type: "POST",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(oJSON) },
		crossDomain: 'true',
		success: function (data) {
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
 * Requete pour les tickets non fermés
 */
function GetBacklogRequest(typeTicket)
{
	var request = 'SELECT ticket ';
	request = request + ' FROM '+ typeTicket +' AS ticket JOIN Organization AS Organization ON ticket.org_id = Organization.id ';
	request = request + ' WHERE  `ticket`.`status` NOT IN ("closed", "resolved", "rejected")';
	request = request + ' AND  `ticket`.agent_id='+idCollabo;

	return request;
}


/**
 * Requete pour les tickets fermés
 */
function GetBacklogRequestClose(interval, typeTicket)
{
	var request = 'SELECT ticket ';
	request = request + ' FROM '+typeTicket+' AS ticket JOIN Organization AS Organization ON ticket.org_id = Organization.id ';
	request = request + ' WHERE `ticket`.`status` IN ("closed", "resolved", "rejected") ';
	request = request + ' AND (resolution_date >= DATE_SUB(NOW(), INTERVAL '+ interval +' MONTH) OR close_date >= DATE_SUB(NOW(), INTERVAL '+ interval +' MONTH) ) ';
	request = request + ' AND  `ticket`.agent_id='+idCollabo;
	return request;
}

/**
 * Requete pour les tickets ouvert et fermé de priorité 1 ou SLA dépassé
 */
function GetBacklogRequestP1SLA(interval, typeTicket){
	var request = 'SELECT ticket ';
	request = request + ' FROM '+typeTicket+' AS ticket JOIN Organization AS Organization ON ticket.org_id = Organization.id ';
	request = request + ' WHERE (sla_respected=1 OR priority="2")';
	request = request + ' AND (start_date >= DATE_SUB(NOW(), INTERVAL '+ interval +' MONTH) OR resolution_date >= DATE_SUB(NOW(), INTERVAL '+ interval +' MONTH) OR close_date >= DATE_SUB(NOW(), INTERVAL '+ interval +' MONTH) ) ';
	request = request + ' AND  `ticket`.agent_id='+idCollabo;

	return request;
}

/**
 * Requete pour les tickets ouvert de priorité 1
 */
function GetBacklogRequestP1(typeTicket){
	var request = 'SELECT ticket ';
	request = request + ' FROM '+typeTicket+' AS ticket JOIN Organization AS Organization ON ticket.org_id = Organization.id ';
	request = request + ' WHERE priority="2"';
	request = request + ' AND `ticket`.`status` NOT IN ("closed", "resolved", "rejected")';
	request = request + ' AND  `ticket`.agent_id='+idCollabo;

	return request;
}


/**
* Check connexion itop + affichage + appel ajax ticket fermés p1 et sla
*/
function refreshSuccessfull(data){

	console.log(data);

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


		ajaxTicketP1('UserRequest');
		ajaxTicketFermePeriode(3, 'UserRequest');
		ajaxTicketP1SLAPeriode(3, 'UserRequest');
		ajaxProblem();


		$("#connected").show();

	}

}

/**
* pour changer les tableau en fonction de la periode sélectionnée
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
* APPELS AJAX
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
				remplirTableauCountIncDem();
				ajaxTicketFermePeriode(3, 'Problem');
				ajaxTicketP1SLAPeriode(3, 'Problem');
			}

		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";
		}
	});


}

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

			console.log('T FER');
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


function ajaxTicketP1(typeTicket){
	console.log("ajax P1");

	var outputF= GetWSColumnsAsString();
	if(typeTicket=='UserRequest')
		outputF+=',request_type'

	// Json request pour recupérer les tickets fermés
	fJSON = {
		operation: 'core/get',
		'class': typeTicket,
		key: GetBacklogRequestP1(),
		output_fields: outputF
	};

	$.ajax(
	{
		type: "POST",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(fJSON) },
		crossDomain: 'true',
		success: function (data) {
			console.log("ajax ticket P1");
			console.log(data['objects']);
			if(typeTicket=='UserRequest')
				remplirTableauTicketP1(data['objects'], 1);
			else
				remplirTableauTicketP1(data['objects'], 0);
		},
		error: function (data) {
			console.log("ERROR P1");
			document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";
		}
	});

}


/******
// remplissage des tableaux
******/

function remplirTableauCountIncDem(){

	// vidage du tableau
	$("#tableRecapCountIncDem tbody").html('');


	// modif du titre du tableau avec le total
	var nbtotal= nbTicketAT+ nbTicketEAT;

	$('#tableRecapCountIncDem caption').text("");
	var str = 'Tickets - total: '+ nbtotal;
	$('#tableRecapCountIncDem caption').html(str);

	var str='<tr>';
	str += '<td>'+ nbIncident +'</td>';
	str += '<td>'+ nbDemande +'</td>';
	str += '<td>'+ nbPb+'</td></tr>';
	$("#tableRecapCountIncDem tbody:last").append(str);

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
		nbDemande=0;
		nbIncident=0;
		nbDemandeTicketAT=0;
		nbTicketEAT=0;
		nbIncidentTicketAT=0;
		nbIncidentTicketEAT=0;
		nbDemandeTicketEAT=0;
	}

	//vidage des nb pour les probleme
	nbPbAT=0;
	nbPbEA=0;

	tabTicketAT= new Object;
	lesTicketsEnAtt = new Object();

	//lecture des tickets
	$.each(object, function(index, value){
		var idTicket= value['key'];
		var statut=getStatusLabel(value['fields']['status']);
		var typeTicket = getTypeTicketName(value['class']);
		var ref_itop= value['fields']['ref'];
		var titre= value['fields']['title'];
		var date_crea= value['fields']['start_date'];
		var org_name = value['fields']['org_name'];
		var ref_bug= value['fields']['ref_ticket_bug'];

		//remplissage du tableau ticket a traiter
		//le tiquet n'est pas en attente
		if(!statut.startsWith('En attente')){
			nbTicketAT++;
			tabTicketAT[nbTicketAT]= new Object;

			if(value['fields']['request_type']=='service_request'){
				if(typeTicket!='Problème')
					typeTicket='Demande';
				var type ='<img src="'+IMG_REQUEST+'" alt="Demande" />';
				nbDemande++;
				nbDemandeTicketAT++;
			}else{
				typeTicket='Incident';
				var type='<img src="'+IMG_INCIDENT+'" alt="Incident" />';
				nbIncident++;
				nbIncidentTicketAT++;
			}

			//remplissage du tableau temporaire
			tabTicketAT[nbTicketAT]['id']=idTicket;
			tabTicketAT[nbTicketAT]['prio']=value['fields']['priority'];
			tabTicketAT[nbTicketAT]['type']=type;
			tabTicketAT[nbTicketAT]['statut']=statut;
			tabTicketAT[nbTicketAT]['refitop']=ref_itop;
			tabTicketAT[nbTicketAT]['titre']=titre;
			tabTicketAT[nbTicketAT]['datecrea']=date_crea;
			tabTicketAT[nbTicketAT]['org_name']=org_name;
			tabTicketAT[nbTicketAT]['refbug']=ref_bug;
			tabTicketAT[nbTicketAT]['typeTicket']=typeTicket;

		}
		//le tiquet est en attente
		else{
			nbTicketEAT++;
			lesTicketsEnAtt[nbTicketEAT]= new Object();

			if(value['fields']['request_type']=='service_request'){
				if(typeTicket!='Problème')
					typeTicket='Incident';
				type ='<img src="'+IMG_REQUEST+'" alt="Demande" />';
				nbDemande++;
				nbDemandeTicketEAT++;
			}else{
				if(typeTicket!='Problème')
					typeTicket='Incident';
				type='<img src="'+IMG_INCIDENT+'" alt="Incident" />';
				nbIncident++;
				nbIncidentTicketEAT++;
			}

			//remplissage du tableau temporaire
			lesTicketsEnAtt[nbTicketEAT]['id']=idTicket;
			lesTicketsEnAtt[nbTicketEAT]['prio']=value['fields']['priority'];
			lesTicketsEnAtt[nbTicketEAT]['type']=type;
			lesTicketsEnAtt[nbTicketEAT]['statut']=statut;
			lesTicketsEnAtt[nbTicketEAT]['refitop']=ref_itop;
			lesTicketsEnAtt[nbTicketEAT]['titre']=titre;
			lesTicketsEnAtt[nbTicketEAT]['datecrea']=date_crea;
			lesTicketsEnAtt[nbTicketEAT]['org_name']=org_name;
			lesTicketsEnAtt[nbTicketEAT]['refbug']=ref_bug;
			lesTicketsEnAtt[nbTicketEAT]['typeTicket']=typeTicket;

		}
	});

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

		if(value['prio']== '4')
			var prio = '<img src="'+IMG_PRIO_P3+'" alt="Priorité 3" />';

		else if(value['prio']== '3')
			var prio= '<img src="'+IMG_PRIO_P2+'" alt="Priorité 2" />';
		else
			var prio= '<img src="'+IMG_PRIO_P1+'" alt="Priorité 1" />';


		var str='<tr><td>'+value['typeTicket']+'</td>';
		str += '<td>'+ prio +'</td>';
		str += '<td>'+ value['type'] +'</td>';
		str += '<td>'+ value['statut'] +'</td>';
		if(value['typeTicket']=='Problème'){
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"'  target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}else{
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"'  target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}

		str += '<td>'+ value['datecrea'] +'</td>';
		str += '<td>'+ value['org_name'] +'</td>';
		str += '<td>'+ value['refbug'] +'</td></tr>';
		$("#tableTicketAT tbody:last").append(str);
	});

	//ticket en attente
	triTabBy('prio', lesTicketsEnAtt);
	$.each(lesTicketsEnAtt, function(index, value){

		if(value['prio']== '4')
			var prio = '<img src="'+IMG_PRIO_P3+'" alt="Priorité 3" />';
		else if(value['prio']== '3')
			var prio= '<img src="'+IMG_PRIO_P2+'" alt="Priorité 2" />';
		else
			var prio= '<img src="'+IMG_PRIO_P1+'" alt="Priorité 1" />';


		var str='<tr><td>'+value['typeTicket']+'</td>';
		str += '<td>'+ prio +'</td>';
		str += '<td>'+ value['type'] +'</td>';
		str += '<td>'+ value['statut'] +'</td>';
		if(value['typeTicket']=='Problème'){
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}else{
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}

		str += '<td>'+ value['datecrea'] +'</td>';
		str += '<td>'+ value['org_name'] +'</td>';
		str += '<td>'+ value['refbug'] +'</td></tr>';
		$("#tableTicketEA tbody:last").append(str);
	});

}

/**
* fonction de remplissage du tableau des ticket fermé, vidageTab = 1 pour vider le tableau + nbticketF
**/
function remplirTableauTicketFerme(object, vidageTab){
	if(vidageTab==1){
		$("#tableTicketF tbody").html('');
		nbTicketF=0;

	}

	lesTicketsF = new Object();

	$.each(object, function(index, value){
		nbTicketF++;
		lesTicketsF[nbTicketF] = new Object();

		var typeTicket = getTypeTicketName(value['class']);
		var idTicket= value['key'];
		var ref_itop= value['fields']['ref'];
		var titre = value['fields']['title'];
		var date_crea= value['fields']['start_date'];
		var org_name = value['fields']['org_name'];
		var ref_bug = value['fields']['ref_ticket_bug'];

		if(value['fields']['close_date']!="")
			var date_ferm= value['fields']['close_date'];
		else
			var date_ferm= value['fields']['resolution_date'];


		if(value['fields']['type']=='service_request'){
			type ='<img src="'+IMG_REQUEST+'" alt="Demande" />';
			typeTicket='Demande';
		}else{
			type='<img src="'+IMG_INCIDENT+'" alt="Incident" />';
			typeTicket='Incident';
		}

		//remplissage du tableau temporaire
		lesTicketsF[nbTicketF]['id']=idTicket;
		lesTicketsF[nbTicketF]['type']=type;
		lesTicketsF[nbTicketF]['refitop']=ref_itop;
		lesTicketsF[nbTicketF]['titre']=titre;
		lesTicketsF[nbTicketF]['datecrea']=date_crea;
		lesTicketsF[nbTicketF]['dateferm']=date_ferm;
		lesTicketsF[nbTicketF]['org_name']=org_name;
		lesTicketsF[nbTicketF]['refbug']=ref_bug;
		lesTicketsF[nbTicketF]['typeTicket']=typeTicket;

	});

	//modif du titre du tableau avec le total
	var str = ' Liste des tickets fermés sur la période - total: '+ nbTicketF;
	$('#tableTicketF caption').html(str);

	//tri est remplissage des tableaux
	//ticket a traiter
	triTabBy('dateferm', lesTicketsF);
		console.log('line 753');
	if(lesTicketsF!=null){
		$.each(lesTicketsF, function(index, value){

			var str = '<tr><td>'+value['typeTicket']+'</td>';
			str += '<td>'+ value['type'] +'</td>';
			if(value['typeTicket']=='Problème'){
				str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
				str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
			}else{
				str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
				str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
			}

			str += '<td>'+ value['datecrea'] +'</td>';
			str += '<td>'+ value['dateferm'] +'</td>';
			str += '<td>'+ value['org_name'] +'</td>';
			str += '<td>'+ value['refbug'] +'</td></tr>';
			$("#tableTicketF tbody:last").append(str);
		});
	}
}

/**
* fonction de remplissage tableau ticket P1 et SLA, vidageTab= 1 pour vider les tableau + nbticket
**/
function remplirTableauTicketP1SLSA(object, vidageTab){
	if(vidageTab==1){
		console.log("REMPLIR P1 SLA");
		lesSla= new Object();

		//vidage des tableaux
		//tableau P1
		$("#tableTicketP1 tbody").html('');
		//clear titre
		var str = ' Liste des tickets P1 sur la période - total: 0';
		$('#tableTicketP1 caption').html(str);

		//tableau SLA
		$("#tableSLA tbody").html('');
		//clera titre
		var str = ' Liste des SLA dépassées sur la période - total: 0';
		$('#tableSLA caption').html(str);


		nbTicketP1=0;
		nbSLA=0;
	}

	$.each(object, function(index, value){
		//remplissage du tableau P1
		var typeTicket = getTypeTicketName(value['class']);
		var idTicket= value['key'];
		var ref_itop= value['fields']['ref'];
		var titre = value['fields']['title'];
		var date_crea= value['fields']['start_date'];
		var ref_bug = value['fields']['ref_ticket_bug'];
		if(value['fields']['close_date']!=""){
			var date_ferm= value['fields']['close_date'];
		}else{
			var date_ferm= value['fields']['resolution_date'];
		}

		if(typeTicket!='Problème'){
			if(value['fields']['request_type']=='service_request'){
				var type ='<img src="'+IMG_REQUEST+'" alt="Demande" />';
				typeTicket= 'Demande'
			}else if(value['fields']['request_type']!='service_request'){
				var type ='<img src="'+IMG_INCIDENT+'" alt="Incident" />';
				typeTicket= 'Incident';
			}
		}

		if(value['fields']['priority'] == "2"){
			nbTicketP1++;

			var str='<tr><td>'+typeTicket+'</td>';
			if(typeTicket=='Problème'){
				str += "<td><a href='"+ iTopPbUrl + idTicket +"' target='_blank'>"+ ref_itop +'</a></td>';
				str += "<td><a href='"+ iTopPbUrl + idTicket +"' target='_blank'>"+ titre +'</a></td>';
			}else{
				str += "<td><a href='"+ iTopTicketUrl + idTicket +"' target='_blank'>"+ ref_itop +'</a></td>';
				str += "<td><a href='"+ iTopTicketUrl + idTicket +"' target='_blank'>"+ titre +'</a></td>';
			}

			str += '<td>'+ date_crea +'</td>';
			str += '<td>'+ date_ferm +'</td>';
			str += '<td>'+ ref_bug +'</td></tr>';
			$("#tableTicketP1 tbody:last").append(str);

			//modif du titre du tableau avec le total
			var str = ' Liste des tickets P1 sur la période - total: '+ nbTicketP1;
			$('#tableTicketP1 caption').html(str);

		}
		//remplissage du tableau ticket SLA dépassée
		else if(value['fields']['sla_respected'] == "oui"){
			nbSLA++;

			lesSla[nbSLA]= new Object();

			var sla = value['fields']['sla_overdue'];


			//modif du titre du tableau avec le total
			var str = ' Liste des SLA dépassées sur la période - total: '+ nbSLA;
			$('#tableSLA caption').html(str);

			lesSla[nbSLA]['id']=idTicket;
			lesSla[nbSLA]['refitop']=ref_itop;
			lesSla[nbSLA]['titre']=titre;
			lesSla[nbSLA]['datecrea']=date_crea;
			lesSla[nbSLA]['dateferm']=date_ferm;
			lesSla[nbSLA]['refbug']=ref_bug;
			lesSla[nbSLA]['sla']=sla;
			lesSla[nbSLA]['typeTicket']=typeTicket;

		}
	});

	//tri est remplissage des tableaux
	//ticket a traiter
	triTabBy('sla', lesSla);
	$.each(lesSla, function(index, value){

		var jourSla = Math.floor(value['sla'] / 86400);
		var heureSla = Math.floor((value['sla']  % 86400)/3600);
		var minSla = Math.floor((value['sla']  % 3600)/60);
		var secSla = Math.floor(value['sla']  % 60);

		var slaTime = jourSla+ " jour(s) " + heureSla +"h "+ minSla+ "min "+ secSla+ "sec";

		var str = "<tr><td>"+value['typeTicket']+"</td>"
		if(value['typeTicket']=='Problème'){
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td><a href='"+ iTopPbUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}else{
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['refitop'] +'</a></td>';
			str += "<td><a href='"+ iTopTicketUrl + value['id'] +"' target='_blank'>"+ value['titre'] +'</a></td>';
		}

		str += '<td>'+ value['datecrea'] +'</td>';
		str += '<td>'+ value['dateferm'] +'</td>';
		str += '<td>'+ value['refbug'] +'</td>';
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

//remplir tableau P1 ouvert
function remplirTableauTicketP1(object, vidageTab){
	if(vidageTab==1){
		//vidage du tableaux
		//tableau P1
		$("#tableTicketP1Open tbody").html('');
		//clear titre
		var str = ' Liste des tickets P1 - total: 0';
		$('#tableTicketP1Open caption').html(str);

		var nbTicketP1=0;
	}

	$.each(object, function(index, value){
		//remplissage du tableau P1 open
		nbTicketP1++;

		var typeTicket = getTypeTicketName(value['class']);
		var idTicket= value['key'];
		var ref_itop= value['fields']['ref'];
		var titre = value['fields']['title'];
		var date_crea= value['fields']['start_date'];
		var ref_bug = value['fields']['ref_ticket_bug'];
		var date_ferm= value['fields']['start_date'];
		var org= value['fields']['org_name'];
		var statut= getStatusLabel(value['fields']['status']);

		if(typeTicket!='Problème'){
			if(value['fields']['request_type']=='service_request'){
				var type ='<img src="'+IMG_REQUEST+'" alt="Demande" />';
				typeTicket= 'Demande'
			}else{
				var type ='<img src="'+IMG_INCIDENT+'" alt="Incident" />';
				typeTicket= 'Incident';
			}
		}

		var str = "<tr><td>"+typeTicket+"</td>";
		str += "<td>"+type+"</td>"
		str += "<td>"+statut+"</td>"
		if(value['typeTicket']=='Problème'){
			str += "<td><a href='"+ iTopPbUrl + idTicket +"' target='_blank'>"+ ref_itop +'</a></td>';
			str += "<td><a href='"+ iTopPbUrl + idTicket +"' target='_blank'>"+ titre +'</a></td>';
		}else{
			str += "<td><a href='"+ iTopTicketUrl + idTicket +"' target='_blank'>"+ ref_itop +'</a></td>';
			str += "<td><a href='"+ iTopTicketUrl + idTicket +"' target='_blank'>"+ titre +'</a></td>';
		}
		str += '<td>'+ date_crea +'</td>';
		str += "<td>"+ org +'</td>';
		str += '<td>'+ ref_bug +'</td></tr>';
		$("#tableTicketP1Open tbody:last").append(str);

		//modif du titre du tableau avec le total
		var str = ' Liste des tickets P1 - total: '+ nbTicketP1;
		$('#tableTicketP1Open caption').html(str);

	});

}


/**
* FONCTIONS UTILES
**/

/**
 * Return Web Service columns in a string
 */
function GetWSColumnsAsString()
{
	var col = 'ref, org_id, org_name, team_id, team_name, agent_id, agent_id_friendlyname, agent_name, site_id, site_name, title, start_date, end_date, last_update, close_date, resolution_date, closedby_id, ticket_status, status, impact, priority, resolvedby_id, service_id, service_name, service_provider_name, serviceelement_id, serviceelement_name, solution, resolutioncode_id, resolutioncode_name, ref_ticket_customer, ref_ticket_bug, url_ticket_bug, sla_overdue, sla_respected, public_log, private_log';
	col = col.trim();
	return col;
}

/**
* fonction de tri de tableau en fonction de byWhat
**/
function triTabBy(byWhat, tab){
	console.log('le tableau a trier: ');
	console.log(tab);



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
		return 'Assigné';
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
