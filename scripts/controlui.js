/// <reference path="../libs/jquery-1.4.1-vsdoc.js" />

$(function () {

	$('.menu-bar > ul > li').each(function () {

	    var item = $(this);
	    var caption = $('.menu-item', this).first();
	    var conteudo = $('.menu-content', this).first();
	    var controls = $('.menu-controls', this).first();

	    var isVisivel = function () {
	        return item.attr('xvisivel') || item.hasClass('visivel');
	    };
	    var beginIsVisivel = function () {
	        item.attr('xvisivel', true);
	    };
	    var endIsVisivel = function () {
	        item.attr('xvisivel', '');
	    };
	    var isFocus = function () {
	        return item.attr('xfocus') || item.hasClass('focus');
	    };
	    var beginIsFocus = function () {
	        item.attr('xfocus', true);
	    };
	    var endIsFocus = function () {
	        item.attr('xfocus', '');
	    };

		caption.find('a').click(function (e) {
		    e.preventDefault();

		    var isPresente = item.hasClass('presente');

		    if (!isPresente) {
		        beginIsVisivel();

		        item.addClass('presente');
		        var w = conteudo.width();

		        caption.css('display', 'inline-block');
		        caption.animate({ width: w, opacity: 0.5 }, 'fast', 'linear', function () {

		            caption.css('display', '');
		            controls.width(w);
		            
		            conteudo.animate({ opacity: 0.2 }, 'fast', 'linear', function () {
		                conteudo.css('opacity', '');
		            });

		            item.addClass('visivel');
		            item.addClass('focus');
		            
		        });

		        endIsVisivel();
		    }

		});
        /*
		item
        .mouseenter(function () {

		    if (isVisivel() && !isFocus()) {
		        beginIsFocus();
		        
		        conteudo.animate({ opacity: 1 }, {
		            speed: 'fast', complete: function () {

		                caption.animate({ opacity: 0 }, {
		                    speed: 'fast', complete: function () {
		                        item.addClass('focus');
		                        caption.css('opacity', '');
		                        conteudo.css('opacity', '');
		                    }
		                });

		            }
		        });

		        endIsFocus();
		    }

		})
		.mouseleave(function () {

		    if (isVisivel() && isFocus()) {
                
		        conteudo.animate({ opacity: 0.2 }, {
		            speed: 'fast', complete: function () {

		                conteudo.css('opacity', '');
		                caption.css('opacity', 0);
		                item.removeClass('focus');

		                caption.animate({ opacity: 0.5 }, {
		                    speed: 'fast', complete: function () {
		                        caption.css('opacity', '');
		                    }
		                });

		            }
		        });

		    }

		});
        */
		$('input[name=btnOcultar]', item).click(function () {
            
		    
		    item.removeClass('focus');
		    item.removeClass('visivel');

		    conteudo.animate({ opacity: 0 }, {
		        speed: 'slow', queue: false, complete: function () {
		            caption.width('auto').width();
		            item.removeClass('presente');
		        }
		    });

		    caption.animate({ opacity: 1 }, {
		        queue: false, complete: function () {
                    
		        }
		    });

		    

		});

	});

});