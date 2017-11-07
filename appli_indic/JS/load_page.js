var login = '';
var pwd = '';
var first = 1;
var ITOP_URL	= 'https://itop.hardis.fr';
var ITOP_WS_URL	= ITOP_URL + "/webservices/rest.php?version=1.3";


//annimation chargement	
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


var mois=1

var lstCDP= new Object();

//remettre la liste déroulante sur 1 mois
$(document).ready(function() {
    $('#periode').val("oneMonth");
});

function loadPage(){	
	spinner_div = $('#spinner').get(0);
	if(spinner == null)
	  spinner = new Spinner(opts).spin(spinner_div);
	else	
	  spinner.spin(spinner_div);
  
	ajaxTickets('UserRequest');
	ajaxTickets('Problem');
}

function chargement(data, typeTicket){		
	console.log('chargement');
	// l'utilisateur n'est pas connecté
	if (data.code != 0)
	{
		//stop chargement animation
		spinner.stop(spinner_div);
		
		$("#login").show();
		$("#connected").hide();
			
	}
	// l'utilisateur est connecté
	else
	{	
		$("#lastExtractDate").html("Extraction du "+getCurrentDate());
		$("#login").hide();
		$("#connected").show();
		if(typeTicket=="UserRequest")
			remplissageTableau(data['objects'], 'tableIndicGlobal', null, typeTicket);
		else
			remplissageTableau(data['objects'], 'tableIndicGlobalPb', null, typeTicket);
		
		//avoir tout les chef de projet pour les equipe et client correspondant
		objCDPOrg= getAllCDPAndOrg(typeTicket);
		
	}		
}

