var ITOP_URL = 'https://itoprec.hardis.fr/itop';
var ITOP_WS_URL = ITOP_URL + "/webservices/rest.php?version=1.3";


$(document).ready(function(){

  $("#formModif").submit(function(e){
    e.preventDefault();
    console.log("modifier truc");
    console.log("nom ci azeazeazeazeazeaze : "+ciModif);
    var modif = $("#inputModif").val();
    $("#inputModif").val("");
    console.log("modification " + modif);
    $('#exampleModal').modal('toggle');
    $("#formC").submit();
  });
});
