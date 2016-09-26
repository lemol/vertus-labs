/// <reference path="../libs/jquery-1.4.1-vsdoc.js" />

var TipoLuz = { Natural: 1, Lineal: 2, Circular: 3, Eliptica: 4 };
TipoLuz.parse = function (str) {
    return TipoLuz[capitalize(str)];
};

function capitalize(str) {
    str = str.toLowerCase();
    return str.replace(str.charAt(0), str.charAt(0).toUpperCase());
}

function Polarizador(angulo, pos, w, h, g) {

    this.angulo = angulo;
    this.pos = pos;
    this.w = w;
    this.h = h;
    this.g = g || 15;
    this.color = '#ffffff';
    this.lineaAngulo = new LineaAnguloPolarizador(this);
    this.tipo = 'p';
    
}

Polarizador.prototype = {

    polarizar: function (luz) {
        return luz.polarizar(this);
    },

    getLuzIn: function () {
        return this.luzIn;
    },

    getLuzOut: function () {
        return this.polarizar(this.luzIn);
    },

    setLuzIn: function (luz) {
        this.luzIn = luz;
    },

    setAngulo: function (cita) {
        this.angulo = this.lineaAngulo.cita = cita;
        cola.polarizar(this);
    },

    draw: function (ctx) {

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#3e3b73';

        for (var i = this.pos.getCanvasY() - this.h - 25; i <= this.pos.getCanvasY() + this.h + 25; i += 10) {
            ctx.moveTo(this.pos.getCanvasX(), i);
            ctx.lineTo(this.pos.getCanvasX(), i + 5);

        }

        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = this.color;
        ctx.ellipse(this.pos.getCanvasX(), this.pos.getCanvasY(), this.w, this.h);
        ctx.ellipse(this.pos.getCanvasX() + this.g, this.pos.getCanvasY(), this.w, this.h, -Math.PI / 2, Math.PI / 2);

        ctx.beginPath();
        ctx.moveTo(this.pos.getCanvasX(), this.pos.getCanvasY() + this.h);
        ctx.lineTo(this.pos.getCanvasX() + this.g, this.pos.getCanvasY() + this.h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.pos.getCanvasX(), this.pos.getCanvasY() - this.h);
        ctx.lineTo(this.pos.getCanvasX() + this.g, this.pos.getCanvasY() - this.h);
        ctx.stroke();

        this.lineaAngulo.draw(ctx);
    },

    setAsDragable: function (z) {
        z.addDragable(this.lineaAngulo, true);
    },

    setAsSelecionado: function () {

        if (this.cola)
            this.cola.setSelecionado(this);

    },

    clearAsSelecionado: function () {
        this.color = '#ffffff';
    },

    _clicado: function (e) {

        var clicado = (this.pos.getCanvasX() - this.w / 2 <= e.OffsetX() && e.OffsetX() <= this.pos.getCanvasX() + this.w / 2 &&
            this.pos.getCanvasY() - this.h / 2 <= e.OffsetY() && e.OffsetY() <= this.pos.getCanvasY() + this.h / 2);

        if (clicado) {
            this.setAsSelecionado();

            
        }

        return clicado;
    },

    _mouseDrag: function (e) {
        this.pos.setCanvasX(this.pos.getCanvasX() + e.x1 - e.x2);
    },

    _mouseUp: function (e) {
        this.setAsSelecionado();
        cola.ordenar();
        cola.polarizar();
    }

};

var LineaAnguloPolarizador = function (pol) {

    this.pol = pol;
    this.pos = pol.pos;
    this.cita = pol.angulo;
    this.rx = pol.w;
    this.ry = pol.h;
    this.g = pol.g;
    this.r = 1;

};

