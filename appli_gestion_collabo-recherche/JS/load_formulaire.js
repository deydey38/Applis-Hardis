$(function(){
	$('#collabo').val('');
	$("#displayTF").click(function(){
		if($("#displayTF").is(":checked")){
			$("#tableTicketF").show();
		}else{
			$("#tableTicketF").hide();
		}
	});
	// autocompletion pour les collabo
	$('#collabo').autocomplete({
		source : function(requete, reponse){ // requete, reponse = données nécessaires au plugin
			// Json request
			//key: 'SELECT ctc FROM Contact AS ctc JOIN lnkContactToContract  AS link ON link.contact_id=ctc.id WHERE ctc.status = "Active" AND ctc.finalclass="Person" AND ctc.email LIKE "%hardis%" AND ctc.friendlyname LIKE "%'+$('#collabo').val()+'%"',
			var str = $('#collabo').val();
			var str = str.replace(/'/g, "\\'");
			var oJSON={
				operation: 'core/get',
				'class': 'Contact',
				key: 'SELECT ctc FROM Contact AS ctc WHERE ctc.status = "Active" AND ctc.finalclass="Person" AND ctc.email LIKE "%hardis%" AND ctc.friendlyname LIKE "%'+str+'%"',
				output_fields: 'friendlyname'
			};

			$.ajax({
				type: "GET",
				url: ITOP_WS_URL,
				dataType: 'jsonp',
				data : {
					client_firstChar : $('#collabo').val(), // on donne la chaîne de caractère tapée dans le champ de recherche
					maxRows : 5,
					json_data: JSON.stringify(oJSON)
				},

				success : function(donnee){
					var lst = new Array;
					$.each(donnee['objects'], function(index, value){
						lst.push(value['fields']['friendlyname']);
					});

					console.log(donnee);
					console.log($('#collabo').val());

					reponse($.map(lst, function(obj){
						return obj; // on retourne cette forme de suggestion
					}));
				}
			});
		},

		minLength : 3,
		select: function (event, ui){
			$('#collabo').val(ui.item.label);
			$("#formC").submit();
		},

	});

	$("#formC").submit(function(e){
		lesClients=null;
		dejaVisiteCIsOrg=0;
		dejaVisiteOrg=0;
		dejaVisiteBacklog=0;
		//pas de rechargement de page
		e.preventDefault();

		$('#alertFormError').fadeOut();

		var ok = true;

		//json exist collabo
		var iJSON = {
			operation: 'core/get',
			'class': 'Person',
			key: 'SELECT ctc FROM Contact AS ctc WHERE ctc.status = "Active" AND ctc.finalclass="Person" AND ctc.email LIKE "%hardis%" AND ctc.friendlyname = "'+$('#collabo').val()+'"',
			output_fields: "name, email, phone, first_name, mobile_phone, short_phone, site_name, function, team_list, org_name, information"
		};

		//ajax pour savoir si le collabo existe
		$.ajax(
		{
			type: "GET",
			url: ITOP_WS_URL,
			dataType: 'jsonp',
			data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(iJSON)},
			crossDomain: 'true',
			success: function(data){
				console.log("le collabo");
				console.log(data["objects"]);

				//le nom du collabo n'existe pas
				if(data.message == "Found: 0"){
					ok = false;
					if(!($("#collabo").val()=="") ){
						$('#alertFormError').text("Désolé, ce collaborateur n'existe pas");
						$('#alertFormError').fadeIn();
					}else{
						$('#alertFormError').text("Veuillez remplir le champs de saisie SVP");
						$('#alertFormError').fadeIn();
					}

				}else{
					var fields;
					var team;
					$.each(data['objects'], function(index, value){
						if(fields==null){
							fields= value['fields'];
							idCollabo= value['key'];
							team= getTeamName(fields['team_list'][0]);
						}
					});
					console.log("team :"+team);
					var orgn=fields['org_name'];


					console.log("id collabo "+idCollabo);
					reloadOngletActive();
					ChangeOnglet('tab_org', 'content_org');

					if($("#valid").html() == "Rechercher"){
						$("#valid").html("Actualiser");
						console.log("bouton val rechercher");
					}

					//gestion de la localisation
					var localisation = fields['information'];
					console.log("localisation :"+localisation);
					if(localisation == ""){
						$(".map-button").hide();
						$("#position").hide();
						$(".clip").show();
						$(".clip2").hide();
						$(".floor-button").hide();
					}else{
						$(".floor-button").show();
						$(".map-button").show();
						$("#position").show();
						$(".clip").show();
						$(".material-icons").removeClass("active-icon");
						var idRoom = localisation.replace("B1-","");
						console.log("idRoom :"+idRoom);
						$( ".map-button" ).click(function() {
					    $('.map .material-icons').css("transform","translate(0,300px)");
					  });
						$( ".modal-map" ).click(function() {
					    $('.map .material-icons').css("transform","translate(0,-300px)");
					  });
						document.querySelector('#icon'+idRoom).classList.add("active-icon");
						var nomCollab = $("#collabo").val();
						console.log("nom du collab: "+nomCollab);
						console.log("nom du collab%20: "+nomCollab.replace(/ /g, "%20"));
						var currentUrl = $(location).attr('href').replace("#", "");
						currentUrl = currentUrl.split("?", 1);
						console.log("get collab"+ collaboGet);
						console.log("get map"+ getMapVisibility);
						console.log("ulr "+ currentUrl);
						nomCollab = nomCollab.replace(/ /g, "%20");
						var copyurl = currentUrl+"?collab="+nomCollab+"&map=no";
						var copyurlmap = currentUrl+"?collab="+nomCollab+"&map=yes";
						$("#p1").html(copyurlmap);
						$("#p2").html(copyurl);


					}


					var floorJSON = {
						operation: 'core/get',
						'class': 'Person',
						key: 'SELECT Person AS B WHERE B.information LIKE "%B1-%"',
						output_fields: "name, first_name, information"
					};
					$(".room").html("");

					$.ajax({
						type: "GET",
						url: ITOP_WS_URL,
						dataType: 'jsonp',
						data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(floorJSON)},
						crossDomain: 'true',
						success: function(data){
							console.log(data);
							console.log(data[0]);
							$.each(data['objects'], function(index, value){
								//console.log(value['fields']['name']);
								var numRoom = value['fields']['information'].replace("B1-","");

								//console.log(numRoom);
								var room = document.querySelector('#room'+numRoom);
								if($(room).html() != ""){
									$(room).append("/ ")
								}
								$(room).append(value['fields']['name']+" "+value['fields']['first_name']+" ");
							});
						}
					});


					$("#collabo").blur();

					//affichage des onglets
					$('.tabbed_area').show();
					$('#infoCollabo').show();
					nomCollabo= $('#collabo').val();

					dejaVisiteCIsOrg=0;
					dejaVisiteBacklog=0;

					$('body h1').text(" ");
					$('body h1').text("Bienvenue sur l'application de gestion du collaborateur");
					$('body h1').css("width", "665");
					$('h1 ~ h2').text(" ");
					$('h1 ~ h2').text(fields['first_name'] +" "+ fields['name']);
					$("#equipe").html("");
					$("#nom").html(fields['name']);
					$("#prenom").html(fields['first_name']);
					$("#mail").html(fields['email']);
					$("#tel").html(fields['phone']);
					$("#telMobile").html(fields['mobile_phone']);
					$("#telCourt").html(fields['short_phone']);
					$("#site").html(fields['site_name']);
					$("#fonction").html(fields['function']);
					$("#equipe").html(team);
					$("#org").html(orgn);
					$("#org").css('margin-right', '3%');

					//changer le style du formulaire
					/*$('#formC').css('background-color', '#efefef');
					$('#formC').css('margin-top', '2%');
					$('#formC').css('width', 'auto');
					$('#formC').css('box-shadow', 'none');
					$('#formC label').css('margin', '0');
					$('#formC label').css('color', 'black');
					$('#formC label').css('margin-right', '3px');
					$('#formC label').css('width', 'auto');
					$('#formC label').css('font-size', '18px');
					$('#formC label').css('display', 'inline-block');
					$('#formC input').css('display', 'inline-block');
					$('#formC #valid').css('margin', 'auto');
					$('#formC #valid').css('padding', '3px 10px');
					$('#formC #valid').css('position', 'relative');
					$('#formC #valid').css('left', '1%');
					$("#refresh").show();*/


				}
			},
			error: function(data){
				ok = false;
			}
		});

	});


	if(collaboGet==null){
		console.log("get collabo null");
	}else{
		console.log("get collabo : "+collaboGet);
		var nomCollabo = collaboGet.replace(/%20/g, " ");
		$("#collabo").val(nomCollabo);
		console.log("nom collabo : "+nomCollabo);
		$("#formC").submit();
		if(getMapVisibility == "yes"){
			$(".map-button").click();
			$('.map .material-icons').css("transform","translate(0,300px)");
		}
	}



	$( "#collabo" ).click(function() {
	  $( "#alertFormError" ).fadeOut();
	});

});

/**
* get correspondance team
**/
function getTeamName(fields){
	var team_name;
	if(fields){
		if (fields['team_name'] == 'Reflex CDS FM' || fields['team_name'] == 'Reflex WMS TMA' ||  fields['team_name'] =='TMA SVALL'){
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
	}
	return team_name;
}
