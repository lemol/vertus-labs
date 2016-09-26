<?php

    function validar_email($email){
        
        $email_valido = ereg('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$', $email);
        return  $email_valido;

    }

    function salvar_email($email){
        $file = fopen("db/registados.txt", "a+") or die("error interno.");
        fwrite($file, "$email\r\n");
        fclose($file);
    }

    function salvar_mensaje($nombre, $email, $fecha, $tipo, $mensaje) {

        $filename = "db/msg/$nombre-$email-$fecha.txt";
        $file = fopen($filename, "w+") or die("error interno.");

        fwrite($file, "Nombre: $nombre\r\n");
        fwrite($file, "Email: $email\r\n");
        fwrite($file, "Fecha: $fecha\r\n");
        fwrite($file, "Tipo: $tipo\r\n");
        fwrite($file, "$mensaje\r\n");
        fclose($file);

    }
    
    $is_ajax = isset($_REQUEST["ajax"]);
    $nome = isset($_REQUEST["nombre"]) ? $_REQUEST["nombre"] : '';
    $email   = strtolower( isset($_REQUEST["email"]) ? $_REQUEST["email"] : '' );
    $registrar = isset($_REQUEST["tipo"]) ? $_REQUEST["tipo"] : false;
    $fecha = date("Y-m-d-H.i.s");
    $tipo = isset($_REQUEST["tipo"]) ? $_REQUEST["tipo"] : '';
    $mensaje = isset($_REQUEST["mensaje"]) ? $_REQUEST["mensaje"] : '';
    
    $sucesso = false;

    if( validar_email($email) || true ){

        if($registrar && validar_email($email)) 
            salvar_email($email);

        salvar_mensaje($nome, $email, $fecha, $tipo, $mensaje);
        $sucesso = true;

    }
    else{
        $sucesso = false;
    }

    if($is_ajax){

        header('Content-Type: text/json');
        header('Expires: -1');

        $res = $sucesso ? '{"msg":"' . addslashes($email) . '"}' : '{"error":"Descupa, cometimos un error. No ha podido enviar el mensaje."}';

        exit($res);
    }

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        AS
    </body>
</html>
