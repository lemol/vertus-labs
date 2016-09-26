function Pantalla() {

}

Pantalla.prototype = {

    draw: function(ctx) {

        var luzOut = cola.getLuzOut();

        if( !luzOut ) return;

        var intensidad = luzOut.intensidad;
        var factor = intensidad / 60;

        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255,' + factor + ')';
        ctx.rect(1000-30, 250 - (polH+60)/2, 30, polH+60);
        ctx.fill();

        ctx.restore();
    }

};