LineaAnguloPolarizador.prototype = {

    draw: function () {

        var cx = this.pos.getCanvasX(),
            cy = this.pos.getCanvasY();

        var factor1 = Math.sin(this.cita) * this.r,
            factor2 = Math.cos(this.cita) * this.r;

        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'yellow';

        ctx.save();
        ctx.beginPath();
        ctx.translate(cx, cy);
        ctx.scale(this.rx, this.ry);

        ctx.moveTo(-factor1, factor2);
        ctx.lineTo(factor1, -factor2);

        ctx.restore();
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = 'yellow';
        ctx.arc(cx + this.rx * factor1, cy - this.ry * factor2, 4, 0, 2 * Math.PI, true);
        ctx.fill();

        ctx.beginPath();
        ctx.lineWidth = 1;
        if (0 < this.cita && this.cita < Math.PI || this.cita < -Math.PI) {
            ctx.moveTo(cx + this.rx * factor1, cy - this.ry * factor2);
            ctx.lineTo(cx + this.rx * factor1 + this.g, cy - this.ry * factor2);
        }
        ctx.stroke();

        ctx.restore();

    },

    _clicado: function (e) {

        var cx = this.pos.getCanvasX(),
            cy = this.pos.getCanvasY();

        var factor1 = Math.sin(this.cita) * this.r,
            factor2 = Math.cos(this.cita) * this.r;

        var superior = Math.pow(e.OffsetX() - (cx + this.rx * factor1), 2) + Math.pow(e.OffsetY() - (cy - this.ry * factor2), 2) <= 5 * 5;
        //var inferior = Math.pow(e.OffsetX() - (cx - this.rx * factor1), 2) + Math.pow(e.OffsetY() - (cy + this.ry * factor2), 2) <= 5 * 5;

        var linea =
        (0 <= this.cita && this.cita <= Math.PI || this.cita <= -Math.PI) &&
            cx + this.rx * factor1 <= e.OffsetX() && e.OffsetX() <= cx + this.rx * factor1 + this.g &&
                cy - this.ry * factor2 - 3 <= e.OffsetY() && e.OffsetY() <= cy - this.ry * factor2 + 6;


        var clicado = superior || linea;

        if (clicado)
            this.pol.setAsSelecionado();

        return clicado;

    },

    _mouseDrag: function (e) {

        var dx = -e.x2 + e.x1;
        var dy = -e.y1 + e.y2;

        var x = Math.sin(this.cita) * this.r;
        var y = Math.cos(this.cita) * this.r;

        var deltax = y / (x * x + y * y);
        var deltay = x / (x * x + y * y);
        var dcita = deltax * dx - deltay * dy;
        
        this.pol.setAngulo((this.cita + grado90ToRadiano(dcita)) % (2 * Math.PI));
    },

    _beforeDrag: function (e) {
        this.pol.girando = true;
    },

    _mouseUp: function (e) {
        this.pol.girando = false;
    }

};

function LuzLineal(intensidad, pos, angulo, util) {

    this.intensidad = intensidad;
    this.pos = pos;
    this.angulo = angulo;
    this.util = util || angulo;
    this.tipo = TipoLuz.Lineal;

}

LuzLineal.prototype = {

    polarizar: function (polarizador, pos) {

        var intensidad = this.intensidad * Math.cos(this.angulo - polarizador.angulo) * Math.cos(this.angulo - polarizador.angulo);
        var angulo = polarizador.angulo;

        return new LuzLineal(intensidad, pos, angulo, this.util);

    },

    executar: function (lamina, pos) {
        
        var tipoLamina = lamina.tipo;

        switch (tipoLamina) {

            case TipoLamina.UnaOnda:
                return new LuzLineal(this.intensidad, pos, this.angulo, this.util);

            case TipoLamina.MediaOnda:
                return new LuzLineal(this.intensidad, pos, - this.angulo + lamina.angulo, this.util);

            case TipoLamina.QuartoDeOnda:
                
                var dcita = Math.abs(this.angulo - lamina.angulo);

                if (dcita == Math.PI / 4 || dcita== 5*Math.PI/4 || dcita == 3*Math.PI / 4 || dcita== 7*Math.PI/4) {

                    return new LuzCircular(this.intensidad/2, pos);

                }
                else if (dcita == 0 || dcita == Math.PI / 2 || dcita == Math.PI || dcita == 3*Math.PI/2 ) {
                    return new LuzLineal(this.intensidad, pos, dcita, this.util);
                }
                else {
                    var rx = this.intensidad * Math.sin(dcita);
                    var ry = this.intensidad * Math.cos(dcita);
                    return new LuzEliptica(this.intensidad, pos, rx, ry);
                }

            default:
                return null;
        }

    },

    draw: function (ctx) {

        var rx = this.intensidad * Math.sin(this.angulo) * Math.sin(this.util);
        var ry = this.intensidad * Math.cos(this.angulo) * Math.sin(this.util);

        this.util += Math.PI / 10;

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#3e3b73';

        for (var i = this.pos.getCanvasY() - polH; i <= this.pos.getCanvasY() + polH; i += 10) {
            ctx.moveTo(this.pos.getCanvasX(), i);
            ctx.lineTo(this.pos.getCanvasX(), i + 5);

        }

        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 1;
        ctx.moveTo(this.pos.getCanvasX(), this.pos.getCanvasY());
        ctx.lineTo(this.pos.getCanvasX() + rx, this.pos.getCanvasY() - ry);
        ctx.stroke();
        ctx.restore();

    }
};

