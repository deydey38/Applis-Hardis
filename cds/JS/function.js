$(document).ready(function(){
  var login		= '';
  var pwd			= '';
  var ITOP_URL	= 'https://itop.hardis.fr';
  var ITOP_WS_URL	= ITOP_URL + "/webservices/rest.php?version=1.3";

  function getContactByCDS1(){
    requete= 'SELECT org FROM Organization AS org '
    requete += 'JOIN Contract AS ctr ON ctr.org_id=org.id '
    requete += 'JOIN lnkContactToContract AS link ON link.contract_id=ctr.id '
    requete += 'JOIN Contact AS ctc ON link.contact_id=ctc.id '
    requete += 'WHERE link.contract_name LIKE "%WMS" '
    requete += 'AND link.role_name="Centre de service Reflex" '
    requete += 'AND ctc.name="Reflex CDS R1" ';
    return requete;
  }

  function getContactByCDS2(){
    requete= 'SELECT org FROM Organization AS org '
    requete += 'JOIN Contract AS ctr ON ctr.org_id=org.id '
    requete += 'JOIN lnkContactToContract AS link ON link.contract_id=ctr.id '
    requete += 'JOIN Contact AS ctc ON link.contact_id=ctc.id '
    requete += 'WHERE link.contract_name LIKE "%WMS" '
    requete += 'AND link.role_name="Centre de service Reflex" '
    requete += 'AND ctc.name="Reflex CDS R2" ';
    return requete;
  }

  function getContactByCDS3(){
    requete= 'SELECT org FROM Organization AS org '
    requete += 'JOIN Contract AS ctr ON ctr.org_id=org.id '
    requete += 'JOIN lnkContactToContract AS link ON link.contract_id=ctr.id '
    requete += 'JOIN Contact AS ctc ON link.contact_id=ctc.id '
    requete += 'WHERE link.contract_name LIKE "%WMS" '
    requete += 'AND link.role_name="Centre de service Reflex" '
    requete += 'AND ctc.name="Reflex CDS R3" ';
    return requete;
  }

  var cds1JSON = {
    operation: 'core/get',
    'class': 'Organization',
    key: getContactByCDS2(),
    output_fields: "name"
  };

  var cds2JSON = {
    operation: 'core/get',
    'class': 'Organization',
    key: getContactByCDS2(),
    output_fields: "name"
  };

  var cds3JSON = {
    operation: 'core/get',
    'class': 'Organization',
    key: getContactByCDS3(),
    output_fields: "name"
  };

  // ajax trouvage du client par rapport au ci
  $.ajax({
    type: "GET",
    url: ITOP_WS_URL,
    dataType: 'jsonp',
    data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(cds1JSON)},
    crossDomain: 'true',
    success: function(data){
      console.log("data "+data);
      $.each(data['objects'], function(index, value){
        console.log(value);
        var row = document.createElement("div");
        $(row).text(value['fields']['name']);
        $(".CDS1 .slide").append(row);
      });
    },
    error: function(data){
      console.log("error data");
    }
  });

  $.ajax({
    type: "GET",
    url: ITOP_WS_URL,
    dataType: 'jsonp',
    data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(cds2JSON)},
    crossDomain: 'true',
    success: function(data){
      console.log("data "+data);
      $.each(data['objects'], function(index, value){
        console.log(value);
        var row = document.createElement("div");
        $(row).text(value['fields']['name']);
        $(".CDS2 .slide").append(row);
      });
    },
    error: function(data){
      console.log("error data");
    }
  });

  $.ajax({
    type: "GET",
    url: ITOP_WS_URL,
    dataType: 'jsonp',
    data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(cds3JSON)},
    crossDomain: 'true',
    success: function(data){
      console.log("data "+data);
      $.each(data['objects'], function(index, value){
        console.log(value);
        var row = document.createElement("div");
        $(row).text(value['fields']['name']);
        $(".CDS3 .slide").append(row);
      });
    },
    error: function(data){
      console.log("error data");
    }
  });

  $("button").click(function() {
      	$(this).parent().find('.slide').toggle('show');
				if($(this).text() === "Afficher"){
					$(this).html("Moins");
				}else{
					$(this).html("Afficher");
				}
  });
});
