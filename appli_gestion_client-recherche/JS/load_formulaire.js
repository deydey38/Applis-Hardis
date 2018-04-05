
$(function(){
	$("#displayTF").click(function(){
		if($("#displayTF").is(":checked")){
			$("#tableTicketF").show();
		}else{
			$("#tableTicketF").hide();
		}
	});

	$('#client').val('');
	$('#ciName').val('');

	// autocompletion pour les client
	$('#client').autocomplete({
		source : function(requete, reponse){ // requete, reponse = données nécessaires au plugin
			// Json request
			var str = $('#client').val();
			var str = str.replace(/'/g, "\\'");
			var oJSON={
				operation: 'core/get',
				'class': 'Organization',
				key: "SELECT org FROM Organization AS org WHERE( org.name LIKE '%" + str + "%')",
				output_fields: 'name'
			};

			$.ajax({
				type: "GET",
				url: ITOP_WS_URL,
				dataType: 'jsonp',
				data : {
					client_firstChar : $('#client').val(), // on donne la chaîne de caractère tapée dans le champ de recherche
					maxRows : 5,
					json_data: JSON.stringify(oJSON)
				},

				success : function(donnee){
					var lst = new Array;
					$.each(donnee['objects'], function(index, value){
						lst.push(value['fields']['name']);
					});
					reponse($.map(lst, function(obj){
						return obj; // on retourne cette forme de suggestion
					}));
				}
			});

		},
		select: function (event, ui) {
        $("#client").val(ui.item.value);
        $("#formC").submit();
    },
		minLength : 3,
		//soumission auto quand click sur proposition
		// select: function (event, ui){
			// $('#client').val(ui.item.label);
			// $("#formC").submit();
		// },

	});


	//soumission du formulaire
	$("#formC").submit(function(e){
		//pas de rechargement de page
		e.preventDefault();

		$('#alertFormError').fadeOut();

		var ok = true;

		// rien n'est renseigné
		if($('#client').val()=='' && $('#ciName').val()==''){
			$('#alertFormError').text("Veuillez renseigner au moins un champs...");
			$('#alertFormError').fadeIn();

		}else{

			//json exist client
			var iJSON = {
				operation: 'core/get',
				'class': 'Organization',
				key: "SELECT org FROM Organization AS org WHERE org.name='"+$('#client').val()+"'",
				output_fields: "name"
			};

			//si un client est renseigné et que le ci ne l'est pas
			if($('#client').val()!='' && $('#ciName').val()==''){

				//ajax pour savoir si le client existe
				$.ajax(
				{
					type: "GET",
					url: ITOP_WS_URL,
					dataType: 'jsonp',
					data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(iJSON)},
					crossDomain: 'true',
					success: function(data){
						//le nom du client n'existe pas
						if(data.message == "Found: 0"){
							ok = false;
							$('#alertFormError').text("Désolé, ce client n'existe pas ou n'est pas présent dans iTop");
							$('#alertFormError').fadeIn();
						}else{
							nomOrg= $('#client').val();
							//testOK();
							CDS();
						}
					},
					error: function(data){
						ok = false;
					}
				});
			}


			//si un ci et un client sont renseignés
			if($('#ciName').val()!='' && $('#client').val()!=''){
				//si client existe
				//ajax pour savoir si le client existe
				$.ajax(
				{
					type: "GET",
					url: ITOP_WS_URL,
					dataType: 'jsonp',
					data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(iJSON)},
					crossDomain: 'true',
					success: function(data){
						//le nom du client n'existe pas
						if(data.message == "Found: 0"){
							ok = false;
							$('#alertFormError').text("Désolé, le client n'existe pas ou n'est pas présent dans iTop");
							$('#alertFormError').fadeIn();
						}
						//le client existe
						else{
							var requestFCIClient = 'SELECT fci FROM FunctionalCI AS fci';
							requestFCIClient = requestFCIClient + ' JOIN lnkSolutionToCI AS inkstoci ON inkstoci.ci_id = fci.id';
							requestFCIClient = requestFCIClient + ' JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id';
							requestFCIClient = requestFCIClient + ' JOIN Environment AS env ON aps.environment_id = env.id';
							requestFCIClient = requestFCIClient + ' JOIN Organization AS org ON aps.org_id = org.id';
							requestFCIClient = requestFCIClient + ' WHERE (env.name = "Développement")';
							requestFCIClient = requestFCIClient + ' AND (fci.finalclass="databasecluster" OR fci.finalclass="VirtualMachine" OR fci.finalclass="DatabaseSchema")';
							requestFCIClient = requestFCIClient + ' AND (fci.name = "' + $('#ciName').val() + '")';
							requestFCIClient = requestFCIClient + ' AND (org.name="'+$('#client').val()+'")';

							//json exist client pour ci
							var jJSON = {
								operation: 'core/get',
								'class': 'Organization',
								key: requestFCIClient,
								output_fields: "name"
							};


							//ajax pour savoir si le client et le ci existent
							$.ajax({
								type: "GET",
								url: ITOP_WS_URL,
								dataType: 'jsonp',
								data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(jJSON)},
								crossDomain: 'true',
								success: function(data){
									//pas de correspondance
									if(data.message == "Found: 0"){
										ok = false;
										$('#alertFormError').text("Désolé, il n'y a pas de correspondance entre le client et le CI");
										$('#alertFormError').fadeIn();
									}else{
										nomOrg= $('#client').val();
										//testOK();
										CDS();
									}

								},
								error: function(data){
									ok = false;
								}
							});

						}
					},
					error: function(data){
						ok = false;
					}
				});

			}


			//si un CI est renseigné et le client ne l'est pas
			if($('#ciName').val()!='' && $('#client').val()==''){

				var requestFCIClient = 'SELECT org FROM FunctionalCI AS fci';
				requestFCIClient = requestFCIClient + ' JOIN lnkSolutionToCI AS inkstoci ON inkstoci.ci_id = fci.id';
				requestFCIClient = requestFCIClient + ' JOIN ApplicationSolution AS aps ON inkstoci.solution_id = aps.id';
				requestFCIClient = requestFCIClient + ' JOIN Environment AS env ON aps.environment_id = env.id';
				requestFCIClient = requestFCIClient + ' JOIN Organization AS org ON aps.org_id = org.id';
				requestFCIClient = requestFCIClient + ' WHERE (env.name = "Développement")';
				requestFCIClient = requestFCIClient + ' AND (fci.finalclass="databasecluster" OR fci.finalclass="VirtualMachine" OR fci.finalclass="DatabaseSchema")';
				requestFCIClient = requestFCIClient + ' AND (fci.name = "' + $('#ciName').val() + '")';

				//json exist client pour ci
				var jJSON = {
					operation: 'core/get',
					'class': 'Organization',
					key: requestFCIClient,
					output_fields: "name"
				};

				// ajax trouvage du client par rapport au ci
				$.ajax({
					type: "GET",
					url: ITOP_WS_URL,
					dataType: 'jsonp',
					data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(jJSON)},
					crossDomain: 'true',
					success: function(data){
						console.log(data);
						//pas de correspondance
						if(data.message == "Found: 0"){
							ok = false;
							$('#alertFormError').text("Désolé, le client du CI n'a pas été trouvé ou le CI n'existe pas");
							$('#alertFormError').fadeIn();
						}else{
							//renseigné le client correspondant au ci
							$.each(data['objects'], function(index, value){
								nomOrg=value['fields']['name'];

								$('#client').val(nomOrg);
							});
							console.log("nom organisation : " + nomOrg);
							//testOK();
							CDS();
						}

					},
					error: function(data){
						ok = false;
					}
				});
			}
		}
	});


	if(clientGet==null){
		console.log("get clientGet null");
	}else{
		console.log("get collabo : "+clientGet);
		var nomClient = clientGet.replace(/%20/g, " ");
		$("#client").val(nomClient);
		console.log("nom collabo : "+nomClient);
		$("#formC").submit();
	}

	//faire disparaitre le message d'erreur
	$( "#client" ).click(function() {
	  $( "#alertFormError" ).fadeOut();
	});

	$( "#ciName" ).click(function() {
	  $( "#alertFormError" ).fadeOut();
	});
});

