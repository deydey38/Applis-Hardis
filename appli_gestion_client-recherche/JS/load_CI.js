var login		= '';
var pwd			= '';
var first		= true;
var ITOP_URL	= 'https://itop.hardis.fr';
var ITOP_WS_URL	= ITOP_URL + "/webservices/rest.php?version=1.3";
var iTopCIUrl 	= 'https://itop.hardis.fr/pages/UI.php?operation=details&class=FunctionalCI&id=';
var iTopContactUrl 	= 'https://itop.hardis.fr/pages/UI.php?operation=details&class=Contact&id=';

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
var xJSON;
var yJSON;
var zJSON;
//objet databaseshema
var dbs;
//objet virtualmachine
var vm;
//utile pour recharger une deuxieme fois ou non
var passage=0;


/**
* 1 (numéro d'execution)
* fonction appelée par la fonction loadPageSelectInfo (fichier load_selectInfo)
**/
function loadPageAfficheCI(){
	//incrementation de passage dans la fonction
	passage++;
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
		// Json request for FunctionalCI
		oJSON = {
			operation: 'core/get',
			'class': 'DatabaseCluster',
			key: GetBacklogRequestCI(),
			output_fields: GetWSColumnsAsStringCI()
		};

		// Json request for linksoltoci
		xJSON = {
			operation: 'core/get',
			'class': 'lnkSolutionToCI',
			key: GetBacklogRequestLnkCI(),
			output_fields: "utility, ci_id"
		};

		// Json request for databaseschema
		yJSON = {
				operation: 'core/get',
				'class': 'DatabaseSchema',
				key: GetBacklogRequestDBSCI(),
				output_fields: "id, name, db_environment_server_name, db_environment_server_name_friendlyname, status"
		};

		// Json request for virtualmachine
		zJSON = {
				operation: 'core/get',
				'class': 'VirtualMachine',
				key: GetBacklogRequestVMCI(),
				output_fields: "id, name, mgmt_ip, osfamily_name, osversion_name, status, url"
		};
		// Json request for lnkContactToContract
		aJSON = {
			operation: 'core/get',
			'class': 'lnkContactToContract',
			key: GetBacklogRequestlnkContactToContractCI(),
			output_fields: "contact_id, contact_name, role_name, contact_id_friendlyname"
		}

		// Json request for contact
		bJSON = {
			operation: 'core/get',
			'class': 'Contact',
			key: GetBacklogRequestContactCI(),
			output_fields: "email, phone"
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

	//appel ajax pour FunctionalCI
	ajaxFunctionalCICI();

}

/**
* 3
* Check connexion itop + affichage + appel ajaxDBSCI
**/
function refreshSuccessfullCI(data){
	//cacher les proposition de l'autocompletion
	$('#ui-id-1').hide();
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
	else{

		lst_org = new Array;
		if(data['objects']!=null){
			$.each(data['objects'], function(index, value){
				var name = value['fields']['name'];
				if(typeof name == 'undefined')
					console.log('undefineeeeeeeeed');
				else
					lst_org.push(name);
			});
		}

		$("#login").hide();
		document.getElementById("errorMessage").innerHTML = '';

		if(page=='afficheSelectInfo'){

			//appel ajax pour databaseschema
			ajaxDBSCI();
			fcis = data["objects"];
			$("#connected").show();
		}else{

			$("#form").show();
			document.getElementById("client").value = '';
			document.getElementById('alertFormError').value = '';
		}
	}
}

/**
* 9
* charge le contenu des tableaux
**/
function chargementPageCI(dataObjFcis, dataObjLnk){
	console.log("chargement!!!!")
	//stop chargement animation
	spinner.stop(spinner_div);

	//vidage des tableaux
	$("#table_db tbody").html('')
	$("#table_vm tbody").html('');
	$("#table_contact tbody").html('');

	var tableContact = $("#table_contact tbody:last");
	//triTabBy('role_name', contact);

	//affichage des contacts
	if(contact!=null){
		//newtab = contact indexé par des int
		var newTab= reIndexage(contact);

		triBy('role_name', newTab);
		//parcours de tout les contact + contactDétails
		$.each(newTab, function(ind, val){
			$.each(contactDetails, function(i, v){
				//si les id de contact se correspondent
				if((v['key']==val['fields']['contact_id']) && (val['fields']['role_name']!= 'Key User Portail')){

					//creation d'une ligne + ajout au tableau
					var tr = document.createElement('tr');
					tableContact.append(tr);

					//creation d'un lien
					var a = document.createElement('a');
					a.href=iTopContactUrl+val['fields']['contact_id'];
					a.innerHTML = val['fields']['contact_id_friendlyname'];
					a.target="_blank"

					//création d'une céllule + ajout a la ligne + ajout du lien a la cellule
					var tdName = document.createElement('td');
					tr.append(tdName);
					tdName.append(a);

					//création d'une cellule + ajout après la cellule précédente
					var tdFonction = document.createElement('td');
					tdFonction.innerHTML = val['fields']['role_name'];
					tdName.after(tdFonction);

					//création d'une cellule + ajout après la cellule précédente
					var tdMail = document.createElement('td');
					tdMail.innerHTML = v['fields']['email'];
					tdFonction.after(tdMail);

					//création d'une cellule + ajout après la cellule précédente
					var tdTel = document.createElement('td');
					tdTel.innerHTML = v['fields']['phone'];
					tdMail.after(tdTel);
				}
			});
		});
	}else{
		var tr = document.createElement('tr');
		tableContact.append(tr);

		//création d'une céllule + ajout a la ligne
		var td = document.createElement('td');
		td.innerHTML = "Il n'y a aucun contact";
		tr.append(td);
	}

	//si il y a des CIs
	if(dataObjFcis!=null){

		//création de listes utilitaires
		var lst_table_db, lst_table_vm;

		//utile pour remplissage des table db et vm
		lst_table_db = new Array;
		lst_table_vm = new Array;


		// liste assoc nom db -> id_db
		lst_db_id = new Object;

		// liste assoc nom vm -> id_vm
		lst_vm_id = new Object;

		$.each(dataObjFcis, function(index, value){
			//remplissage des tableau associatif [idIC]= value
			//cest une db
			if(value['class']=="DatabaseCluster"){
				var name = value['fields']['friendlyname'];
				lst_db_id[name]=new Object;
				lst_db_id[name]=value['key'];
			}
			//cets une vm
			else if(value['class']=="VirtualMachine"){
				var name = value['fields']['friendlyname'];
				lst_vm_id[name]=new Object;
				lst_vm_id[name]=value['key'];
			}

		});

		//remplissage des listes lst_table_db et lst_table_vm
		//db

		console.log(dataObjFcis);
		console.log(dbs);
		console.log(dataObjLnk);
		//HLSF6V60 HLSF6V60

		var length=0;
		$.each(dataObjFcis, function(index, value){
			$.each(dbs, function(inde, valu){

				//si cest une db et si y a un databaseshema
				// if(value['class']=="DatabaseCluster" && value['fields']['databaseschemas_list'][0]!=null){
					// if((value['fields']['databaseschemas_list'][0]['databaseschema_id'] == valu['key']) && value['fields']['status']!='obsolete'){
				if(value['class']=="DatabaseCluster" && value['fields']['databaseschemas_list']!=null){
					if((value['fields']['databaseschemas_list'][0]['databaseschema_id'] == valu['key']) && value['fields']['status']!='obsolete'){
						//si il y a des choses dans le tableau
						if(length>=3){
							//si la ligne nexiste pas déjà
							if(lst_table_db[length-1]!=valu['fields']['db_environment_server_name_friendlyname'] || lst_table_db[length-2]!=value['fields']['friendlyname'] ){
								console.log('ligne inexistante');
								//remplissage des commentaires
								$.each(dataObjLnk, function(ind, val){
									if(val['fields']['ci_id'] == value['key']){
										lst_table_db.push(val['fields']['utility']);
									}
								});

								lst_table_db.push(value['fields']['friendlyname']);
								lst_table_db.push(valu['fields']['db_environment_server_name_friendlyname']);
								length=length+3;
							}
						}else{
							//remplissage des commentaires
							$.each(dataObjLnk, function(ind, val){
								if(val['fields']['ci_id'] == value['key']){
									lst_table_db.push(val['fields']['utility']);
								}
							});
							lst_table_db.push(value['fields']['friendlyname']);
							lst_table_db.push(valu['fields']['db_environment_server_name_friendlyname']);
							length=length+3;
						}
					}

				}
				//pas de dbs
				//else if((value['class']=="DatabaseCluster" && value['fields']['databaseschemas_list'][0]==null)){
					//if((value['fields']['friendlyname'] == valu['fields']['name']) && value['fields']['status']!='obsolete'){
				else if(value['class']=="DatabaseCluster" && value['fields']['databaseschemas_list']==null){
					if((value['fields']['friendlyname'] == valu['fields']['name']) && value['fields']['status']!='obsolete'){
						//si il y a des choses dans le tableau
						if(length>=3){
							//si la ligne nexiste pas déjà
							if(lst_table_db[length-1]!=valu['fields']['db_environment_server_name_friendlyname'] || lst_table_db[length-2]!=value['fields']['friendlyname'] ){
								console.log('ligne inexistante');
								//remplissage des commentaires
								$.each(dataObjLnk, function(ind, val){
									if(val['fields']['ci_id'] == value['key']){
										lst_table_db.push(val['fields']['utility']);
									}
								});

								lst_table_db.push(value['fields']['friendlyname']);
								lst_table_db.push(valu['fields']['db_environment_server_name_friendlyname']);
								length=length+3;
							}
						}else{
							//remplissage des commentaires
							$.each(dataObjLnk, function(ind, val){
								if(val['fields']['ci_id'] == value['key']){
									lst_table_db.push(val['fields']['utility']);
								}
							});
							lst_table_db.push(value['fields']['friendlyname']);
							lst_table_db.push(valu['fields']['db_environment_server_name_friendlyname']);
							length=length+3;
						}
					}
				}
			});
		});
		if(lst_table_db.length == 0){
			lst_table_db=["Il n'y a pas de base de données",'',''];
		}

		//vm
		$.each(vm, function(index, value){
			$.each(dataObjLnk, function(ind, val){
				if(val['fields']['ci_id'] == value['key']){
					//si la vm nest pas obsolete
					if(value['fields']['status']!='obsolete'){
						//remplissage de nouvelle valeur dans la lst_table_vm avec vm
						lst_table_vm.push(val['fields']['utility']);
						lst_table_vm.push(value['fields']['name']);
						lst_table_vm.push(value['fields']['mgmt_ip']);
						lst_table_vm.push(value['fields']['osfamily_name']);
						lst_table_vm.push(value['fields']['osversion_name']);
						lst_table_vm.push(value['fields']['url']);
					}
				}
			});
		});
		if(lst_table_vm.length==0){
			 lst_table_vm=["Il n'y a aucune machines virtuelles",'','', '', '', ''];
		}



		//remplissage des tableaux
		if(dataObjLnk!=null){
			//db
			console.log("db remplissage tableau!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			console.log(lst_table_db);

			//on avance de 3 enn 3 psk il y a 3 cellules
			for(var i=0; i < lst_table_db.length; i=i+3){
				var idDB= null;
				//boucle sur la liste db id pour recup l'id
				$.each(lst_db_id, function(index, value){
					//si index correspond a name
					if(lst_table_db[i+1] == index){
						idDB = value;
					}
				});

				//création de lien DB
				if(idDB!= null){

					console.log("idBD!=null");
					//si le parametre ci n'est pas null on affiche seulement le ci concerné
					/*if($('#ciName').val()!=''){
						if(lst_table_db[i+1] == $('#ciName').val().toUpperCase()){
							var str='<tr><td>'+ lst_table_db[i] +'</td><td><a href="'+ iTopCIUrl+ idDB +'" target="_blank">'+ lst_table_db[i+1] +'</a></td><td>'+ lst_table_db[i+2] +'</td></tr>';
							$("#table_db tbody:last").append(str);
						}
					}else{*/
						var str='<tr><td>'+ lst_table_db[i] +'<button type="button" class="btn btn-primary pencil" data-toggle="modal" data-target="#exampleModal"><i class="fa fa-pencil"></i></button></td><td><a href="'+ iTopCIUrl+ idDB +'" target="_blank">'+ lst_table_db[i+1] +'</a></td><td>'+ lst_table_db[i+2] +'</td></tr>';
						$("#table_db tbody:last").append(str);
				//	}

				}else{
					/*if($('#ciName').val()!=''){
						if(lst_table_db[i+1] == $('#ciName').val().toUpperCase()){
							var str='<tr><td>'+ lst_table_db[i] +'</td><td>'+ lst_table_db[i+1] +'</td><td>'+ lst_table_db[i+2] +'</td></tr>';
							$("#table_db tbody:last").append(str);
						}
					}else{*/
						var str='<tr><td>'+ lst_table_db[i] +'</td><td>'+ lst_table_db[i+1] +'</td><td>'+ lst_table_db[i+2] +'</td></tr>';
						$("#table_db tbody:last").append(str);
					//}
				}

			}


			//vm
			for(var i=0; i < lst_table_vm.length; i=i+6){
				var idVM= null;
				//boucle sur la liste vm id pour recup l'id
				$.each(lst_vm_id, function(index, value){
					//si index correspond a name
					if(lst_table_vm[i+1] == index){
						idVM = value;
					}
				});

				//creation de lien VM
				if(idVM != null){
					//si le parametre ci n'est pas null on affiche seulement le ci concerné
				/*	if($('#ciName').val()!=''){
						if(lst_table_vm[i+1] == $('#ciName').val().toUpperCase()){
							var str='<tr><td>'+ lst_table_vm[i] +'</td><td><a href="'+ iTopCIUrl+ idVM +'" target="_blank">'+ lst_table_vm[i+1] +'</a></td><td>'+ lst_table_vm[i+2] +'</td> <td>'+ lst_table_vm[i+3] +'</td><td>'+ lst_table_vm[i+4] +'</td><td><a href="'+ lst_table_vm[i+5] +'" target="_blank">'+ lst_table_vm[i+5] +'</a></td></tr>';
							$("#table_vm tbody:last").append(str);
						}
					}else{*/
							var str='<tr><td>'+ lst_table_vm[i] +'<button type="button" class="btn btn-primary pencil" data-toggle="modal" data-target="#exampleModal"><i class="fa fa-pencil"></i></button></td><td><a href="'+ iTopCIUrl+ idVM +'" target="_blank">'+ lst_table_vm[i+1] +'</a></td><td>'+ lst_table_vm[i+2] +'</td><td>'+ lst_table_vm[i+3] +'</td><td>'+ lst_table_vm[i+4] +'</td><td><a href="'+ lst_table_vm[i+5] +'" target="_blank">'+ lst_table_vm[i+5] +'</a></td></tr>';
							$("#table_vm tbody:last").append(str);
					//}
				}else{
					/*if($('#ciName').val()!=''){
						if(lst_table_vm[i+1] == $('#ciName').val().toUpperCase()){
							var str='<tr><td>'+ lst_table_vm[i] +'</td><td>'+ lst_table_vm[i+1] +'</td><td>'+ lst_table_vm[i+2] +'</td><td>'+ lst_table_vm[i+3] +'</td><td>'+ lst_table_vm[i+4] +'</td><td><a href="'+ lst_table_vm[i+5] +'" target="_blank">'+ lst_table_vm[i+5] +'</a></td></tr>';
							$("#table_vm tbody:last").append(str);
						}
					}else{*/
						var str='<tr><td>'+ lst_table_vm[i] +'</td><td>'+ lst_table_vm[i+1] +'</td><td>'+ lst_table_vm[i+2] +'</td><td>'+ lst_table_vm[i+3] +'</td><td>'+ lst_table_vm[i+4] +'</td><td><a href="'+ lst_table_vm[i+5] +'" target="_blank">'+ lst_table_vm[i+5] +'</a></td></tr>';
						$("#table_vm tbody:last").append(str);
					//}
				}
			}

		}


	}
	//sil n'y a pas de CIs
	else{

		//deuxieme chargement si premier passage pour etre sur psk desfois ça marche pas lol
		if(passage==2){
			loadPageAfficheCI();
		}else{
			var str='<tr><td COLSPAN=3>Il n\'y a aucune base de données</td></tr>';
			$("#table_db tbody:last").append(str);
			var strv='<tr><td COLSPAN=3>Il n\'y a aucune machine virtuelle</td></tr>';
			$("#table_vm tbody:last").append(strv);
		}
	}
  $(".pencil").click(function(){
    var ci = $(this).parent().next("td").text();
    ciModif=ci;
    $("#exampleModalLabel").text("Modifier CI "+ci);
  });

}




/****
** APPEL AJAX
******/
/**
* 2
* ajax pour functionalIC
**/
function ajaxFunctionalCICI(){
	$.ajax({
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(oJSON)},
		crossDomain: 'true',
		success: function (data){
			console.log(data['objects']);
			refreshSuccessfullCI(data);
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";

		}
	});
}

/**
* 4
* ajax pour databaseschema
**/
function ajaxDBSCI(){
	console.log("ajaxdbs");
	$.ajax(
	 {
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(yJSON)},
		crossDomain: 'true',
		success: function (data) {
			dbs = data["objects"];
			ajaxVMCI();
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";

		}
	});
}

