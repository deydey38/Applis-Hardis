var login		= '';
var pwd			= '';
var ITOP_URL	= 'https://itop.hardis.fr';
var ITOP_WS_URL	= ITOP_URL + "/webservices/rest.php?version=1.3";
var cds = '';
var nomOrg = '';
$(function(){

	$('#client').val('');

	// autocompletion pour les client
	$('#client').autocomplete({
		source : function(requete, reponse){ // requete, reponse = données nécessaires au plugin
			// Json request
			var oJSON={
				operation: 'core/get',
				'class': 'Organization',
				key: "SELECT org FROM Organization AS org WHERE( org.name LIKE '%" + $('#client').val() + "%')",
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
		if($('#client').val()==''){
			$('#alertFormError').text("Veuillez renseigner le champs...");
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
			if($('#client').val()!=''){

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
							nomOrg= $('#client').val().toUpperCase();
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
					cds = value['fields']['name'];
				});
			}else{
				cds="PAS DE CDS";
			}
			console.log("cds :"+cds);
			$(".reponse").text(nomOrg+" : "+cds);
			$(".reponse").fadeTo("fast", 1);
		},
		error: function(data){
			console.log("cds error");
		}
	});
}
