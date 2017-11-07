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

	
/**	
* 1 (numéro d'execution)
* fonction appelée par la fonction loadPageSelectInfo (fichier load_selectInfo) /no = index of client courant dans la liste 
**/
function loadPageCI(no){
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
			key: GetBacklogRequestCI(no),
			output_fields: GetWSColumnsAsStringCI()
		};
		
		// Json request for linksoltoci
		xJSON = {
			operation: 'core/get',
			'class': 'lnkSolutionToCI',
			key: GetBacklogRequestLnkCI(no),
			output_fields: "utility, ci_id"
		};
		
		// Json request for databaseschema
		yJSON = {
				operation: 'core/get',
				'class': 'DatabaseSchema',
				key: GetBacklogRequestDBSCI(no),
				output_fields: "id, name, db_environment_server_name, db_environment_server_name_friendlyname, status"
		};
		
		// Json request for virtualmachine
		zJSON = {
				operation: 'core/get',
				'class': 'VirtualMachine',
				key: GetBacklogRequestVMCI(no),
				output_fields: "id, name, mgmt_ip, osfamily_name, osversion_name, virtualcluster_name, status"
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
	
	//appel ajax pour FunctionalCI
	ajaxFunctionalCICI(no);
	
}




/****
** APPEL AJAX
******/

/**
* 2
* appel ajax pour functionalIC / no = index of client courant dans la liste 
**/
function ajaxFunctionalCICI(no){
	$.ajax({
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(oJSON)},
		crossDomain: 'true',
		success: function (data){
			refreshSuccessfullCI(data, no);
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";
						
		}
	});
}

/**
* 4
* appel ajax pour databaseschema / no = index of client courant dans la liste 
**/
function ajaxDBSCI(no){	
	// console.log("ajaxdbs");
	$.ajax(
	 {
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(yJSON)},
		crossDomain: 'true',
		success: function (data) {
			dbs = data["objects"];	
			ajaxVMCI(no);
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";
						
		}
	});
}

/**
* 5
* appel ajax pour virtualmachine / no = index of client courant dans la liste 
**/
function ajaxVMCI(no){
	// console.log("ajaxvm");
	 $.ajax({
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(zJSON)},
		crossDomain: 'true',
		success: function (data) {
			vm = data["objects"];
			ajaxlnkSolutionToCICI(no);
		},
		error: function (data) {
			document.getElementById("backlogHardisListId").innerHTML = "Erreur. Connectez-vous sur iTop";
						
		}
	});	
	
}