/**
* 5
* ajax pour virtualmachine
**/
function ajaxVMCI(){
	console.log("ajaxvm");
	 $.ajax({
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(zJSON)},
		crossDomain: 'true',
		success: function (data) {
			vm = data["objects"];
			console.log(data["objects"]);
			ajaxlnkSolutionToCICI();
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";

		}
	});

}

// 6
//appel ajax pour lnkSolutionToCI
function ajaxlnkSolutionToCICI(){
	console.log("ajaxsoltoci");
	//ajax pour avoir un objet lnkSolutionToCI
	$.ajax(
	{
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(xJSON)},
		crossDomain: 'true',
		success: function (data) {
			lnk = data["objects"];
			//chargementPage(fcis, lnk);
			ajaxlnkContactToContractCI();
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";

		}
	});
}

/**
* 7
* ajax pour lnkContactToContract
**/
function ajaxlnkContactToContractCI(){
	console.log("ajaxcontactcontract");
	//ajax pour avoir un objet Contat
	$.ajax(
	{
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(aJSON)},
		crossDomain: 'true',
		success: function (data) {
			contact = data["objects"];
			ajaxContactCI();
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";

		}
	});
}

/**
* 8
* ajax pour contact
**/
function ajaxContactCI(){
	console.log("lastAjax");
	//ajax pour avoir un objet Contat
	$.ajax(
	{
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(bJSON)},
		crossDomain: 'true',
		success: function (data) {
			contactDetails = data["objects"];
			chargementPageCI(fcis, lnk);
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";

		}
	});
}


