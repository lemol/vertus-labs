var TipoLamina = { UnaOnda: 1, MediaOnda: 2, QuartoDeOnda: 3 };

var Lamina = function (ancho, dn, angulo, pos, w, h, tipo) {

    this.ancho = ancho;
    this.dn = dn || 15;
    this.angulo = angulo || 0;
    this.pos = pos;
    this.w = w + 20;
    this.h = h + 20; 
    this.color = '#ffffff';
    this.tipo = tipo;
    this.lineaAngulo = new LineaAnguloLamina(this);

};

Lamina.prototype = {
    

    executar: function (luz) {
        return luz.executar(this);
    },

    getLuzIn: function () {
        return this.luzIn;
    },

    getLuzOut: function () {
        return this.executar(this.luzIn);
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
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;

        //this.w = this.w - 

        ctx.rect(this.pos.getCanvasX() - this.w + 10, this.pos.getCanvasY() - this.h + 10, 2*this.w - 20, 2*this.h - 10 );

        ctx.moveTo(this.pos.getCanvasX() - this.w + 10, this.pos.getCanvasY() - this.h + 10);
        ctx.lineTo(this.pos.getCanvasX() - this.w + 10 + 10, this.pos.getCanvasY() - this.h + 10 - 10);
        
        ctx.lineTo(this.pos.getCanvasX() - this.w + 2*this.w, this.pos.getCanvasY() - this.h + 10 - 10);

        ctx.lineTo(this.pos.getCanvasX() - this.w + 2*this.w - 10, this.pos.getCanvasY() - this.h + 10);

        ctx.moveTo(this.pos.getCanvasX() - this.w + 2*this.w, this.pos.getCanvasY() - this.h + 10 - 10);

        ctx.lineTo(this.pos.getCanvasX() - this.w + 2*this.w, this.pos.getCanvasY() - this.h + 2*this.h - 10);

        ctx.lineTo(this.pos.getCanvasX() - this.w + 2*this.w - 10, this.pos.getCanvasY() - this.h + 2*this.h);

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
        cola.ordenar();
        cola.polarizar();
    }

};


var LineaAnguloLamina = function (pol) {

    this.pol = pol;
    this.pos = pol.pos;
    this.cita = pol.angulo;
    this.rx = pol.w;
    this.ry = pol.h;
    this.g = pol.dn || 15;
    this.r = 1;

};

LineaAnguloLamina.prototype = {

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