function CDS(){
	//récuperer le CDS du client

	function getContactWMS(){
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
		key: getContactWMS(),
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
			testOK();
		},
		error: function(data){
			console.log("cds error");
		}
	});
}

function contractClient(){
	function getContratWMS(){
		var requete = 'SELECT CustomerContract AS cc ';
		requete += 'JOIN Organization AS org ON cc.org_id=org.id ';
		requete += 'WHERE org.name="'+nomOrg+'"';
		return requete;
	}

	contratJSON = {
		operation: 'core/get',
		'class': 'CustomerContract',
		key: getContratWMS(),
		output_fields: "name, status, provider_name, auto_close_ticket, closure_delay, start_date, end_date, services_list"
	}

	$.ajax({
		type: "GET",
		url: ITOP_WS_URL,
		dataType: 'jsonp',
		data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(contratJSON)},
		crossDomain: 'true',
		success: function(data){
			$(".body-contrat").html("");
			if(data == null){
				$(".table-contrat").hide();
				$(".contrat").html("Pas de contrat avec ce client.")
			}else{
				var rep = data['objects'];
				/*console.log(data);
				console.log(rep);*/
				$.each(rep, function(index, value){
					//console.log("contrat : "+value['fields']['services_list']);
					var tr_contrat = document.createElement("tr");
					var nom = document.createElement("td");
					var statut = document.createElement("td");
					var fournisseur = document.createElement("td");
					var cloture_auto = document.createElement("td");
					var delai = document.createElement("td");
					var debut = document.createElement("td");
					var fin = document.createElement("td");

					var tr_tab_service = document.createElement("tr");
					var tab_service = document.createElement("table");
					var head = document.createElement("thead");
					var tr_head_service = document.createElement("tr");
					var service = document.createElement("th");
					var heure = document.createElement("th");
					var sla = document.createElement("th");
					var body_service = document.createElement("tbody");

					$(tab_service).addClass("table table-bordered table-service");
					$(tr_head_service).addClass("thead-light");
					$(tr_contrat).addClass("contrat-row");

					$(nom).html(value['fields']['name']);
					$(statut).html(value['fields']['status']);
					$(fournisseur).html(value['fields']['provider_name']);
					$(cloture_auto).html(value['fields']['auto_close_ticket']);
					$(delai).html(value['fields']['closure_delay']);
					$(debut).html(value['fields']['start_date']);
					$(fin).html(value['fields']['end_date']);

					$(tr_tab_service).html("<td colspan='7' class='td_tab_service'></td>");

					$(tr_tab_service).hide();

					$(service).html("Service");
					$(heure).html("Heures ouvrées");
					$(sla).html("SLA");

					$(".body-contrat").append(tr_contrat);
					$(tr_contrat).append(nom);
					$(tr_contrat).append(statut);
					$(tr_contrat).append(fournisseur);
					$(tr_contrat).append(cloture_auto);
					$(tr_contrat).append(delai);
					$(tr_contrat).append(debut);
					$(tr_contrat).append(fin);
					$(tr_contrat).after(tr_tab_service);


					$(tr_tab_service).find(".td_tab_service").append(tab_service);
					$(tab_service).append(head);
					$(head).append(tr_head_service);
					$(tr_head_service).append(service);
					$(tr_head_service).append(heure);
					$(tr_head_service).append(sla);
					$(tab_service).append(body_service);

					var list_services = value['fields']['services_list'];

					$.each(list_services, function(index, value){
						var service_name = value['service_name'];
						var heures_ouvrees = value['coveragewindow_id_friendlyname'];
						var sla = value['sla_id_friendlyname'];
						console.log(service_name+" ; "+heures_ouvrees+" ; "+sla);
						var service_tr = document.createElement("tr");
						$(service_tr).html("<td>"+service_name+"</td><td>"+heures_ouvrees+"</td><td>"+sla+"</td>");
						$(body_service).append(service_tr);
					});
				});

				$('.contrat-row').hover(function() {
        	$(this).css('cursor','pointer');
    		});

				$(".contrat-row").click(function(){
					$(this).next("tr").toggle();
				});

			}


		},
		error: function(data){
			console.log("contrat error");
		}
	});

}