function remplissageTableau(object, idTableau, equipe, typeTicket){
	spinner_div = $('#spinner').get(0);
	if(spinner == null)
	  spinner = new Spinner(opts).spin(spinner_div);
	else	
	  spinner.spin(spinner_div);
	console.log("remplissage tableau");
	
	if(idTableau=='tableIndicGlobal' || idTableau=='tableIndicGlobalPb'){
		//vidage du tableau
		$("#"+idTableau+"> tbody").html("");
	}
	
	var nbPbResSLAPasDepasse= nbPbP3SLAPasDepasse= nbPbP2SLAPasDepasse= nbPbP1SLAPasDepasse= nbPbP1= nbPbP2= nbPbP3= nbPbP1Res= nbPbP2Res= nbPbP2Res= nbPbP3Res= nbPbRes= nbPb= nbIP1Res= nbIP2Res= nbIP3Res= nbP3SLAPasDepasse= nbP2SLAPasDepasse= nbP1SLAPasDepasse= nbDemSLAPasDepasse= nbResSLAPasDepasse= nbIP1= nbIP2= nbIP3= nbDem= nbDemRes= nbRes= nbEC=0;
	
	$.each(object, function(index, value){
		var idTicket= value['key'];
		var statut=getStatusLabel(value['fields']['status']);
		var prio= value['fields']['priority'];
	
		
		//ticket en cours hors attente client
		if(statut!="Résolu" && statut!="Fermé" && statut!="En attente client"){
			//pour les probleme
			if(typeTicket=="Problem")
				nbPb++;
			else
				nbEC++;	
		}
		
		//ticket résolus
		if(statut=="Résolu" || statut == "Fermé"){
			//pour les probleme
			if(typeTicket=="Problem")
				nbPbRes++;
			else
				nbRes++;
			//sla pas depassee
			if(value['fields']['sla_respected']=='non'){
				nbResSLAPasDepasse++
				//pour les problem
				if(typeTicket)
					nbPbResSLAPasDepasse++;
				else
					nbResSLAPasDepasse++;
			}
		}
		
		//incrementation des nombres pour les demandes de clients
		if(typeTicket=='UserRequest'){		
			//cest un incident 
			if(value['fields']['request_type']!='service_request'){
				//cest un ticket P3
				if(value['fields']['priority']=='4'){
					//cree
					//if(statut!= "Résolu" && statut!= "Fermé")
					nbIP3++;
					//resolu
					if(statut== "Résolu" || statut== "Fermé"){
						nbIP3Res++;
						//sla pas depassee
						if(value['fields']['sla_respected']=='non')
							nbP3SLAPasDepasse++;	
					}
								
				//cest un ticket P2
				}else if(value['fields']['priority']=='3'){
					//cree
					//if(statut!= "Résolu" && statut!= "Fermé")
					nbIP2++;
					//resolu
					if(statut== "Résolu" || statut== "Fermé"){
						nbIP2Res++;
						//sla pas depassee
						if(value['fields']['sla_respected']=='non')
							nbP2SLAPasDepasse++;
					}
						
				//cest un ticket P1
				}else if(value['fields']['priority']=='2'){ 
					//cree
					//if(statut!= "Résolu" && statut!= "Fermé")
					nbIP1++;
					//resolu
					if(statut== "Résolu" || statut== "Fermé"){
						nbIP1Res++;
						//sla pas depassee
						if(value['fields']['sla_respected']=='non')
							nbP1SLAPasDepasse++;
					}
				}
			}
			//cest une demande
			else{
				//cree
				//if(statut!= "Résolu" && statut!= "Fermé")
					nbDem++;
				//resolu
				if(statut== "Résolu" || statut== "Fermé"){
					nbDemRes++;
					//sla pas depassee
					if(value['fields']['sla_respected']=='non')
						nbDemSLAPasDepasse++;
				}
					
			}
		}
		//incrementation des nb pour les problemes
		else{
			if(value['fields']['priority']=='4'){
				//cree
				nbPbP3++;
				//resolu
				if(statut== "Résolu" || statut== "Fermé"){
					nbPbP3Res++;
					//sla pas depassee
					if(value['fields']['sla_respected']=='non')
						nbPbP3SLAPasDepasse++;	
				}
							
			//cest un ticket P2
			}else if(value['fields']['priority']=='3'){
				//cree
				//if(statut!= "Résolu" && statut!= "Fermé")
				nbPbP2++;
				//resolu
				if(statut== "Résolu" || statut== "Fermé"){
					nbPbP2Res++;
					//sla pas depassee
					if(value['fields']['sla_respected']=='non')
						nbPbP2SLAPasDepasse++;
				}
					
			//cest un ticket P1
			}else if(value['fields']['priority']=='2'){ 
				//cree
				//if(statut!= "Résolu" && statut!= "Fermé")
				nbPbP1++;
				//resolu
				if(statut== "Résolu" || statut== "Fermé"){
					nbPbP1Res++;
					//sla pas depassee
					if(value['fields']['sla_respected']=='non')
						nbPbP1SLAPasDepasse++;
				}
			}
		}
		
	});
	
	
	var selector= "#"+ idTableau +" tbody:last";
	
	//pourcent pour les demandes de clients
	if(nbIP1Res!=0)
		var pourcentP1= 100 * parseInt(nbP1SLAPasDepasse) /  parseInt(nbIP1Res);
	else
		var pourcentP1=0;
	if(nbIP2Res!=0)
		var pourcentP2= 100 * parseInt(nbP2SLAPasDepasse) /  parseInt(nbIP2Res);
	else
		var pourcentP2=0;
	if(nbIP3Res!=0)
		var pourcentP3= 100 * parseInt(nbP3SLAPasDepasse) /  parseInt(nbIP3Res);
	else
		var pourcentP3=0;
	if(nbDemRes!=0)
		var pourcentDem= 100 * parseInt(nbDemSLAPasDepasse) /  parseInt(nbDemRes);
	else
		var pourcentDem=0;
	if(nbRes!=0)
		var pourcentRes= 100 * parseInt(nbResSLAPasDepasse) /  parseInt(nbRes);
	else
		var pourcentRes=0;
	//pourcent pour les problemes
	if(nbPbP1Res!=0)
		var pourcentPbP1= 100 * parseInt(nbPbP1SLAPasDepasse) /  parseInt(nbPbP1Res);
	else
		var pourcentPbP1=0;
	if(nbPbP2Res!=0)
		var pourcentPbP2= 100 * parseInt(nbPbP2SLAPasDepasse) /  parseInt(nbPbP2Res);
	else
		var pourcentPbP2=0;
	if(nbPbP3Res!=0)
		var pourcentPbP3= 100 * parseInt(nbPbP3SLAPasDepasse) /  parseInt(nbPbIP3Res);
	else
		var pourcentPbP3=0;
	if(nbPbRes!=0)
		var pourcentPbRes= 100 * parseInt(nbPbResSLAPasDepasse) /  parseInt(nbPbRes);
	else
		var pourcentPbRes=0;
	
	
	//si tout nest pas egale a zero
	if((!(nbIP1==0 && nbIP1Res==0 && nbIP2==0 && nbIP2Res==0 && nbIP3==0 && nbIP3Res==0 && pourcentP1==0 && pourcentP2==0 && pourcentP3==0 && nbDem==0 && nbDemRes==0 && pourcentDem==0 && nbRes==0 && pourcentRes==0) && typeTicket=="UserRequest") || (!(nbPbP1==0 && nbPbP1Res==0 && nbPbP2==0 && nbPbP2Res==0 && nbPbP3==0 && nbPbP3Res==0 && pourcentPbP1==0 && pourcentPbP2==0 && pourcentPbP3==0 && nbPbRes==0 && pourcentPbRes==0) && typeTicket=="Problem" || equipe==null)){
		var str='<tr>'
			
		if(idTableau=='tableIndicEquipe' || idTableau=='tableIndicEquipePb'){
			str += '<td>'+equipe+'</td>';
		}
		
		//pour les demandes de clients
		if(typeTicket=="UserRequest"){
			str += '<td>'+ nbIP1 +'</td>';
			str += '<td>'+ nbIP1Res;
			if(nbIP1Res!=0)
				str	+= ' dont ' + Math.floor(pourcentP1) +'% dans le SLA</td>';
			str += '<td>'+ nbIP2 +'</td>';	
			str += '<td>'+ nbIP2Res; 
			if(nbIP2Res!=0)
				str += ' dont ' + Math.floor(pourcentP2) +'% dans le SLA</td>';
			str += '<td>'+ nbIP3 +'</td>';	
			str += '<td>'+ nbIP3Res 
			if(nbIP3Res!=0)
				str += ' dont ' + Math.floor(pourcentP3) +'% dans le SLA</td>';
			str += '<td>'+ nbDem +'</td>';	
			str += '<td>'+ nbDemRes 
			if(nbDemRes!=0)
				str += ' dont ' + Math.floor(pourcentDem) +'% dans le SLA</td>';
			str += '<td>'+ nbRes 
			if(nbRes!=0)
				str	+= ' dont ' + Math.floor(pourcentRes) +'% dans le SLA</td>';
			str += '<td>'+ nbEC +'</td></tr>';
		}
		//pour les problemes
		else{
			str += '<td>'+ nbPbP1 +'</td>';
			str += '<td>'+ nbPbP1Res;
			if(nbPbP1Res!=0)
				str	+= ' dont ' + Math.floor(pourcentPbP1) +'% dans le SLA</td>';
			str += '<td>'+ nbPbP2 +'</td>';	
			str += '<td>'+ nbPbP2Res; 
			if(nbPbP2Res!=0)
				str += ' dont ' + Math.floor(pourcentPbP2) +'% dans le SLA</td>';
			str += '<td>'+ nbPbP3 +'</td>';	
			str += '<td>'+ nbPbP3Res 
			if(nbPbP3Res!=0)
				str += ' dont ' + Math.floor(pourcentPbP3) +'% dans le SLA</td>';
			str += '<td>'+ nbRes 
			if(nbPbRes!=0)
				str	+= ' dont ' + Math.floor(pourcentPbRes) +'% dans le SLA</td>';
			str += '<td>'+ nbPb +'</td></tr>';
		}
		$(selector).append(str);
	}

	setInterval(function(){ 
		//stop chargement animation
		spinner.stop(spinner_div); }
	, 15000);
	
}

