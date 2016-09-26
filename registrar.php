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

    $is_ajax = isset($_GET["ajax"]);
    $email   = strtolower( isset($_GET["email"]) ? $_GET["email"] : '' );
    $sucesso = false;

    if( validar_email($email) ){
        salvar_email($email);
        $sucesso = true;
    }
    else{
        $sucesso = false;
    }

    if($is_ajax){

        header('Content-Type: text/json');
        header('Expires: -1');

        $res = $sucesso ? '{"email":"' . addslashes($email) . '"}' : '{"error":"El correo especificado no es valido."}';

        exit($res);
    }

?>


<html>

<head>
    <title>Laboratorio Virtual de Física</title>
    <link href="site/css/index.css" rel="stylesheet" />
    <script src="libs/jquery-1.4.1.js" type="text/javascript"></script>
    <script src="site/script/index.js" type="text/javascript"></script>
    <script src="site/script/contacto.js" type="text/javascript"></script>
</head>

<body>

<div id="tudo">
	<div id="cuerpo">
		<div id="cabeza">
			<div class="logo">
				Laboratorio Virtual de Física</div>
			<div id="menu-horizontal">
				<ul class="ul-horizontal">
					<li><a class="actual" href="index.html">página inicial</a></li>
					<li><a href="labs.html">todos laboratorios</a></li>
					<li><a href="sobre.html">sobre el proyecto</a></li>
					<li><a href="autores.html">los autores</a></li>
					<li><a href="contacto.html">hable connosotros</a></li>
				</ul>
			</div>
		</div>
		<div id="tronco">
			<div id="pulmao">
				<div>
					<form action="registrar.php" method="get" id="registrar_form">
						<h3>Receber noticias</h3>
						<fieldset>
							<!--legend>Receber noticias</legend-->
							<label for="txt-email-receber">E-mail:</label><input type="text" name="email" id="txt-email-receber"/><input type="submit" value="ok"/>
						</fieldset>
					</form>
				</div>
				<div>
					<form action="recomendar.php" method="get">
						<h3>Recomendar a un amigo</h3>
						<fieldset>
							<!--legend>Recomendar</legend-->
							<label for="txt-nombre-recomendar" style="display:inline-block; width: 80px;">Tu nombre:</label>
							<input type="text" name="nombre" id="txt-nombre-recomendar"/><br/>
							<label for="txt-email-receber" style="display:inline-block;width: 80px;">E-mail del amigo:</label>
							<input type="text" name="email" id="txt-email-recomendar"/><br/>
							<input type="submit" value="ok" style="margin-left: 90px; padding: 1px 10px"/>
						</fieldset>
					</form>
				</div>
				<div>
					<h3>Laboritorios</h3>
					<ul id="lista">
						<li><b><i>cargando...</i></b></li>
					</ul>
				</div>
			</div>
			<div id="coracao">
				<div>
                    <? if($sucesso) { ?>
					<h1>Gracias!</h1>
					<p>Gracias por registrar. Enviaremos las noticias para <b><?= $email ?></b>.</p>
                    <? } else { ?>
					<h1>E-mail invalido</h1>
					<p>El e-mail especificado no es valido. Por favor, intenta denuevo.</p>
                    <? } ?>
                    <p style="text-align:center; margin-top: 10px"><a href="/index.html">Ir a la página inicial</a></p>
				</div>
			</div>
            <div class="clear"></div>
		</div>
	</div>
	<div id="pernas">
		<div id="nomes">
			(c) 2012. <a href="mailto:leza.ml@fecrd.cujae.edu.cu">Leza Morais Lutonda</a>,
			<a href="mailto:luis.gd@fecrd.cujae.edu.cu">Luis Miguel Gato Díaz</a> 
			y <a href="mailto:carlos.hm@fecrd.cujae.edu.cu">Carlos José Herrera 
			Matos</a>. </div>
	</div>
</div>

</body>

</html>
