(function(window){

    var _JSON = {

        parse: function(str) {
            return eval(str);
        }

    };

    

    if( !window.JSON ){
        window.JSON = _JSON;
    }

    if(!Array.indexOf){ Array.prototype.indexOf = function(obj){ for(var i=0; i<this.length; i++){ if(this[i]===obj){ return i; } } return -1; } }
    if(!Array.filter){ Array.prototype.filter = function(fn){ var res =[]; for(var i=0; i<this.length; i++){ if(fn(this[i])){ res.push(this[i]); } } return res; } }

})(window);

$(function(){

    var registrarForm = $('#registrar_form');
    registrarForm.submit(registrarFormSubmit);

});

function registrarFormSubmit(e){

    var frm = $(this);

    $.ajax({
        url: frm.get(0).action,
        data: frm.serialize() + '&ajax=true',
        method: 'get',
        error: eco,
        success: function(res){
            if(! res.error )
                eco('Gracias por registrar.\nDeberás receber las novedades así que aparezcan.');
            else
                eco(res.error);
        }
    });

    return false;
}

function eco(txt) { 
    alert(txt); 
}

$(function(){
			    
	$.ajax({
		url: 'index.json',
		success: function(data){
            // data = JSON.parse(data);
            carregar(data);
        }
	});

});

function carregar(data) {

	var lista = $('#lista');
	lista.html('');

	for(var i = 0; i < data.length; i++){
		var lab = data[i];
		var href = lab.alias + '/' + lab.alias + '.html';

		lista.append(
			$('<li></li>').append(
				$('<a></a>').attr('href', href)
							.html(lab.nombre)
			)
		);

	}

}

(function(){
    if(!String.prototype.trim)
        String.prototype.trim = function(){
                return this;
        };
})();

function esperar() {
    return $('<b><i>cargando...</i></b>');
}
