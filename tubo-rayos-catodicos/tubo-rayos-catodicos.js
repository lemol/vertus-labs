var sis,
    ctx,
    timeHandler,
    barras,
    INICIO_CAMPO,
    FIN_CAMPO,
    Local;

var Barras = function (bePos, sep, w, h, color) {
    this.pos = bePos;
    this.sep = sep;
    this.w = w;
    this.h = h;
    this.color = color;

    INICIO_CAMPO = this.pos.x;
    FIN_CAMPO = this.pos.x + this.w;
    sis.d = this.w;

    this.topo = this.pos.y + this.sep;
    this.base = this.pos.y;
}
.Class("Barra")
.Implements({

    draw: function (ctx) {

        var x = this.pos.getCanvasX(),
            y = this.pos.getCanvasY();
        
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.w, this.h);

        y -= this.h + this.sep;

        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.w, this.h);

    }

})
.End();


var Bola = function (pos, vel, r, color, m, q) {

    this.base.Esfera(pos, vel, r, color);
    this.Particula.init(0);
    this.m = m;
    this.q = q;

}
.Class("Bola")
.ClassOf(Esfera)
.Implements(IFnParticula)
.As(Particula)
.Implements({

    mover: function (ctx, dt) {

        if (this.local != 2 && this.pos.x + this.r + this.vin.x * dt > INICIO_CAMPO && this.pos.x <= FIN_CAMPO) {

            this.fnVel.y = function (dt) { return this.q * sis.E * (this.pos.x - INICIO_CAMPO) / (this.m * this.vin.x); };
            this.fnPos.y = function (dt) { return this.posin.y + this.q * sis.E * Math.pow(this.pos.x - INICIO_CAMPO + this.r, 2) / (2 * this.m * this.vin.x * this.vin.x); };
            this.local = 2;

        }
        else if (this.local != 3 && this.pos.x > FIN_CAMPO) {

            var velfinal = this.vel.y;
            this.fnPos.y = function (dt) { return this.pos.y + velfinal * dt; };
            this.local = 3;

        }

        var res = this.Esfera.mover(ctx, dt, this.chkChoque);

        return res;

    },
    drawPts: function (ctx, pos, dt) {

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(pos.getCanvasX(), pos.getCanvasY());
        ctx.strokeStyle = '#0000ff';

        var eu = this;

        for (var x = pos.x + .01; x <= this.pos.x; x += .01) {
            var y = Vector.prototype.getCanvasY.apply({ y: eu.fnPos.y.apply(eu, [x]), sis: sis }, []);
            ctx.lineTo(Vector.prototype.getCanvasX.apply({ x: x, sis: sis }, []), y);
        }

        ctx.stroke();

    },
    chkChoque: function (dt) {

        // en la pantalla
        if (this.pos.x + this.vin.x * dt >= 1000 - 30 - this.r) {
            this.pos.x = 1000 - 30 - this.r;
            return true;
        }
        // en el piso
        else if (this.pos.y + this.vel.y * dt <= 0 + this.r) {
            this.pos.y = 0 + this.r;
            return true;
        }
        // en el cielo
        else if (this.pos.y + this.vel.y * dt >= 500 - this.r) {
            this.pos.y = 500 - this.r;
            return true;
        }
        // en la placa topo
        else if (this.pos.x <= FIN_CAMPO && (this.pos.y + this.r + this.vel.y * dt > barras.topo)) {
            this.pos.y = barras.topo - this.r;
            return true;
        }
        // en la placa base
        else if (this.pos.x <= FIN_CAMPO && (this.pos.y - this.r + this.vel.y * dt <= barras.base)) {
            this.pos.y = barras.base + this.r;
            return true;
        }

        return false;
    }
})
.End();