/****
** FIN APPEL AJAX
******/

/****
** REQUETES
******/
/**
* pour un objet FunctionalCI
**/
function GetBacklogRequestCI(){
	// renvoi les bd et vm de dev du client
	var request = 'SELECT fci FROM FunctionalCI AS fci';
	request = request + ' JOIN lnkSolutionToCI AS inkstoci ON inkstoci.ci_id = fci.id';
	request = request + ' JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id';
	request = request + ' JOIN Environment AS env ON aps.environment_id = env.id';
	request = request + ' JOIN Organization AS org ON aps.org_id = org.id';
	request = request + ' WHERE (env.name = "Développement")';
	request = request + ' AND (fci.finalclass="databasecluster" OR fci.finalclass="VirtualMachine" OR fci.finalclass="DatabaseSchema")';
	// request = request + ' AND (fci.owner_name = "HARDIS GROUPE" OR fci.owner_name = "Reflex")';
	request = request + ' AND (org.name = "'+ nomOrg +'")';

	return request;
}

/**
* pour un objet de type lnkSolutionToCI
**/
function GetBacklogRequestLnkCI(){
	// renvoi les bd et vm de dev du client
	var request = 'SELECT inkstoci FROM lnkSolutionToCI AS inkstoci';
	request = request + ' JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id';
	request = request + ' JOIN FunctionalCI AS fci ON  inkstoci.ci_id = fci.id';
	request = request + ' JOIN Environment AS env ON aps.environment_id = env.id';
	request = request + ' JOIN Organization AS org ON aps.org_id = org.id';
	request = request + ' WHERE (env.name = "Développement")';
	request = request + ' AND (fci.finalclass="databasecluster" OR fci.finalclass="VirtualMachine" OR fci.finalclass="DatabaseSchema")';
	// request = request + ' AND (fci.owner_name = "HARDIS GROUPE" OR fci.owner_name = "Reflex")';
	request = request + ' AND (org.name = "'+ nomOrg +'")';

	return request;
}

