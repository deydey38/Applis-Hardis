
$(function(){

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
			testOK();
		},
		error: function(data){
			console.log("cds error");
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