function cargar(){

    parar();
    ctx.clearRect(0, 0, 1000, 500 - 30);

    sis = new Sistema(new Vector(0, 0), new Vector(0, 500 - 30));
    sis.E = 200,
    sis.L = 30,
    sis.dt = 0.011;
    sis.dtI = 11;

    barras = new Barras(sis.newVector(120, 150), 100, 200, 10, '#f0ff0f');

    //sis.addObj(new Bola(sis.newVector(0, 250), new Vector(3 * Math.pow(10, 0), 0), 4, "#ff0000", 9.11 * Math.pow(10, 1), 1.6 * Math.pow(10, -1)));
    //sis.addObj(new Bola(sis.newVector(0, 200), new Vector(100, 0), 4, "#ffffff", 50, 2));
    //sis.addObj(new Bola(sis.newVector(0, 270), new Vector(60, 0), 8, "#ffffff", 50, -1.6 * Math.pow(10, -19)));

    particulasAleatorias(15);

    drawInicial();

}

function particulasAleatorias(n) {
    
    for (; n >= 0; n--) {

        var r = floatAleatorio(1, 10),
            color = 'rgb(' + intAleatorio(0, 255) + ',' + intAleatorio(0, 255) + ',' + intAleatorio(0, 255) + ')',
            m = floatAleatorio(intAleatorio(1, 5), intAleatorio(1, 5)),
            q = floatAleatorio(intAleatorio(-50, 0), intAleatorio(0, 50)),
            y = floatAleatorio(barras.base + r, barras.topo - r),
            vin = floatAleatorio(50, 1000);

        sis.addObj(new Bola(sis.newVector(0, y), new Vector(vin, 0), r, color, m, q));

    }

}

function drawInicial() {
    drawBarras();
    drawParticulas();
}

function drawBarras() {
    barras.draw(ctx);
}

function drawParticulas() {
    for (var i in sis.objs)
        sis.objs[i].Esfera.draw(ctx);
}

function moverParticulas() {
    for (var i in sis.objs)
    //(sis.objs[i].parado = sis.objs[i].parado || !sis.objs[i].mover(ctx, sis.dt)) && (parar() || $('#tiempo').text(diff(media(ar), sis.dtI)));  /* && 
        (sis.objs[i].parado = sis.objs[i].parado || !sis.objs[i].mover(ctx, sis.dt)) && 
        (
            (
                sis.objs[i].Esfera.draw(ctx)    ||
                sis.remObj(sis.objs[i])         ||
                particulasAleatorias(floatAleatorio(
                                                    -2 * (sis.objs.length > 5) - 2 * (sis.objs.length > 6 && sis.objs[0].r >= 5),
                                                     1 + (sis.objs.length < 3) + (sis.objs.length < 2 && sis.objs[0].r > 5)
                                    ))
            )
        );

    //(sis.objs[i].parado = sis.objs[i].parado || !sis.objs[i].mover(ctx, sis.dt)) && sis.objs[i].Esfera.draw(ctx);
}

function iniciar() {

    timeHandler = setInterval(animar, sis.dtI);
    time = (new Date()).getTime();
}

var time = 0;
var ar = [];

function suma(ar) {
    res = 0;
    for (var i = 0; i < ar.length; i++)
        res += ar[i];
    return res;
}

function media(ar) {
    return suma(ar) / ar.length;
}

function diff(x, y) {
    return Math.abs(x + y);
}

function animar() {

    //$('#tiempo').text(time - (time=(new Date()).getTime()));
    ar.push(time - (time = (new Date()).getTime()));

    ctx.clearRect(0, 0, 1000 - 30, 500 - 30);

    drawBarras();
    moverParticulas();

    //$('#tiempo').text(sis.objs.length);
    //$('#tiempo').html(part.pos.x + part.vin.x * 0.033 + '<br/>' + (1000 - 30 - part.r));
    //$('#vel').text(pixelToMm(part.vel.x, 96)/10);
    //$('#deplazamiento').html(pixelToMm(part.pos.x,96)/10 + '<br/>' + pixelToMm(part.vel.x,96) * sis.dt/10);

    //alert(part.vel.x + '\n' + dt);



}

function parar(){
    clearInterval(timeHandler);
}


function setContext(context) {
    ctx = context;
}