// pour changer les tableau en fonction de la periode sélectionnée
function loadTabPeriode(){
	
	var periode = $("#periode option:selected").text();
	if(periode=="1 mois"){
		mois = 1;
	}else if(periode=="2 mois"){
		mois = 2;
	}else if(periode=="3 mois"){
		mois = 3;
	}else{
		mois = 6;
	}
	
	loadPage();

}

function ajaxTickets(typeTicket){
	console.log('ajaxticket');
	
	var outputf= getColumnsAsString();
	if(typeTicket=='UserRequest')
		outputf+= ',request_type';
	
	// Json request
	var oJSON = {
		operation: 'core/get',
		'class': typeTicket,
		key: getTickets(typeTicket),
		output_fields: outputf
	};

	$.ajax({
		type: "POST",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(oJSON) },
		crossDomain: 'true',
		success: function (data){
			console.log(data);
			chargement(data, typeTicket);
		},
		error: function (data) {
			console.log("error");
			document.getElementById("backlogHardisListId").innerHTML = "Erreur technique, veuillez contacter le SI";

		}
	});
}



//avoir tout les chef de projet pour equipe ticket
function getAllCDPAndOrg(typeTicket){
	
	//vidage du tableau
	if(typeTicket=="UserRequest")
		$("#tableIndicEquipe > tbody").html("");
	else
		$("#tableIndicEquipePb > tbody").html("");
	
	var aJSON = {
		operation: 'core/get',
		'class': 'lnkContactToContract',
		key: getContact(),
		output_fields: "contact_name, role_name, friendlyname, contract_org_id "
	};		
			
	$.ajax({
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(aJSON)},
		crossDomain: 'true',
		success: function(data){
	
			$.each(data['objects'], function(index, value){
				if(value['fields']['role_name']=="Chef de projet TMA Reflex"){
					//si pas déjà dans le tableau
					if(!(value['fields']['contact_name'] in lstCDP)){
						lstCDP[value['fields']['contact_name']]= new Array();
						lstCDP[value['fields']['contact_name']][0]= value['fields']['contract_org_id'];
					}else{
						var length= lstCDP[value['fields']['contact_name']].length;	
						lstCDP[value['fields']['contact_name']][length]= value['fields']['contract_org_id'];
					}
				}
			});
			
			var length=Object.keys(lstCDP).length;
			var i=0;
			//construction de la requete avec les client correspondant au chef de projet
			$.each(lstCDP, function(index, value){
				
				spinner_div = $('#spinner').get(0);
				if(spinner == null) {
				  spinner = new Spinner(opts).spin(spinner_div);
				} else {
				  spinner.spin(spinner_div);
				}
		
				var org="";
				$.each(value, function(index, value){
					//si cest le premier
					if(index==0)
						org+=value;
					else
						org+=' OR Organization.id= ' + value;
				});

				var bJSON = {
					operation: 'core/get',
					'class': typeTicket,
					key: getTicketsOrg(org, typeTicket),
					output_fields: getColumnsAsString()
				};
				$.ajax({
					type: "GET",
					url: ITOP_WS_URL,
					dataType: 'jsonp',
					data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(bJSON)},
					crossDomain: 'true',
					success: function(data){
						console.log(data);
						i++;
						if(typeTicket=='UserRequest')
							remplissageTableau(data['objects'], 'tableIndicEquipe', index, typeTicket);
						else 
							remplissageTableau(data['objects'], 'tableIndicEquipePb', index, typeTicket);
						if(i==length && typeTicket=="UserRequest"){
							//stop chargement animation
							spinner.stop(spinner_div);
						}
	
					},error: function (data) {
						console.log("error");
						document.getElementById("backlogHardisListId").innerHTML = "Erreur technique, veuillez contacter le SI";

					}
				});
			});
			
		},error: function(data){
			console.log("error");
			document.getElementById("backlogHardisListId").innerHTML = "Erreur technique, veuillez contacter le SI";

		}
		
	});
	
	
}

