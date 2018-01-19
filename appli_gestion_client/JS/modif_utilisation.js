var ITOP_URL 				= 'https://itop.hardis.fr';
var ITOP_WS_URL 			= ITOP_URL + "/webservices/rest.php?version=1.3";


$(document).ready(function(){

  $("#formModif").submit(function(e){
    e.preventDefault();
    spinner.spin(spinner_div);
    console.log("modifier truc");
    console.log("nom ci : "+ciModif);
    var modif = $("#inputModif").val();
    $("#inputModif").val("");
    console.log("modification " + modif);
    $('#exampleModal').modal('toggle');


    var clusterJSON = {
       "operation": "core/update",
       "comment": "Update Utilisation CI",
       "class": "lnkSolutionToCI",
       "key":
     {
        "ci_name": ciModif,
        "ci_id_finalclass_recall": "DataBaseCluster"
     },
       "output_fields": "ci_id",
       "fields":{"utility":modif}
    }

    var schemaJSON = {
       "operation": "core/update",
       "comment": "Update Utilisation CI",
       "class": "lnkSolutionToCI",
       "key":
     {
        "ci_name": ciModif,
        "ci_id_finalclass_recall": "DataBaseSchema"
     },
       "output_fields": "ci_id",
       "fields":{"utility":modif}
    }

    var vmJSON = {
       "operation": "core/update",
       "comment": "Update Utilisation CI",
       "class": "lnkSolutionToCI",
       "key":
     {
        "ci_name": ciModif,
        "ci_id_finalclass_recall": "VirtualMachine"
     },
       "output_fields": "ci_id",
       "fields":{"utility":modif}
    }
    console.log("db or vm : "+dbOrVm);
    if(dbOrVm == "table_db"){
      console.log("DBBB");
      $.ajax({
        type: "POST",
        url: ITOP_WS_URL,
        dataType: 'jsonp',
        data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(clusterJSON) },
        crossDomain: 'true',
        success: function (data) {
          console.log("succes");
          $.ajax({
            type: "POST",
            url: ITOP_WS_URL,
            dataType: 'jsonp',
            data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(schemaJSON) },
            crossDomain: 'true',
            success: function (data) {
              console.log("succes");
              location.reload();
            },
            error: function (data) {
              console.log("echec");
              }
          });
        },
        error: function (data) {
          console.log("echec");
          }
      });
    }else{
      console.log("VMMMM");
      $.ajax({
        type: "POST",
        url: ITOP_WS_URL,
        dataType: 'jsonp',
        data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(vmJSON) },
        crossDomain: 'true',
        success: function (data) {
          console.log("succes");
          location.reload();
        },
        error: function (data) {
          console.log("echec");
          }
      });
    }

  });
});