function LuzCircular(intensidad, pos) {

    this.intensidad = intensidad;
    this.pos = pos;
    this.util = intensidad;
    this.tipo = TipoLuz.Circular;

};

LuzCircular.prototype = {

    polarizar: function (polarizador, pos) {

        return new LuzLineal(this.intensidad/2, pos, polarizador.angulo);

    },

    executar: function (lamina, pos) {

        var tipoLamina = lamina.tipo;

        switch (tipoLamina) {

            case TipoLamina.UnaOnda:
                return new LuzCircular(this.intensidad, pos);

            case TipoLamina.MediaOnda:
                return new LuzCircular(this.intensidad, pos);

            case TipoLamina.QuartoDeOnda:

                return new LuzLineal(this.intensidad, pos, lamina.angulo + Math.PI / 4, this.util);
                
            default:
                return null;
        }

    },

    draw: function (ctx) {

        var rx = this.intensidad * Math.sin(this.util);
        var ry = this.intensidad * Math.cos(this.util);
        this.util += Math.PI / 10;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.moveTo(this.pos.getCanvasX(), this.pos.getCanvasY());
        ctx.lineTo(this.pos.getCanvasX() + rx, this.pos.getCanvasY() - ry);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 1;

        ctx.arc(this.pos.getCanvasX(), this.pos.getCanvasY(), this.intensidad, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.restore();

    }

};

function LuzNatural(intensidad, pos) {

    this.intensidad = intensidad;
    this.pos = pos;
    this.util = intensidad;
    this.tipo = TipoLuz.Natural;

}

LuzNatural.prototype = {

    polarizar: function (polarizador, pos) {

        return new LuzLineal(this.intensidad / 2, pos, polarizador.angulo);

    },

    executar: function (lamina, pos) {

        return new LuzNatural(this.intensidad, pos);

    },

    draw: function (ctx) {

        for (i = 0; i <= 10; i++) {
            var Rx = floatAleatorio(0 - this.intensidad, this.intensidad);

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(255, 0, 255)';
            ctx.lineWidth = 1;
            ctx.moveTo(this.pos.getCanvasX(), this.pos.getCanvasY());
            ctx.lineTo(this.pos.getCanvasX() + Rx * Math.sin(this.util), this.pos.getCanvasY() - Rx * Math.cos(this.util));
            ctx.stroke();
            ctx.restore();
            this.util += Math.PI / 10;
        }
    }

};

function LuzEliptica(intensidad, pos, rx, ry) {

    this.intensidad = intensidad;
    this.pos = pos;
    this.rx = Math.sqrt(intensidad)*(rx/Math.sqrt(rx*rx + ry*ry));
    this.ry = Math.sqrt(intensidad)*(ry/Math.sqrt(rx*rx + ry*ry));
    this.util = intensidad;
    this.tipo = TipoLuz.Eliptica;

}

LuzEliptica.prototype = {

    polarizar: function (polarizador, pos) {

        var intensidad = Math.pow(this.rx * Math.sin(polarizador.angulo), 2) + Math.pow(this.ry * Math.cos(polarizador.angulo), 2);

        return new LuzLineal(intensidad/2, pos, polarizador.angulo);
    },

    executar: function (lamina, pos) {

        var tipoLamina = lamina.tipo;

        switch (tipoLamina) {

            case TipoLamina.UnaOnda:
                return new LuzEliptica(this.intensidad, pos, this.rx, this.ry);

            case TipoLamina.MediaOnda:
                return new LuzEliptica(this.intensidad, pos, this.rx, this.ry);

            case TipoLamina.QuartoDeOnda:

                var fi2 = Math.atan(this.rx / this.ry) + Math.PI / 4 - lamina.angulo;
                var rx = this.intensidad / (Math.pow(Math.tan(fi2), 2) - 1); //* Math.sin(fi2);
                var ry = this.intensidad * Math.cos(fi2);

                return new LuzEliptica(this.intensidad, pos, rx, ry);

            default:
                return null;
        }

    },

    draw: function (ctx) {

        var rx = this.rx * this.rx * Math.sin(this.util);
        var ry = this.ry * this.ry * Math.cos(this.util);
        this.util += Math.PI / 10;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.moveTo(this.pos.getCanvasX(), this.pos.getCanvasY());
        ctx.lineTo(this.pos.getCanvasX() + rx, this.pos.getCanvasY() - ry);
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = 'rgb(255, 0, 255)';
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.ellipse(this.pos.getCanvasX(), this.pos.getCanvasY(), this.rx*this.rx, this.ry*this.ry, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

    }


};

var Cola = function () {

    this.objs = [];
    this.luzes = [null];
    this.luzes.draw = function (ctx) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] && this[i].draw)
                this[i].draw(ctx);
        }
    };
    this.selecionado = null;

    drawer.addObj(this.luzes);

};