/***
* Requete
*///

function getTickets(typeTicket)
{
	var request = 'SELECT ticket';
	request += ' FROM '+typeTicket+' AS ticket JOIN Organization AS Organization ON ticket.org_id = Organization.id ';
	request += ' WHERE (creation_date >= DATE_SUB(NOW(), INTERVAL '+ mois +' MONTH) ) ';
	request += ' AND (service_name = "Reflex WMS TMA" ) ';
	
	return request;
}

function getTicketsOrg(org, typeTicket)
{
	var request = 'SELECT ticket ';
	request += ' FROM '+typeTicket+' AS ticket JOIN Organization AS Organization ON ticket.org_id = Organization.id ';
	request += ' WHERE (creation_date >= DATE_SUB(NOW(), INTERVAL '+ mois +' MONTH) ) ';
	request += ' AND (service_name = "Reflex WMS TMA" ) ';
	request += ' AND (Organization.id='+ org +') ';

	return request;
}

function getTicketsTeam(typeTicket)
{
	var request = 'SELECT ticket ';
	request += ' FROM '+typeTicket+' AS ticket JOIN Organization AS Organization ON ticket.org_id = Organization.id ';
	request += ' WHERE (creation_date >= DATE_SUB(NOW(), INTERVAL '+ mois +' MONTH) ) ';
	request += ' AND (service_name = "Reflex WMS TMA" ) ';
	
	return request;
}

