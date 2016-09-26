function Grafica(w, h, pos, fn, max) {
    
    this.fn = fn; // || function(cita) { return Math.pow( Math.cos(cita), 2 ); };
    this.max = max;
    this.pos = pos || sis.newVector(1000-w, -250+h);
    this.w = w,
    this.h = h;
    this.config = {min: 0 - this.w/2, max: 0 + this.w/2, escalaX: 20, escalaY: this.max, dx: 0.01};

    if( this.pos )
        this.sis = new Sistema(new Vector(this.pos.getCanvasX(), this.pos.getCanvasY()), new Vector(this.w/2, this.h - 10));

}

Grafica.prototype = {

    isVisible: function() {
        return this.fn !== undefined;
    },

    _draw: function() {
        if( cola.selecionado && cola.selecionado.tipo == 'p' ) {
            if ( cola.selecionado.luzIn ) {
                return true;
            }
        }

        return false;
    },

    draw: function(ctx) {

        //if( !this.isVisible() ) return;
        
        

        var x = this.pos.getCanvasX();
        var y = this.pos.getCanvasY();

        ctx.save();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#cccccc";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, y, x + this.w, y + this.h);
        ctx.strokeRect(x, y, x + this.w, y + this.h);
        ctx.restore();

        if(this._draw()){
            this.plot( cola.selecionado );
            this._plot(this.fn, ctx, this.sis, this.config, 'blue')();
        }

    },

    _plot: function(fn, ctx, sis, config, color) {

        return function(arg) {
            plot(fn, arg, ctx, sis, config, color);
        };

    },

    plot: function(polarizador) {

        if( polarizador.luzIn.tipo == TipoLuz.Natural || polarizador.luzIn.tipo == TipoLuz.Circular) {
            this.config.escalaY = polarizador.luzIn.intensidad/2;
            this.fn = function() { return 1; };
        }
        else if( polarizador.luzIn.tipo == TipoLuz.Lineal ) {
            var cita= polarizador.luzIn.angulo;
            this.config.escalaY = polarizador.luzIn.intensidad;
            this.fn = function(cita) { return Math.pow(Math.cos(cita), 2); };
        }
        else if(polarizador.luzIn.tipo == TipoLuz.Eliptica ) {

            var rx = polarizador.luzIn.rx;
            var ry = polarizador.luzIn.ry;

            this.config.escalaY = Math.sqrt(rx*rx + ry*ry);

            this.fn = function(cita) {

                    var coeficiente = Math.pow(rx * Math.sin(cita), 2) + Math.pow(ry * Math.cos(cita), 2);
                    var intensidad = Math.sqrt( coeficiente );

                    return intensidad;
            };
        }

    }

};

function plot(fn, arg, ctx, sis, config, color) {

    config = config || {};

    var escalaX = config.escalaX || 0.1,
        escalaY = config.escalaY || 0.1,
        dx = mmToPixel(config.dx || 0.1),
        min = config.min / escalaX,
        max = config.max / escalaX;

    if (color)
        ctx.strokeStyle = color;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    for (var x = min; x <= max; x += dx) {

        var i = sis.toCanvasX(x * escalaX),
            j = sis.toCanvasY(escalaY * fn(x));

        if (x == min) {
            ctx.moveTo(i, j);
        }
        else {
            ctx.lineTo(i, j);
        }

    }

    ctx.stroke();

}