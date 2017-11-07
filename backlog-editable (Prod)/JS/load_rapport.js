/************************************************************************************************
* UTILISATION DU COOKIE POUR SI LE NAVIGATEUR NEST PAS CHROME SINON UTILISATION D'UN ITEM LOCALSTORAGE
***************************************************************************************************/

/**
* creer un cookie
* name= nom du cookie, value= valeur du cookie, days=nb jour de validite du cookie
**/
function setCookie(name, value, days){
    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
* creer un item localstorage
*/
function setItem(data){
   localStorage.setItem(cookieName, data);
}

/**
* recupere le contenu d'un cookie 
**/
function getCookie(name) {
    var name = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return -1;
	
}
 
/**
* commence le rapport creer un cookie/localstoral selon le navigateur + changement affichage
**/
function startRapport(){
	if(!is_chrome){
		setCookie(cookieName, "", 1);	
	}
	//si cest chrome le fdp utiliser localStorage
	else{
		setItem("");
	}
	desactiverStartRapport();
}

/**
* changement affichage quand le rapport est commencé
**/
function desactiverStartRapport(){
	$('#startRapport').css({background:"-webkit-linear-gradient(top, #d4d4d4, #b5b5b5)"});
	$('#startRapport').css({background:"-moz-linear-gradient(top, #d4d4d4, #b5b5b5)"});
	$('#startRapport').css({background:"-ms-linear-gradient(top, #d4d4d4, #b5b5b5)"});
	$('#startRapport').css({background:"-o-linear-gradient(top, #d4d4d4, #b5b5b5)"});
	$('#startRapport').css("color","#6b6a6b");
	$('#startRapport').css("cursor","default");
	$('#startRapport').removeAttr("onclick");
	$('#startRapport').text("Génération du rapport en cours...");
	$('#finishRapport').show(); 
}

/**
* changement affchage quand le rapport est terminé
**/
function reactiverStartRapport(){
	$('#startRapport').css({background:"-webkit-linear-gradient(top, #3498db, #2980b9)"});
	$('#startRapport').css({background:"-moz-linear-gradient(top, #3498db, #2980b9)"});
	$('#startRapport').css({background:"-ms-linear-gradient(top, #3498db, #2980b9)"});
	$('#startRapport').css({background:"-o-linear-gradient(top, #3498db, #2980b9)"});
	$('#startRapport').css("color","white");
	$('#startRapport').css("cursor","pointer");
	$('#startRapport').attr("onclick","startRapport();");
	$('#startRapport').text("Commencer le rapport");
	$('#finishRapport').hide(); 
	
}

/**
* changement affichage + initialisation de l'entete et contenu dui rapport + clear cookie/localstorage
**/
function finishRapport(){
	reactiverStartRapport();
	//a ouvrir avec autre chose que le block note pour la mise en forme
	var enteteRapport = 'RAPPORT DE MODIFICATION DE TICKETS ITOP, généré le '+getCurrentDate().substr(0,10)+' à '+ getCurrentDate().substr(11,8);
	enteteRapport += '\n\nTicket modifié; Modification effectuée;Ancienne valeur; Nouvelle valeur; Informations supplémentaires';
	if(!is_chrome){
		//remplacer tout les '*' pour mettre les separateurs
		//remplacer tout les '[SL]' pour mettre les sauts de lignes
		downloadRapport(cookieName, enteteRapport + getCookie(cookieName).replace(/\*/g, ";").replace(/\&SL\&/g, "\n"));	
		document.cookie = cookieName+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
	}else{
		downloadRapport(cookieName, enteteRapport + localStorage.getItem(cookieName).replace(/\*/g, ";").replace(/\&SL\&/g, "\n"));	
		localStorage.clear();
	}
}

/**
* auto download rapport 
**/
function downloadRapport(fileName, content){
	$('#startRapport').after('<a id="dowloadfile"></a>');
	$('#dowloadfile').attr('href', 'data:attachment/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(content));
	$('#dowloadfile').attr('download', fileName+'.csv');
  
	document.getElementById('dowloadfile').click();
}
