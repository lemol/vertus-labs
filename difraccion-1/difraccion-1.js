/// <reference path="utilidades.js" />

var Funcion = { NONE:0, INTERFERENCIA: 1, DIFRACCION: 2, MODULACION: 3 };

function getFunciones(N, b, d, L, lambda, config){
    
    // var senoFi = function (y) { return y / L; };
    var senoFi = function (y) { return y / Math.sqrt(L * L + y * y); };
    var beta = function (y) { return Math.PI * d * senoFi(y) / lambda; };
    var alfa = function (y) { return Math.PI * b * senoFi(y) / lambda; };

    var interferencia = function (y) {
        if (y == 0)
            return 4;

        return 4 * Math.pow(Math.sin(N * beta(y)), 2) / (Math.pow(Math.sin(beta(y)), 2) * N * N);
    };

    var difraccion = function (y) {
        if (y == 0)
            return 4;

        return Math.pow(Math.sin(alfa(y)), 2) / Math.pow(alfa(y), 2);
    };

    var IporIo = function (y) { return difraccion(y) * interferencia(y) };
    var modulacion = function (y) { return 4 * difraccion(y); };

    var res = {};

    res.interferencia = { fn: interferencia, ver: config.interferencia.ver, verPatron: config.patron.funcion === Funcion.INTERFERENCIA, color: config.interferencia.color };
    res.difraccion = { fn: IporIo, ver: config.difraccion.ver, verPatron: config.patron.funcion === Funcion.DIFRACCION, color: config.difraccion.color };
    res.modulacion = { fn: modulacion, ver: config.modulacion.ver, verPatron: config.patron.funcion === Funcion.MODULACION, color: config.modulacion.color };

    return res;

}

function plotTodo(ctx, N, b, d, L, lambda, configs) {

    var sis = new Sistema(new Vector(0, 0), new Vector(configs.sis.oriX, configs.sis.oriY)),
        plotConfig = { escalaX: configs.escalaX || -100, escalaY: configs.escalaY || 1, min: configs.min || -250, max: configs.max || 250 },
        funciones = getFunciones(N, b, d, L, lambda, configs);

    ctx.lineWidth = configs.lineWidth || 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for(var i in funciones){

        var actual = funciones[i],
            color = actual.color;

        if(actual.verPatron){
            color = Color.fromLambda(pixelToNm(lambda));
            drawPatron(actual.fn, ctx, sis, color, N, configs.sis.oriX, configs.patron.width, plotConfig);
        }

        if(actual.ver)
            plot(actual.fn, ctx, sis, plotConfig, color.toString());

    }

}

function plot(fn, ctx, sis, config, color) {

    config = config || {};

    var escalaX = config.escalaX || 0.1,
        escalaY = config.escalaY || 0.1,
        dy = mmToPixel(config.dy || 0.1),
        min = config.min / escalaY,
        max = config.max / escalaY;

    if (color)
        ctx.strokeStyle = color;

    ctx.beginPath();

    for (var y = min; y <= max; y += dy) {

        var j = sis.toCanvasY(y * escalaY),
            i = sis.toCanvasX(escalaX * fn(y));

        if (y == min) {
            ctx.moveTo(i, j);
        }
        else {
            ctx.lineTo(i, j);
        }

    }

    ctx.stroke();

}

function drawPatron(fn, ctx, sis, colorRgb, N, x, w, config){

    config = config || {};

    var escalaX = config.escalaX || 0.1,
        escalaY = config.escalaY || 0.1,
        dy = mmToPixel(config.dy || 0.1),
        min = config.min / escalaY,
        max = config.max / escalaY;

    for (var y = min; y <= max; y += dy) {

        var j = sis.toCanvasY(y * escalaY),
            razon = fn(y) / 4;

        ctx.beginPath();

        var s = colorRgb.toString(razon); // colorRgb.toRgbaString(razon);
        ctx.strokeStyle = s; 

        ctx.moveTo(x, j);
        ctx.lineTo(x+w, j);

        ctx.stroke();
    }

}

