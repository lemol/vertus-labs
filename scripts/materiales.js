var Esfera = function (pos, vel, r, color) {
    this.base.Particula(pos, vel);
    this.r = r;
    this.color = color;
}
.Class("Esfera")
.ClassOf(Particula)
.Implements({

    draw: function (ctx) {
    
        var x = this.pos.getCanvasX(),
            y = this.pos.getCanvasY();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();

    },

    mover: function (ctx, dt, fn) {

        //return fn() || (this.Particula.mover(dt) && this.Esfera.draw(ctx));
        
        var r = !fn(dt);
        
        if (r) {
            this.Particula.mover(dt);
            this.Esfera.draw(ctx);
        }

        return r;
        
    }
})
.End();