/**
* 6
* appel ajax pour lnkSolutionToCI / no = index of client courant dans la liste 
**/
function ajaxlnkSolutionToCICI(no){
	// console.log("ajaxsoltoci");
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
			chargementPageCI(fcis, lnk, no);		
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
function GetBacklogRequestCI(no){
	// renvoi les bd et vm de dev du client 
	var request = 'SELECT fci FROM FunctionalCI AS fci';
	request = request + ' JOIN lnkSolutionToCI AS inkstoci ON inkstoci.ci_id = fci.id';
	request = request + ' JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id';
	request = request + ' JOIN Environment AS env ON aps.environment_id = env.id';
	request = request + ' JOIN Organization AS org ON aps.org_id = org.id';
	request = request + ' WHERE (env.name = "Développement")';
	request = request + ' AND (fci.finalclass="databasecluster" OR fci.finalclass="VirtualMachine" OR fci.finalclass="DatabaseSchema")';
	// request = request + ' AND (fci.owner_name = "HARDIS GROUPE" OR fci.owner_name = "Reflex")';
	request = request + ' AND (org.name = "'+ no +'")';
	
	return request;
}

//pour un objet de type lnkSolutionToCI / no = index of client courant dans la liste 
function GetBacklogRequestLnkCI(no){
	// renvoi les bd et vm de dev du client 
	var request = 'SELECT inkstoci FROM lnkSolutionToCI AS inkstoci';
	request = request + ' JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id';
	request = request + ' JOIN FunctionalCI AS fci ON  inkstoci.ci_id = fci.id';
	request = request + ' JOIN Environment AS env ON aps.environment_id = env.id';
	request = request + ' JOIN Organization AS org ON aps.org_id = org.id';
	request = request + ' WHERE (env.name = "Développement")';
	request = request + ' AND (fci.finalclass="databasecluster" OR fci.finalclass="VirtualMachine" OR fci.finalclass="DatabaseSchema")';
	// request = request + ' AND (fci.owner_name = "HARDIS GROUPE" OR fci.owner_name = "Reflex")';
	request = request + ' AND (org.name = "'+ no +'")';
		
	return request;
}


//pour un objet de type datbaseschema / no = index of client courant dans la liste 
function GetBacklogRequestDBSCI(no){
	var request = 'SELECT dbs FROM DatabaseSchema AS dbs';
	request = request + ' JOIN lnkSolutionToCI AS inkstoci ON inkstoci.ci_id = dbs.id';
	request = request + ' JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id';
	request = request + ' JOIN Environment AS env ON aps.environment_id = env.id';
	request = request + ' JOIN Organization AS org ON aps.org_id = org.id';
	request = request + ' WHERE (env.name = "Développement")';
	// request = request + ' AND (dbs.owner_name = "HARDIS GROUPE" OR dbs.owner_name = "Reflex")';
	request = request + ' AND (org.name = "'+ no +'")';
	
	return request;
}

//pour un objet de type VirtualMachine / no = index of client courant dans la liste 
function GetBacklogRequestVMCI(no){
	var request = 'SELECT vm FROM VirtualMachine AS vm';
	request = request + ' JOIN lnkSolutionToCI AS inkstoci ON inkstoci.ci_id = vm.id';
	request = request + ' JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id';
	request = request + ' JOIN Environment AS env ON aps.environment_id = env.id';
	request = request + ' JOIN Organization AS org ON aps.org_id = org.id';
	request = request + ' WHERE (env.name = "Développement")';
	// request = request + ' AND (vm.owner_name = "HARDIS GROUPE" OR vm.owner_name = "Reflex")';
	request = request + ' AND (org.name = "'+ no +'")';
	
	return request;
}


/****
** FIN REQUETES
******/	

/**
* 3
* Check si connexion itop + affichage et appel ajaxDBSC / no = index of client courant dans la liste I
*/
function refreshSuccessfullCI(data, no){
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
	else
	{	
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
			ajaxDBSCI(no);	
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
* 8
* charge le contenu des tableaux / no = index of client courant dans la liste  
**/
function chargementPageCI(dataObjFcis, dataObjLnk, no){	
	var currentIndex= lesClients.indexOf(no);
 	
	var divOrg = $("#content_CIOrg");
	var h3 = document.createElement('h3');
	h3.innerHTML=no;
	divOrg.append(h3);
		
	
	//creation de la structure html
	//DB
	var div_db = document.createElement('div');
	div_db.className= 'div_CIs';
	//id nom du client sans espace
	div_db.id= 'div_db_CI_'+currentIndex;
	h3.after(div_db);
	
	var div_table= document.createElement('div');
	div_table.className= 'div_table';
	div_db.append(div_table);
	
	var table_db= document.createElement('table');
	table_db.className= 'table';
	table_db.id= 'table_db_'+currentIndex;
	div_table.append(table_db);
	
	var caption= document.createElement('caption');
	caption.innerHTML="Liste des bases de données du client (Adélia et SQL)";
	table_db.append(caption);
	
	var thead = document.createElement('thead');
	caption.after(thead);
	
	var tr = document.createElement('tr');
	thead.append(tr);
	
	var th1 = document.createElement('th');
	th1.innerHTML="Utilisation";
	tr.append(th1);
	
	var th2 = document.createElement('th');
	th2.innerHTML="CI";
	th1.after(th2);
	
	var th3 = document.createElement('th');
	th3.innerHTML="Système";
	th2.after(th3);
	
	var tbody = document.createElement('tbody');
	thead.after(tbody);
	
	//VM
	var div_vm = document.createElement('div');
	div_vm.className= 'div_CIs';
	//id nom du client sans espace
	div_vm.id= 'div_vm_CI_'+currentIndex;
	$('#div_db_CI_'+currentIndex).after(div_vm);
	
	var div_table_vm= document.createElement('div');
	div_table_vm.className= 'div_table';
	div_vm.append(div_table_vm);
	
	var table_vm= document.createElement('table');
	table_vm.className= 'table';
	table_vm.id= 'table_vm_'+currentIndex;
	div_table_vm.append(table_vm);
	
	var caption= document.createElement('caption');
	caption.innerHTML="Liste des machines virtuelles du client";
	table_vm.append(caption);
	
	var thead = document.createElement('thead');
	caption.after(thead);
	
	var tr = document.createElement('tr');
	thead.append(tr);
	
	var th1 = document.createElement('th');
	th1.innerHTML="Utilisation";
	tr.append(th1);
	
	var th2 = document.createElement('th');
	th2.innerHTML="CI";
	th1.after(th2);
	
	var th3 = document.createElement('th');
	th3.innerHTML="IP";
	th2.after(th3);
	
	var th4 = document.createElement('th');
	th4.innerHTML="ESX / Cluster";
	th3.after(th4);
	
	var th5 = document.createElement('th');
	th5.innerHTML="Famille OS";
	th4.after(th5);
	
	var th6 = document.createElement('th');
	th6.innerHTML="Version OS";
	th5.after(th6);
	
	var tbody = document.createElement('tbody');
	thead.after(tbody);
	
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
		var length=0;
		$.each(dataObjFcis, function(index, value){
			$.each(dbs, function(inde, valu){
				//si cest une db et si y a un databaseshema
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
						lst_table_vm.push(value['fields']['virtualcluster_name']);
						lst_table_vm.push(value['fields']['osfamily_name']);
						lst_table_vm.push(value['fields']['osversion_name']);
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
					//si le parametre ci n'est pas null on affiche seulement le ci concerné
					if($_GET('ciName')!=null){
						if(lst_table_db[i+1] == $_GET('ciName').toUpperCase()){
							var str='<tr><td>'+ lst_table_db[i] +'</td><td><a href="'+ iTopCIUrl+ idDB +'" target="_blank">'+ lst_table_db[i+1] +'</a></td><td>'+ lst_table_db[i+2] +'</td></tr>';	
							$("#table_db_"+currentIndex+" tbody:last").append(str);
						}
					}else{
						var str='<tr><td>'+ lst_table_db[i] +'</td><td><a href="'+ iTopCIUrl+ idDB +'" target="_blank">'+ lst_table_db[i+1] +'</a></td><td>'+ lst_table_db[i+2] +'</td></tr>';	
						$("#table_db_"+currentIndex+" tbody:last").append(str);
					}
					
				}else{
					if($_GET('ciName')!=null){
						if(lst_table_db[i+1] == $_GET('ciName').toUpperCase()){
							var str='<tr><td>'+ lst_table_db[i] +'</td><td>'+ lst_table_db[i+1] +'</td><td>'+ lst_table_db[i+2] +'</td></tr>';	
							$("#table_db_"+currentIndex+" tbody:last").append(str);
						}
					}else{
						var str='<tr><td>'+ lst_table_db[i] +'</td><td>'+ lst_table_db[i+1] +'</td><td>'+ lst_table_db[i+2] +'</td></tr>';	
						$("#table_db_"+currentIndex+" tbody:last").append(str);
					}
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
					if($_GET('ciName')!=null){
						if(lst_table_vm[i+1] == $_GET('ciName').toUpperCase()){
							var str='<tr><td>'+ lst_table_vm[i] +'</td><td><a href="'+ iTopCIUrl+ idVM +'" target="_blank">'+ lst_table_vm[i+1] +'</a></td><td>'+ lst_table_vm[i+2] +'</td> <td>'+ lst_table_vm[i+3] +'</td><td>'+ lst_table_vm[i+4] +'</td><td>'+ lst_table_vm[i+5] +'</td></tr>';	
							$("#table_vm_"+ currentIndex +" tbody:last").append(str);
						}
					}else{
							var str='<tr><td>'+ lst_table_vm[i] +'</td><td><a href="'+ iTopCIUrl+ idVM +'" target="_blank">'+ lst_table_vm[i+1] +'</a></td><td>'+ lst_table_vm[i+2] +'</td><td>'+ lst_table_vm[i+3] +'</td><td>'+ lst_table_vm[i+4] +'</td><td>'+ lst_table_vm[i+5] +'</td></tr>';	
							$("#table_vm_"+ currentIndex +" tbody:last").append(str);
					}	
				}else{
					if($_GET('ciName')!=null){
						if(lst_table_vm[i+1] == $_GET('ciName').toUpperCase()){
							var str='<tr><td>'+ lst_table_vm[i] +'</td><td>'+ lst_table_vm[i+1] +'</td><td>'+ lst_table_vm[i+2] +'</td><td>'+ lst_table_vm[i+3] +'</td><td>'+ lst_table_vm[i+4] +'</td><td>'+ lst_table_vm[i+5] +'</td></tr>';	
							$("#table_vm_"+ currentIndex +" tbody:last").append(str);
						}
					}else{	
						var str='<tr><td>'+ lst_table_vm[i] +'</td><td>'+ lst_table_vm[i+1] +'</td><td>'+ lst_table_vm[i+2] +'</td><td>'+ lst_table_vm[i+3] +'</td><td>'+ lst_table_vm[i+4] +'</td><td>'+ lst_table_vm[i+5] +'</td></tr>';	
						$("#table_vm_"+ currentIndex +" tbody:last").append(str);
					}
				}
			}
				
		}
			
	console.log("lst_table_vm de "+no);
	console.log(lst_table_vm);
	console.log("lst_table_db de "+no);
	console.log(lst_table_db);
	}
	//sil n'y a pas de CIs
	else{
		var str='<tr><td COLSPAN=3>Il n\'y a aucune base de données</td></tr>';	
		$("#table_db_"+currentIndex+" tbody:last").append(str);
		var strv='<tr><td COLSPAN=3>Il n\'y a aucune machine virtuelle</td></tr>';	
		$("#table_vm_"+currentIndex+" tbody:last").append(strv);
	}
	
	//pour savoir si y a un element suivant dans la liste des clients
	var nextIndex = lesClients.indexOf(no)+1;
	if(lesClients[nextIndex]){
		loadPageCI(lesClients[nextIndex]);
	}else{
		//stop chargement animation
		spinner.stop(spinner_div);
		
		//ferme le popup d'avertissement
		$(".popup").fadeOut();
	
	}
		
}

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
	var col =  'name, org_id, owner_name, ciowner_id, ciowner_name, environment_id, environment_name, description, url, publicpassword_list, privatepassword_list, contract_list, providercontract_list, policies_list, standby_id, standby_name, status, finalclass, friendlyname, org_id_friendlyname, ciowner_id_friendlyname, environment_id_friendlyname, standby_id_friendlyname';
	//var col =  'finalclass';
	col = col.trim();
	return col;
}




