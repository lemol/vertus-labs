function carregar(data) {

	var lista = $('#lista');
	lista.html('');

	for(var i = 0; i < data.length; i++){
		var lab = data[i];
		var href = lab.alias + '/' + lab.alias + '.html';
        var b = new RegExp();
        
		lista.append(
			$('<li></li>').append(
                
                $('<span class="nombre"></span>').append(
				    $('<a></a>').attr('href', href)
					    		.html(lab.nombre),
                    $('<span></span>')
					    		.html('(' + lab.version + ')')
                ),

                $('<div class="descripcion"></div>')
                            .html(lab.descripcion),

                (function(){

                    var tags = $('<div class="tags"></div>');

                    $.each(lab.tags, function(i){

                        var tag = lab.tags[i];
                        var href = '#!/?tag=' + tag;

                        tags.append(
                            $('<a class="tag"></a>').attr('href', href)
                                                    .html(tag)
                        );

                    });

                    return tags;

                })()

			)
		);

	}

}