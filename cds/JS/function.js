$(document).ready(function(){
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
spinner_div = $('#spinner').get(0);
if(spinner == null) {
spinner = new Spinner(opts).spin(spinner_div);
}else {
spinner.spin(spinner_div);
}

  var login		= '';
  var pwd			= '';
  var ITOP_URL	= 'https://itop.hardis.fr';
  var ITOP_WS_URL	= ITOP_URL + "/webservices/rest.php?version=1.3";

  $('ul li a').on('click', function (e) {
    var targetSec = $(this).text();
    var off = $('.'+targetSec).offset();
    console.log("offset "+off);
    e.preventDefault();
    $('html, body').animate({scrollTop: off.top-55}, 500, 'swing');
  });

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
    key: getContactByCDS1(),
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

  var client1 = true;
  var even = true;
  // ajax trouvage du client par rapport au ci
  $.ajax({
    type: "GET",
    url: ITOP_WS_URL,
    dataType: 'jsonp',
    data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(cds1JSON)},
    crossDomain: 'true',
    success: function(data){
      //console.log("data "+data);
      $.each(data['objects'], function(index, value){
        //console.log(value);
        if(client1){
          //console.log("client 1 "+client1);
          var row = document.createElement("tr");
          var div1 = document.createElement("td");
          $(div1).css("width", "50%");
          if(even){
            $(row).addClass("even");
            even=false;
          }else{
            even=true;
          }
          $(div1).text(value['fields']['name']);
          $(row).append(div1);
          client1=false;
          //console.log("client "+client1);
          $(".CDS1 .slide").append(row);
        }else{
          //console.log("client 2 "+client1);
          //console.log("col 2");
          var div2 = document.createElement("td");

          $(div2).css("width", "50%");
          $(div2).text(value['fields']['name']);
          $(".CDS1 .slide tr").last().append(div2);

          client1=true;
        }
      });
      CDS2();
    },
    error: function(data){
      console.log("error data");
    }
  });

  function CDS2(){
    client1 = true;
    even = true;
    $.ajax({
      type: "GET",
      url: ITOP_WS_URL,
      dataType: 'jsonp',
      data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(cds2JSON)},
      crossDomain: 'true',
      success: function(data){
        //console.log("data "+data);
        $.each(data['objects'], function(index, value){
          //console.log(value);
          if(client1){
            //console.log("client 1 "+client1);
            var row = document.createElement("tr");
            var div1 = document.createElement("td");
            $(div1).css("width", "50%");
            if(even){
              $(row).addClass("even");
              even=false;
            }else{
              even=true;
            }
            $(div1).text(value['fields']['name']);
            $(row).append(div1);
            $(".CDS2 .slide").append(row);
            client1=false;
            //console.log("client "+client1);
            $(".CDS2 .slide").append(row);
          }else{
            //console.log("client 2 "+client1);
            //console.log("col 2");
            var div2 = document.createElement("td");

            $(div2).css("width", "50%");
            $(div2).text(value['fields']['name']);
            $(".CDS2 .slide tr").last().append(div2);

            client1=true;
          }
        });
        CDS3();
      },
      error: function(data){
        console.log("error data");
      }
    });
  }

  function CDS3(){
    even = true;
    client1 = true;
    $.ajax({
      type: "GET",
      url: ITOP_WS_URL,
      dataType: 'jsonp',
      data: { auth_user: login, auth_pwd: pwd, json_data: JSON.stringify(cds3JSON)},
      crossDomain: 'true',
      success: function(data){
        //console.log("data "+data);
        $.each(data['objects'], function(index, value){
          //console.log(value);
          if(client1){
            //console.log("client 1 "+client1);
            var row = document.createElement("tr");
            var div1 = document.createElement("td");
            $(div1).css("width", "50%");
            if(even){
              $(row).addClass("even");
              even=false;
            }else{
              even=true;
            }
            $(div1).text(value['fields']['name']);
            $(row).append(div1);
            $(".CDS3 .slide").append(row);
            client1=false;
            //console.log("client "+client1);
            $(".CDS3 .slide").append(row);
          }else{
            // console.log("client 2 "+client1);
            //console.log("col 2");
            var div2 = document.createElement("td");

            $(div2).css("width", "50%");
            $(div2).text(value['fields']['name']);
            $(".CDS3 .slide tr").last().append(div2);

            client1=true;
          }
          spinner.stop(spinner_div);
        });
      },
      error: function(data){
        console.log("error data");
      }
    });
  }



  $(".CDS button").click(function() {
      	$(this).parent().find('.slide').toggle('show');
				if($(this).text() === "Afficher"){
					$(this).html("Masquer");
				}else{
					$(this).html("Afficher");
				}
  });
});
