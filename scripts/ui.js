
var ReglaType = { H: 1, V: 2 };

function Regla(tipo, x, y, w, h, opciones){

    this.tipo = tipo;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.color_fondo = opciones && opciones.color || '#63f3ee';
    this.color_lineas = opciones && opciones.lineas || '#000000';
    this.color_texto = opciones && opciones.texto || this.color_lineas;
    this.centro = opciones && opciones.centro || (this.tipo == ReglaType.H ? w : h) / 2;
    this.delta = opciones && opciones.delta || mmToPixel(10);

    var drawReglaX = function (ctx) {

        ctx.clearRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color_fondo;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        var iMax = max(this.w - this.centro, this.centro);

        ctx.beginPath();
        for (var i = 0; i <= iMax; i += this.delta) {

            var iPositivo = this.centro + i;
            var iNegativo = this.centro - i - this.delta;

            var drawPuntos = function(punto, condicion) {

                if (condicion(this)) {
                    ctx.moveTo(punto, this.y);
                    ctx.lineTo(punto, this.y + 10);

                    var texto = redondear(pixelToMm(punto - this.centro) / 10, 0);
                    var textW = ctx.measureText(texto).width;

                    ctx.fillStyle = this.color_texto;
                    ctx.fillText(texto, punto - textW / 2, this.y + 20);
                }

            };

            drawPuntos.apply(this, [iPositivo, function (eu) { return iPositivo <= eu.x + eu.w; } ]);
            drawPuntos.apply(this, [iNegativo, function (eu) { return iNegativo >= eu.x; } ]);

        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color_lineas;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.lineWidth = 1;
        ctx.stroke();

    };

    var drawReglaY = function (ctx) {

        ctx.clearRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color_fondo;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        var jMax = max(h - this.centro, this.centro);

        ctx.beginPath();
        for (var j = 0; j <= jMax; j += this.delta) {

            var jPositivo = this.centro + j;
            var jNegativo = this.centro - j - this.delta;

            var drawPuntos = function(punto, condicion) {

                if (condicion(this)) {
                    ctx.moveTo(this.x, punto);
                    ctx.lineTo(this.x + 10, punto);

                    var texto = redondear(-pixelToMm(punto - this.centro) / 10, 0);
                    var textH = ctx.measureText('m').width;

                    ctx.fillStyle = this.color_texto;
                    ctx.fillText(texto, this.x + 12, punto + textH / 3);
                }

            };

            drawPuntos.apply(this, [jPositivo, function (eu) { return jPositivo <= eu.y + eu.h; } ]);
            drawPuntos.apply(this, [jNegativo, function (eu) { return jNegativo >= eu.y; } ]);

        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color_lineas;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    if (tipo === ReglaType.H)
        this.draw = drawReglaX;
    else if (tipo === ReglaType.V)
        this.draw = drawReglaY;

    return this;
}


Regla.prototype.clicado = function (e) {
    return this.x <= e.OffsetX() && e.OffsetX() <= this.x + this.w &&
                           this.y <= e.OffsetY() && e.OffsetY() <= this.y + this.h;
};

Regla.prototype.beforeDrag = function (e) {
    escena.css('cursor', 'move');
};

Regla.prototype.mouseUp = function (e) {
    escena.css('cursor', 'auto');
};

Regla.prototype.mouseDrag = function (e) {

    switch (this.tipo) {
        case ReglaType.H:
            this.centro += e.x1 - e.x2;
            this.draw(ctx);
            break;
        case ReglaType.V:
            this.centro += e.y1 - e.y2;
            this.draw(ctx);
            break;
        default:
            break;
    }

};


function max(x, y) {

    return x > y ? x : y;

}