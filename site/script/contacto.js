$(function(){

    $('#contacto_form').submit(contactoFormSubmit);

});

function contactoFormSubmit(e) {

    var frm = $('#contacto_form');
    var validacion = validarContactoForm(frm);

    if( validacion.isValid ) {

        var data = "nombre="+validacion.nombre +"&email=" +validacion.email + "&registrar=" + validacion.registrar +"&tipo="+validacion.tipo+"&mensaje="+validacion.mensaje;
                    
        $.ajax({
            url: frm.get(0).action,
            data: data + '&ajax=true',
            method: 'post',
            error: eco,
            success: function(res){
                if(! res.error )
                    eco('Gracias por el mensaje.\nPronto atenderemos a su preocupacion.');
                else
                    eco(res.error);
            }
        });

    }
    else {
        
        eco( validacion.msg );
        validacion.callback();

    }

    return false;
}

function validarContactoForm(frm){

    var nombre = $('[name=nombre]', frm).val().trim();
    var email = $('[name=email]', frm).val().trim();
    var tipo = $('[name=tipo]', frm).val().trim();
    var mensaje = $('[name=mensaje]', frm).val().trim();

    var focus =function(ctr){
        return  function(){
            ctr.focus();
        };
    };

    if(nombre === '') {
        return { msg: 'El nombre no es valido.', callback: focus($('[name=nombre]', frm)) };
    }

    if(email === '') {
        return { msg: 'El e-mail no es valido.', callback: focus($('[name=email]', frm)) };
    }

    if(tipo === '') {
        return { msg: 'Selecione una categoria.', callback: focus($('[name=tipo]', frm)) };
    }

    if(mensaje === '') {
        return { msg: 'El mensaje es muy corto.', callback: focus($('[name=mensaje]', frm)) };
    }

    return {nombre: nombre, email: email, tipo: tipo, mensaje: mensaje, registrar: $('[name=registrar]', frm).get(0).checked, isValid: true};
}