Cola.prototype = {

    addObj: function (obj, selecionar) {
        this.objs.push(obj);
        obj.cola = this;

        if (selecionar) {
            this.setSelecionado(obj);
        }

        this.luzes.push(null);
        this.polarizar();
    },

    setSelecionado: function (obj) {

        this.clearSelecionado();
        this.selecionado = obj;
        obj.color = '#00ff00';

        var opcion = getOpcionSelecionado(obj);
        
        opcion.css('left', obj.pos.getCanvasX() + opcion.width() / 2);
        opcion.css('top', obj.pos.getCanvasY() - obj.h / 2 - 10 - opcion.height());
        opcion.show('slow');

        var helper = $('#opcion_Polarizador [name=helper]');
        helper.focus();

        writeValoresPolarizadorActual(true);

    },

    clearSelecionado: function () {

        if (this.selecionado !== null) {
            this.selecionado.clearAsSelecionado();
            this.selecionado = null;
        }
    },

    setLuzIn: function (luz) {
        this.luzes[0] = luz;
    },

    getLuzIn: function () {
        return this.luzes[0];
    },

    getLuzOut: function(){
        return this.luzes[this.luzes.length - 1];
    },

    polarizar: function (objInicial) {

        var inicio = this.objs.indexOf(objInicial);
        var luzIn;
        
        if (inicio == -1) {
            luzIn = this.getLuzIn();
            inicio = 0;
        }
        else {
            luzIn = objInicial.getLuzIn();
        }


        if (!luzIn)
            return;
        
        for (var i = inicio; i < this.objs.length; i++) {

            var distancia = (i + 1 < this.objs.length ? this.objs[i].pos.distancia(this.objs[i + 1].pos)
                                                      : (1000 - this.objs[i].pos.x)
                            ) / 2;

            var pos = sis.newVector(this.objs[i].pos.x + distancia, 0);

            this.objs[i].setLuzIn(luzIn);
            var luzOut = this.objs[i].getLuzOut();
            luzOut.pos = pos;

            luzIn = this.luzes[i + 1] = luzOut;

        }

    },

    removeObj: function( obj ) {

        var indexOfObj = this.objs.indexOf(obj);
        Array.remove(this.objs, indexOfObj);
        Array.remove(this.luzes, indexOfObj + 1);
        drawer.removeObj(obj);
        eventHandler.removeObj(obj);
        delete obj;

    },

    removeSelected: function() {
        if( this.selecionado )
        {
            var opcion = getOpcionSelecionado(this.selecionado);
            opcion.hide('slow');

            this.removeObj(this.selecionado);
            this.clearSelecionado();
            this.polarizar();
        }
    },

    ordenar: function () {
        
        var cmp = function (a, b) {
            if (a.pos.x > b.pos.x)
                return 1;
            else if (a.pos.x < b.pos.x)
                return -1;
            else
                return 0;
        };

        this.objs.sort(cmp);
    }

};

function LuzFactory() {
    this.args = {};
}

LuzFactory.prototype = {

    addArg: function (arg, valor) {
        this.args[arg] = valor;
    },

    getLuz: function (tipo) {

        var args = this.args;

        switch (tipo) {

            case TipoLuz.Natural:
                return new LuzNatural(args['intensidad'], args['pos']);

            case TipoLuz.Lineal:
                return new LuzLineal(args['intensidad'], args['pos'], args['angulo']);

            case TipoLuz.Circular:
                return new LuzCircular(args['intensidad'], args['pos']);

            case TipoLuz.Eliptica:
                return new LuzEliptica(args['intensidad'], args['pos'], 40, 60);

            default:
                return null;

        }

    }

};

function getOpcionSelecionado(obj) {
    return $('#opcion_Polarizador');
}