/**
* pour un objet de type datbaseschema
**/
function GetBacklogRequestDBSCI(){
	var request = 'SELECT dbs FROM DatabaseSchema AS dbs';
	request = request + ' JOIN lnkSolutionToCI AS inkstoci ON inkstoci.ci_id = dbs.id';
	request = request + ' JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id';
	request = request + ' JOIN Environment AS env ON aps.environment_id = env.id';
	request = request + ' JOIN Organization AS org ON aps.org_id = org.id';
	request = request + ' WHERE (env.name = "Développement")';
	// request = request + ' AND (dbs.owner_name = "HARDIS GROUPE" OR dbs.owner_name = "Reflex")';
	request = request + ' AND (org.name = "'+ nomOrg +'")';

	return request;
}

/**
* pour un objet de type VirtualMachine
**/
function GetBacklogRequestVMCI(){
	var request = 'SELECT vm FROM VirtualMachine AS vm';
	request = request + ' JOIN lnkSolutionToCI AS inkstoci ON inkstoci.ci_id = vm.id';
	request = request + ' JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id';
	request = request + ' JOIN Environment AS env ON aps.environment_id = env.id';
	request = request + ' JOIN Organization AS org ON aps.org_id = org.id';
	request = request + ' WHERE (env.name = "Développement")';
	// request = request + ' AND (vm.owner_name = "HARDIS GROUPE" OR vm.owner_name = "Reflex")';
	request = request + ' AND (org.name = "'+ nomOrg +'")';

	return request;
}


