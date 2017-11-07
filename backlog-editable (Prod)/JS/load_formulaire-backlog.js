$(function(){
	//remettre a blanc les message d'erreur
	$('#errorMessageAgent').val('');
	$('#errorMessageCodRes').val('');
	$('#errorMessageTeam').val('');
	$('#errorMessageDate').val('');
	$('#errorMessageSolution').val('');
	
	// autocompletion pour les agents
	$('#agent').autocomplete({	
		source : function(requete, reponse){ // requete, reponse = données nécessaires au plugin
			// Json request
			var oJSON={
				operation: 'core/get',
				'class': 'Contact',
				key: 'SELECT ctc FROM Contact AS ctc JOIN lnkTeamToContact AS tm ON tm.contact_id = ctc.id WHERE ctc.status = "Active" AND tm.team_name = "'+ $('#team').val() +'" AND ctc.finalclass="Person" AND ctc.email LIKE "%hardis%" AND ctc.friendlyname LIKE "%'+$('#agent').val()+'%"',
				output_fields: 'friendlyname'
			};

			$.ajax({
				type: "GET",
				url: ITOP_WS_URL,
				dataType: 'jsonp',
				data : {
					client_firstChar : $('#agent').val(), // on donne la chaîne de caractère tapée dans le champ de recherche
					maxRows : 5,
					json_data: JSON.stringify(oJSON)
				},

				success : function(donnee){
					var lst = new Array;
					$.each(donnee['objects'], function(index, value){
						lst.push(value['fields']['friendlyname']); 
					});
					
					reponse($.map(lst, function(obj){
						return obj; // on retourne cette forme de suggestion
					}));
				}
			});
		},
		//supposition à partir de 3caractères
		minLength : 3,
		// selection d'une proposition
		select: function (event, ui){
			$('#agent').val(ui.item.label);
			
			//Json request
			aJSON = {
				operation: 'core/get',
				'class': 'lnkTeamToContact',
				key: 'SELECT tm FROM lnkTeamToContact AS tm JOIN Contact AS ctc ON tm.contact_id = ctc.id WHERE ctc.status = "Active" AND  ctc.finalclass="Person" AND ctc.email LIKE "%hardis%" AND ctc.friendlyname = "'+ $('#agent').val() +'"',
				output_fields: 'team_name'
			};
			
			$.ajax({
				type: "POST",
				url: ITOP_WS_URL,
				dataType: 'jsonp',
				data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(aJSON) },
				crossDomain: 'true',
				success: function (data) {
					$.each(data['objects'], function(index, value){
						
					});
				},
				error: function (data) {
					document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

					}
			});
		
		},
				
	});
	
	
	//soumission du formulaire
	$("#formTicket").submit(function(e){
		//pas de rechargement de page
		e.preventDefault();		
		
		console.log("SUBMIT");
		
		var stimulus="";
		var ok=1; 
		var change=0;	
		var classT = $('#typeTicket').val();
		if(classT=='Demande du client')
			classT='UserRequest';
		else 
			classT='Problem';
	
		
		/**
		*	UPTADE DES COMMENTAIRES
		**/ 
		
		//UPDATE COMMENTAIRES
		//commentaires public
		if($("#comp").val()!=""){	
			//Json request
			xJSON = {
				operation: 'core/update',
				'class': classT,
				"comment": "Update private journal",
				'key': $("#idTicket").val(),
				"fields": {
					"public_log": $("#comp").val()
				},
				"output_fields": "id, public_log"
			};
			
			$.ajax({
				type: "POST",
				url: ITOP_WS_URL,
				dataType: 'jsonp',
				data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(xJSON) },
				crossDomain: 'true',
				success: function (data) {
					//empecher linteraction avec le popup si ok
					$("#popupTicket").css('z-index', '1');
					$('#popupMessage p').text("Chargement en cours....");
					$('#popupMessage').fadeIn();
					console.log("ok update comm public");
					console.log(data);
					change=1;
					console.log(getCookie(cookieName));
					//update cookie for rapport
					if(getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null){
						//commencer par &SL& pour retour a la ligne
						var valueC;
						if($("#comp").val().length > 50)
							valueC =$("#comp").val().substr(0,50)+"...";
						else
							valueC =$("#comp").val();
						
						var content="&SL&" + $("#popupTicket h2").text() +"*Ajout d'un commentaire public*-*" + valueC;
						if(!is_chrome)
							setCookie(cookieName, getCookie(cookieName) + content, 1);
						else{
							setItem(localStorage.getItem(cookieName) + content);
						}
					}
				},
				error: function (data) {
					document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

					}
			});
		}
		//commentaires privé
		if($("#compv").val()!=""){
			//Json request
			xJSON = {
				operation: 'core/update',
				'class': classT,
				"comment": "Update private journal",
				"key": $("#idTicket").val(),
				"fields": {
					"private_log": $("#compv").val()
				},
				"output_fields": "id"
			};
			
			$.ajax({
				type: "POST",
				url: ITOP_WS_URL,
				dataType: 'jsonp',
				data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(xJSON) },
				crossDomain: 'true',
				success: function (data) {
					//empecher linteraction avec le popup si ok
					$("#popupTicket").css('z-index', '1');
					$('#popupMessage p').text("Chargement en cours....");
					$('#popupMessage').fadeIn();
					console.log("ok update comm privé");
					change=1;
						//update cookie for rapport
					if(getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null){
						//commencer par &SL& pour retour a la ligne
						var valueC;
						if($("#compv").val().length > 50)
							valueC =$("#compv").val().substr(0,50)+"...";
						else
							valueC =$("#compv").val();
						
						var content="&SL&" + $("#popupTicket h2").text() +"*Ajout d'un commentaire privé*-*" + valueC;
						if(!is_chrome)
							setCookie(cookieName, getCookie(cookieName) + content, 1);
						else 
							setItem(localStorage.getItem(cookieName) + content);
					}
				},
				error: function (data) {
					document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

					}
			});
		}
		
		/**
		*	FIN UPTADE DES COMMENTAIRES
		**/ 
		
		/**
		*	VERIFICATION & UPDATE
		**/
		
		//json team with contact
		bJSON = {
				operation: 'core/get',
				'class': 'lnkTeamToContact',
				key: 'SELECT tm FROM lnkTeamToContact AS tm JOIN Contact AS ctc ON tm.contact_id = ctc.id WHERE ctc.status = "Active" AND  ctc.finalclass="Person" AND ctc.email LIKE "%hardis%" AND tm.team_name="'+ $("#team").val() +'" AND ctc.friendlyname = "'+ $('#agent').val() +'"',
				output_fields: 'contact_id, contact_name, contact_id_friendlyname, contact_email, team_name, team_id, team_id_friendlyname'
		};
		
		
		//VERIFICATION RESOLVED
		if($('#statut').val()=='Résolu' && $('#solution').val()=='' && saveStatut!= $('#statut').val()){
			ok=0;
			$('#errorMessageSolution').text("Veuillez renseigner une solution svp");
			$('#errorMessageSolution').fadeIn();
		}else if($('#statut').val()=='Résolu' && $('#codReso').val()=='' && saveStatut!= $('#statut').val() && classT=='Problem'){
			ok=0;
			$('#errorMessageCodRes').text("Veuillez renseigner un code de résolution svp");
			$('#errorMessageCodRes').fadeIn();
		}else if($('#statut').val()=='Résolu' && $('#agent').val()==''){
			ok=0;
			$('#errorMessageAgent').text("Veuillez renseigner un agent svp");
			$('#errorMessageAgent').fadeIn();
		}else if($('#statut').val()=='Résolu' && $('#solution').val()!='' && $('#agent').val()!='' && saveStatut!= $('#statut').val()){
						
			var codeReso=$('#codReso').val();
			if(codeReso=='')
				codeReso='Non renseigné';
				
			var eltService= $('#eltService').val();
			if(eltService=='')	
				eltService='Non renseigné';
			
			////maj agent si y avait pas dagent
			$.ajax({
				type: "POST",
				url: ITOP_WS_URL,
				dataType: 'jsonp',
				data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(bJSON) },
				crossDomain: 'true',
				success: function (data){
					if(!(data['objects'])){
						ok=0;
						$('#errorMessageAgent').text("L'agent ne correspond pas à l'équipe");
						$('#errorMessageAgent').fadeIn();
					}else{
						//empecher linteraction avec le popup si ok
						$("#popupTicket").css('z-index', '1');
						$('#popupMessage p').text("Chargement en cours....");
						$('#popupMessage').fadeIn();
						if(saveAgent=='' || saveAgent!=$('#agent').val()){
							//changer le stimulus en fonction du type de ticket
							if(classT=="UserRequest")
								stimulus= 'ev_assign_agent';
							else
								stimulus='ev_reassign'
							//trouver la team de lagent
							$.each(data['objects'], function(index, value){
								maJSON={	
									"operation": "core/apply_stimulus",
									"comment": "update ticket agent",
									"class": classT,
									"key": $("#idTicket").val(),
									"stimulus": stimulus,
									"output_fields": "title, id",
									"fields":
									{
									  "team_id": value['fields']['team_id'],
									  "agent_id": value['fields']['contact_id']
									}
								};
							});
							
							//UPDATING
							$.ajax({
								type: "POST",
								url: ITOP_WS_URL,
								dataType: 'jsonp',
								data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(maJSON) },
								crossDomain: 'true',
								success: function (data){
									if(saveAgent!=$('#agent').val() && saveAgent!='' && getCookie(cookieName)!= -1){
										content="&SL&" + $("#popupTicket h2").text() +"*Changement d'agent*"+saveAgent+"*" + $('#agent').val();
										if(!is_chrome)
											setCookie(cookieName, getCookie(cookieName) + content, 1);
										else 
											setItem(localStorage.getItem(cookieName) + content);
									}else if(saveAgent=="" && getCookie(cookieName)!= -1){
										content="&SL&" + $("#popupTicket h2").text() +"*Ajout d'agent*-*" + $('#agent').val();
										if(!is_chrome)
											setCookie(cookieName, getCookie(cookieName) + content, 1);
										else 
											setItem(localStorage.getItem(cookieName) + content);
									}
									if(saveTeam!= $('#team').val() && getCookie(cookieName)!= -1){
										content="&SL&" + $("#popupTicket h2").text() +"*Changement d'équipe*"+saveTeam+"*" + $('#team').val();
										if(!is_chrome)
											setCookie(cookieName, getCookie(cookieName) + content, 1);
										else 
											setItem(localStorage.getItem(cookieName) + content);
									}
									change=1;
								},
								error: function (data) {
									document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

								}
							});	
						}
					}
					
					
					//attendre fin de la requete update agent/team avant d'update to resolved
					setTimeout(function(){
						if(ok==1){	
							//changement de stimulus en fonction du type de ticket
							if(classT=='UserRequest'){
								if(saveStatut=='Assigné agent')
									stimulus="ev_resolve";
								else
									stimulus="ev_autoresolve";
							}else
								stimulus= 'ev_resolve';
			
							updJSON = {
								"operation": "core/apply_stimulus",
								"comment": "update ticket statut to resolved",
								"class": classT,
								"key": $("#idTicket").val(),
								"stimulus": stimulus,
								"output_fields": "title, id",
								"fields": {
									"solution": $("#solution").val(),
									"resolutioncode_id": $("#codReso option:selected").attr("id"),
									"serviceelement_id": $("#eltService option:selected").attr("id")
								}	
								
							};
							
							//UPDATING
							$.ajax({
								type: "POST",
								url: ITOP_WS_URL,
								dataType: 'jsonp',
								data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(updJSON) },
								crossDomain: 'true',
								success: function (data) {
									//empecher linteraction avec le popup si ok
									$("#popupTicket").css('z-index', '1');
									$('#popupMessage p').text("Chargement en cours....");
									$('#popupMessage').fadeIn();
									console.log(data);							
									ok=1;
									change=1;
									console.log("ok change statut to resolved");
									
									//update cookie for rapport
									if(getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null){
										//commencer par &SL& pour retour a la ligne
										var valueS;
										if($("#comp").val().length > 50)
											valueS ="Solution: "+ $("#solution").val().substr(0,50)+"...";
										else
											valueS ="Solution: "+ $("#solution").val();
										
										var content="&SL&" + $("#popupTicket h2").text() +"*Changement de statut*"+ saveStatut +"*" + $('#statut').val() + "*" + valueS + ", Code de résolution: " + codeReso + ", élement de service: " + eltService;
										if(!is_chrome)
											setCookie(cookieName, getCookie(cookieName) + content, 1);
										else 
											setItem(localStorage.getItem(cookieName) + content);
									}
								},
								error: function (data) {
									document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

								}
							});
						}
					}, 3000);
					
				},error: function (data) {
					document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";
				}		
			});
		}
		
		//VERIFICATION ASSIGNED, WORKIN PROCESS, APPROVED
		//si y a un agent + statut requiered  agent
		if( ($('#statut').val()=='Assigné agent' || $('#statut').val()=='Travail en cours' || $('#statut').val()=='Approuvé' ) && $('#agent').val()!=""){
			//ajax contact with team
			$.ajax({
				type: "POST",
				url: ITOP_WS_URL,
				dataType: 'jsonp',
				data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(bJSON) },
				crossDomain: 'true',
				success: function (data){	
					if(!(data['objects'])){
						ok=0;
						$('#errorMessageAgent').text("L'agent ne correspond pas à l'équipe");
						$('#errorMessageAgent').fadeIn();
					}
					//si team correspond a contact
					else{
						//empecher linteraction avec le popup si ok
						$("#popupTicket").css('z-index', '1');
						$('#popupMessage p').text("Chargement en cours....");
						$('#popupMessage').fadeIn();
						
						if((saveAgent!=$('#agent').val()) || (saveStatut!=$('#statut').val()) || saveTeam!= $('#team').val()){
							change=1;
						}
						

						if(classT=="UserRequest")
							stimulus= 'ev_assign_agent';
						else
							stimulus='ev_assign'
						
						//recherche team agent
						$.each(data['objects'], function(index, value){
							maJSON={	
								"operation": "core/apply_stimulus",
								"comment": "update ticket agent",
								"class": classT,
								"key": $("#idTicket").val(),
								"stimulus": stimulus,
								"output_fields": "title, id",
								"fields":
								{
								  "team_id": value['fields']['team_id'],
								  "agent_id": value['fields']['contact_id']
								}
							};
						});
						
						//UPDATING
						$.ajax({
							type: "POST",
							url: ITOP_WS_URL,
							dataType: 'jsonp',
							data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(maJSON) },
							crossDomain: 'true',
							success: function (data){
								console.log(data);
								console.log("ok update agent/team!!");
								var content;
								
								if(saveAgent!=$('#agent').val() && saveAgent!="" && (getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null)){
									content="&SL&" + $("#popupTicket h2").text() +"*Changement d'agent*"+saveAgent+"*" + $('#agent').val();
									if(!is_chrome)
										setCookie(cookieName, getCookie(cookieName) + content, 1);
									else 
										setItem(localStorage.getItem(cookieName) + content);
								}else if(saveAgent!=$('#agent').val() && saveAgent=="" && (getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null)){
									content="&SL&" + $("#popupTicket h2").text() +"*Ajout d'agent*-*" + $('#agent').val();
									if(!is_chrome)
										setCookie(cookieName, getCookie(cookieName) + content, 1);
									else 
										setItem(localStorage.getItem(cookieName) + content);
								}
								
								if(saveTeam!= $('#team').val() && (getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null)){
									content="&SL&" + $("#popupTicket h2").text() +"*Changement d'équipe*"+saveTeam+"*" + $('#team').val();
									if(!is_chrome)
										setCookie(cookieName, getCookie(cookieName) + content, 1);
									else 
										setItem(localStorage.getItem(cookieName) + content);
								}	
								
								if(saveStatut!=$('#statut').val() && (getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null)){
									//commencer par &SL& pour retour a la ligne
									var content="&SL&" + $("#popupTicket h2").text() +"*Changement de statut*"+ saveStatut +"*" + $('#statut').val();
									if(!is_chrome)
										setCookie(cookieName, getCookie(cookieName) + content, 1);
									else 
										setItem(localStorage.getItem(cookieName) + content);
								}
								
							},
							error: function (data) {
								document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

								}
						});				
					}
				},
				error: function (data) {
					document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

				}
			});
		}
		//si pas d'agent + statut requiered agent
		else if(($('#statut').val()=='Assigné agent' || $('#statut').val()=='Travail en cours' || ( $('#statut').val()=='Résolu' && $('#statut').val()!=saveStatut)) && $('#agent').val()==""){
			ok=0;
			$('#errorMessageAgent').text("Veuillez renseigner un agent svp");
			$('#errorMessageAgent').fadeIn();
			
		}
	
		
		//VERIFICATION ASSIGNED TEAM
		if($('#statut').val()=='Assigné équipe' && ($('#team').val() != saveTeam || saveStatut!=$('#statut').val())){	
			//json team with contact
			bJSON = {
					operation: 'core/get',
					'class': 'lnkTeamToContact',
					key: 'SELECT tm FROM lnkTeamToContact AS tm JOIN Contact AS ctc ON tm.contact_id = ctc.id WHERE ctc.status = "Active" AND  ctc.finalclass="Person" AND ctc.email LIKE "%hardis%" AND tm.team_name="'+ $("#team").val() +'"',
					output_fields: 'team_id'
			};
			$.ajax({
				type: "POST",
				url: ITOP_WS_URL,
				dataType: 'jsonp',
				data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(bJSON) },
				crossDomain: 'true',
				success: function (data){
					//changement de stimulus en fonction de du statut précédent
					if(saveStatut=="Résolu")
						stimulus="ev_reopen";
					else 
						stimulus="ev_reassign_team";
					
					//empecher linteraction avec le popup si ok
					$("#popupTicket").css('z-index', '1');
					$('#popupMessage p').text("Chargement en cours....");
					$('#popupMessage').fadeIn();
					
					$.each(data['objects'], function(index, value){
						//json update team
						updJSON = {
							"operation": "core/apply_stimulus",
							"comment": "update ticket team",
							"class": classT,
							"key": $("#idTicket").val(),
							"stimulus": stimulus,
							"output_fields": "title, id",
							"fields":
							{
							  "team_id": value['fields']['team_id']
							}
						};
					});
					
					//UPDATING
					$.ajax({
						type: "POST",
						url: ITOP_WS_URL,
						dataType: 'jsonp',
						data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(updJSON) },
						crossDomain: 'true',
						success: function (data) {
							console.log(data);
							change=1;
							console.log("ok reassign team");
							//changement de statut
							//update cookie for rapport
							if((getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null) && saveStatut!= $('#statut').val()){
								//commencer par &SL& pour retour a la ligne
								var content="&SL&" + $("#popupTicket h2").text() +"*Changement de statut*"+ saveStatut +"*" + $('#statut').val()+"*Équipe assignée: "+$('#team').val();
								if(!is_chrome)
									setCookie(cookieName, getCookie(cookieName) + content, 1);
								else 
									setItem(localStorage.getItem(cookieName) + content);
							}//changement de team
							else if((getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null) && $('#team').val() != saveTeam){
								var content="&SL&" + $("#popupTicket h2").text() +"*Changement d'équipe*"+ saveTeam +"*" + $('#team').val();
								if(!is_chrome)
									setCookie(cookieName, getCookie(cookieName) + content, 1);
								else 
									setItem(localStorage.getItem(cookieName) + content);
							}
							if((getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null) && saveStatut!= $('#statut').val() && saveTeam!= $('#team').val()){
								//commencer par &SL& pour retour a la ligne
								var content="&SL&" + $("#popupTicket h2").text() +"*Changement d'équipe*"+ saveTeam +"*" + $('#team').val();
								if(!is_chrome)
									setCookie(cookieName, getCookie(cookieName) + content, 1);
								else 
									setItem(localStorage.getItem(cookieName) + content);
							}
						},
						error: function (data) {
							document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

						}
					});
				},
				error: function (data) {
					document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

				}
			});
		}
		
		//VERIFICATION EN ATTENTE PLANNED
		if($('#statut').val()=='En attente planifiée' && ($('#datepicker').val() == "")){
			ok=0;
			$('#errorMessageDatePlan').text("Veuillez renseigner une date svp");
			$('#errorMessageDatePlan').fadeIn();
		}else if(($('#statut').val()=='En attente planifiée' && ($('#datepicker').val() != "")) && ($('#datepicker').val()!= saveDateP || $('#heure').val()!= saveHP || $('#minute').val()!= saveMinP)){
			var datepicker= $('#datepicker').val();
			var ajd= getCurrentDate().substr(0,10);
			var dateAjd = new Date(ajd.substr(6,4), ajd.substr(3,2), ajd.substr(0,2));
			var datePick = new Date(datepicker.substr(6,4), datepicker.substr(3,2), datepicker.substr(0,2));
			if(datepicker.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/) == null){
				ok=0;
				$('#errorMessageDatePlan').text("La date saisie n'est pas valide");
				$('#errorMessageDatePlan').fadeIn();
			}
			else if(datePick<dateAjd){
				ok=0;
				$('#errorMessageDatePlan').text("Veuillez renseigner une date suppérieure svp");
				$('#errorMessageDatePlan').fadeIn();
			}else if(datePick>dateAjd){
				//on doit update le statut
				if($('#statut').val() != saveStatut){
					updJSON = {
						"operation": "core/apply_stimulus",
						"comment": "update ticket statut pending planed",
						"class": classT,
						"key": $("#idTicket").val(),
						"stimulus": "ev_pending_planed",
						"output_fields": "title, id",
						"fields":
						{
						  "expected_request_date": datepicker.substr(6,4)+'-'+datepicker.substr(3,2) +'-'+datepicker.substr(0,2)+' '+ $('#heure').val() +':'+ $('#minute').val() + ':00'
						}
					};
				}else{
					updJSON = {
						"operation": "core/update",
						"comment": "update ticket statut pending planed",
						"class": classT,
						"key": $("#idTicket").val(),
						"output_fields": "title, id",
						"fields":
						{
						  "expected_request_date": datepicker.substr(6,4)+'-'+datepicker.substr(3,2) +'-'+datepicker.substr(0,2)+' '+ $('#heure').val() +':'+ $('#minute').val() + ':00'
						}
					};
				}
				//UPDATING
				$.ajax({
					type: "POST",
					url: ITOP_WS_URL,
					dataType: 'jsonp',
					data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(updJSON)},
					crossDomain: 'true',
					success: function (data){
						//empecher linteraction avec le popup si ok
						$("#popupTicket").css('z-index', '1');
						$('#popupMessage p').text("Chargement en cours....");
						$('#popupMessage').fadeIn();
						ok=1;
						change=1;
						console.log(data);
						console.log("ok change statut to pending planed");
						
						//update cookie for rapport
						if((getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null) && $('#statut').val() != saveStatut){
							//commencer par &SL& pour retour a la ligne
							var content="&SL&" + $("#popupTicket h2").text() +"*Changement de statut*"+ saveStatut +"*" + $('#statut').val() + "*" + "Date et heure de plannification: "+ $('#datepicker').val() +" à "+ $('#heure').val() +'h'+ $('#minute').val() ;
							if(!is_chrome)
								setCookie(cookieName, getCookie(cookieName) + content, 1);
							else 
								setItem(localStorage.getItem(cookieName) + content);
						}else if((getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null) && $('#statut').val() == saveStatut){
							//si la date a changee
							if($('#datepicker').val()!= saveDateP){
								var content="&SL&" + $("#popupTicket h2").text() +"*Changement de date de planification*"+ saveDateP +"*" + $('#datepicker').val() ;
								if(!is_chrome)
									setCookie(cookieName, getCookie(cookieName) + content, 1);
								else 
									setItem(localStorage.getItem(cookieName) + content);
							}//si lheure a changee
							if($('#heure').val()!= saveHP || $('#minute').val()!= saveMinP){
								var content="&SL&" + $("#popupTicket h2").text() +"*Changement d'heure de planification*"+ saveHP +'h'+ saveMinP +"*" + $('#heure').val()+'h'+$('#minute').val();
								if(!is_chrome)
									setCookie(cookieName, getCookie(cookieName) + content, 1);
								else 
									setItem(localStorage.getItem(cookieName) + content);
							}
						}
					},
					error: function (data) {
						document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

					}
				});
			}	
		}		
			
		//VERIFICATION EN ATTENTE CLIENT ET CUSTOMER
		if(($('#statut').val()=='En attente client' || $('#statut').val()=='En attente interne') && saveStatut!=$('#statut').val()){

			//changement stimulus en fonction du statut choisi
			if($('#statut').val()=='En attente client')
				stimulus='ev_pending_customer';
			else if($('#statut').val()=='En attente interne')
				stimulus='ev_pending_internal';
			
			updJSON = {
					"operation": "core/apply_stimulus",
					"comment": "update ticket statut pending planed",
					"class": classT,
					"key": $("#idTicket").val(),
					"stimulus": stimulus,
					"output_fields": "title, id",
					"fields":{}
			};
			
			//UPDATING
			$.ajax({
				type: "POST",
				url: ITOP_WS_URL,
				dataType: 'jsonp',
				data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(updJSON) },
				crossDomain: 'true',
				success: function (data) {
					//empecher linteraction avec le popup si ok
					$("#popupTicket").css('z-index', '1');
					$('#popupMessage p').text("Chargement en cours....");
					$('#popupMessage').fadeIn();
					ok=1;
					change=1;
					console.log("ok change statut to pending internal/customer");
					//update cookie for rapport
					if(getCookie(cookieName)!= -1 || localStorage.getItem(cookieName)!=null){
						//commencer par &SL& pour retour a la ligne
						var content="&SL&" + $("#popupTicket h2").text() +"*Changement de statut*"+ saveStatut +"*" + $('#statut').val();
						if(!is_chrome)
							setCookie(cookieName, getCookie(cookieName) + content, 1);
						else 
							setItem(localStorage.getItem(cookieName) + content);
					}
				},
				error: function (data) {
					document.getElementById("backlogHardisListId").innerHTML = "Erreur lors de la récupération des éléments. Connectez-vous à iTop";

				}
			});
		}		
			
		//UPDATE NOTIFICATION FINALE	
		//tilmeout to waiting for finish ajax traitement
		setTimeout(function(){
			if(ok==1){
				//empecher linteraction avec le popup si ok
				$("#popupTicket").css('z-index', '1');
				$('#popupMessage p').text("Chargement en cours....");
				$('#popupMessage').fadeIn();
				//reload page
				loadPageAfficheBacklog();		
				if(change==1){
					$("#shadowing").hide();
					$('#popupTicket').fadeOut();
					//reload page
					loadPageAfficheBacklog();
					$('#popupMessage p').text("Le ticket a été mis à jour avec succès");
					$('#popupMessage').fadeIn();
				}else{
					$("#shadowing").hide();
					$('#popupTicket').fadeOut();
					$('#popupMessage p').text("Aucune modification n'a été effectuée");
					$('#popupMessage').fadeIn();
				}
				setTimeout(function(){ $('#popupMessage').fadeOut(); }, 4000);	
			}
		}, 7000);
	}); 
});
	