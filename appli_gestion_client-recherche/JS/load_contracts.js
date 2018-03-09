var login		= '';
var pwd			= '';
var first		= true;
var ITOP_URL 				= 'https://itop.hardis.fr';
var ITOP_WS_URL 			= ITOP_URL + "/webservices/rest.php?version=1.3";
var iTopDocCo_URL 	= 'https://itop.hardis.fr/pages/UI.php?operation=details&class=MultiDoc&id=';

//pour l'animation de chargement
var opts = {
      lines: 250, // The number of lines to draw
      length: 0, // The length of each line
      width: 3, // The line thickness
      radius: 52, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#007bff', // #rgb or #rrggbb
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      opacity: 0,
      left: 'auto' // Left position relative to parent in px
};

var spinner = null;
var spinner_div = 0;

function loadContractClient(){
  spinner_div = $('#spinner').get(0);
  if(spinner == null) {
    spinner = new Spinner(opts).spin(spinner_div);
  }else {
    spinner.spin(spinner_div);
  }
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

          $(tr_contrat).css('border-top', '2px solid black');
					$(tab_service).addClass("table table-bordered table-service table-sm");
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

				/*$('.contrat-row').hover(function() {
        	$(this).css('cursor','pointer');
    		});*/

      $( ".contrat-row" ).hover(function() {
            $(this).css('cursor','pointer');
            $(this).css('background-color','#dee2e6');
          }, function() {
            $(this).css('background-color','white');
        });

				$(".contrat-row").click(function(){
					$(this).next("tr").toggle();
				});

			}

      spinner.stop(spinner_div);
		},
		error: function(data){
			console.log("contrat error");
		}
	});

}