function getContact()
{
	var request = 'SELECT link FROM lnkContactToContract AS link'; 
	request += ' JOIN Contact AS ctc ON link.contact_id = ctc.id';
	request += ' JOIN Contract AS ctr ON link.contract_id = ctr.id';
	request += ' WHERE ctc.status = "Active"';
	request += ' AND link.contract_name LIKE "%WMS"';
	
	return request;
}


/*****
* FONCTION UTILES
******/

//reindexing tab
function reIndexage(tab){
	var newTab = new Object();
	var i =0;
	
    $.each(tab, function(ind, val){		
		newTab[i]=val;	
		i++;
    });
	return newTab;
}

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
 * Return Web Service columns in a string
 */
function getColumnsAsString(){	
	var col = 'ref, org_id, org_name, team_id, team_name, agent_id, agent_id_friendlyname, agent_name, site_id, site_name, title, start_date, end_date, last_update, close_date, resolution_date, closedby_id, ticket_status, status, impact, priority, resolvedby_id, service_id, service_name, service_provider_name, serviceelement_id, serviceelement_name, solution, resolutioncode_id, resolutioncode_name, ref_ticket_customer, ref_ticket_bug, url_ticket_bug, sla_overdue, sla_respected, public_log, private_log, expected_request_date';
	col = col.trim();
	return col;
}

/******
// getters
******/
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

function getStatusLabel(value)
{
	if (value == 'assigned')
		value = 'Assigné agent';
	else if (value == 'pending_customer')
		value = 'En attente client';
	else if (value == 'pending_internal')
		value = 'En attente interne';
	else if (value == 'pending_bugfix')
		value = 'En attente correction';
	else if (value == 'pending_planed')
		value = 'En attente planifiée';
	else if (value == 'waiting_for_approval')
		value = 'En attente d\'approbation';
	else if (value == 'new')
		value = 'Nouveau';
	else if (value == 'assigned_team')
		value = 'Assigné équipe';
	else if (value == 'resolved')
		value = 'Résolu';
	else if (value == 'closed')
		value = 'Fermé';
	else if (value == 'work_in_progress' || value == 'workinprogress')
		value = 'Travail en cours';
	else if (value == 'approuved')
		value = 'Approuvé';
		
	return value;
}

function getSizeTabIndex(arr){
    var size = 0;
    for (var key in arr) 
    {
        if (arr.hasOwnProperty(key)) size++;
    }
    return size;
}