/**
* charge l'onglet CI si formulaire ok
**/
function testOK(){

	if($("#valid").html() == "Rechercher"){
		$("#valid").html("Actualiser");
		console.log("bouton val rechercher");
	}
	$("#client").blur();
	$("#ciName").blur();
	ChangeOnglet('tab_CIs', 'content_CIs');

	//affichage des onglets
	$('.tabbed_area').show();
	nomOrg= $('#client').val();

	dejaVisiteContact=0;
	dejaVisiteBacklog=0;
	dejaVisiteDocCo=0;
	dejaVisiteContracts=0;

	$('body h1').text(" ");
	$('body h1').text("Bienvenue sur l'application de gestion du client " );
	$('body h1').css('width', '580px');
	$('h1 ~ h2').text(" ");
	$('h1 ~ h2').text(nomOrg.toUpperCase());
	$(".cds").text(cds);
	loadPageAfficheCI();

	//changer le style du formulaire
/*	$('#formC').css('background-color', '#efefef');
	$('#formC').css('margin-top', '2%');
	$('#formC').css('width', 'auto');
	$('#formC').css('box-shadow', 'none');
	$('#formC label').css('margin', '0');
	$('#formC label').css('color', 'black');
	$('#formC label').css('margin-right', '3px');
	$('#formC label').css('width', 'auto');
	$('#formC label').css('font-size', '18px');
	$('#formC label').css('display', 'inline-block');
	$('#formC p').css('display', 'inline-block');
	$('#formC p').css('color', 'black');
	$('#formC p').css('margin(left', '5px');
	$('#formC p').css('color', 'black');
	$('#formC p').css('margin-right', '5px');
	$('#formC p').css('width', 'auto');
	$('#formC p').css('font-size', '18px');

	$('#formC input').css('display', 'inline-block');
	$('#formC #valid').css('margin', 'auto');
	$('#formC #valid').css('padding', '3px 10px');
	$('#formC #valid').css('position', 'relative');
	$('#formC #valid').css('left', '1%');*/
	$("#refresh").show();
}