/**
* pour un objet de type lnkContactToContract
**/
function GetBacklogRequestlnkContactToContractCI(){
	var request = 'SELECT link';
	request = request + ' FROM lnkContactToContract AS link';
	request = request + ' JOIN Contact AS ctc ON link.contact_id = ctc.id';
	request = request + ' JOIN Contract AS ctr ON link.contract_id = ctr.id';
	request = request + ' JOIN Organization AS org ON ctr.org_id=org.id ';
	request = request + ' WHERE org.name="'+ nomOrg +'"';
	request = request + ' AND ctc.status = "Active"';
	request = request + ' AND ctc.finalclass="Person"';
	request = request + ' AND link.contract_name LIKE "%WMS"';

	return request;
}

/**
* pour un objet de type Contact
**/
function GetBacklogRequestContactCI(){
	var request = 'SELECT ctc ';
	request = request + ' FROM Contact AS ctc';
	request = request + ' JOIN lnkContactToContract AS link ON link.contact_id = ctc.id';
	request = request + ' JOIN Contract AS ctr ON link.contract_id = ctr.id';
	request = request + ' JOIN Organization AS org ON ctr.org_id=org.id ';
	request = request + ' WHERE org.name="'+ nomOrg +'"';
	request = request + ' AND ctc.status = "Active"';
	request = request + ' AND ctc.finalclass="Person"';
	request = request + ' AND link.contract_name LIKE "%WMS"';

	return request;
}

/****
** FIN REQUETES
******/


/**
**	FONCTIONS UTILES
**/

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
* fonction de tri de tableau en fonction de by
**/
function triBy(by, tab){
	var i ,j ,tmp;

    for(j=0;j<=getSizeTabIndex(tab)-1;j++){
        for(i=0;i<=getSizeTabIndex(tab)-1;i++){
			if(tab[i+1]!= null){
				if(tab[i]['fields'][by] > tab[i+1]['fields'][by]){
					tmp = tab[i];
					tab[i] = tab[i+1];
					tab[i+1] = tmp;
				}
			}
		}
	}

}

/**
* Retourne toutes les colonne de DatabaseCluster en string utile pour oJSON
**/
function GetWSColumnsAsStringCI()
{
	//nom des colonnes qui nous interessent
	var col =  'name, org_id, owner_name, ciowner_id, ciowner_name, environment_id, environment_name, description, url, publicpassword_list, privatepassword_list, contract_list, providercontract_list, policies_list, standby_id, standby_name, status, finalclass, friendlyname, org_id_friendlyname, ciowner_id_friendlyname, environment_id_friendlyname, standby_id_friendlyname';	//var col =  'finalclass';
	col = col.trim();
	return col;
}
