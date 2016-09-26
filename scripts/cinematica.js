/// <reference path="gaal.js" />

var Particula = function (posin, vin, ace) {
    this.posin = posin;
    this.pos   = this.posin.duplicar();
    this.vin   = vin || new Vector(0, 0);
    this.vel   = this.vin.duplicar();
    this.ace   = ace || new Vector(0, 0);
}
.Class("Particula")
.Implements({

    mover: function (dt) {

        this.vel.addX(this.ace.x * dt);
        this.vel.addY(this.ace.y * dt);

        this.pos.addX(this.vin.x * dt + this.ace.x * dt * dt / 2);
        this.pos.addY(this.vin.y * dt + this.ace.y * dt * dt / 2);

    }

})
.End();

var IFnParticula = function () { }
.Class()
.Implements({

    init: function (dt, fnPos, fnVel) {
        this.fnPos = fnPos ||
                     new FnVector(
                         function (dt) { return this.pos.x + this.vin.x * dt + this.ace.x * dt * dt / 2 },
                         function (dt) { return this.pos.y + this.vin.y * dt + this.ace.y * dt * dt / 2; }
                     );

        this.fnVel = fnVel ||
                     new FnVector(
                        function (dt) { return this.vin.x + this.ace.x * dt; },
                        function (dt) { return this.vin.y + this.ace.y * dt; }
                     );

        //this.vel.fnAdd(this.fnPos, dt);
        //this.pos.fnAdd(this.fnPos, dt);

        this.vel.x=(this.fnVel.x.apply(this, [dt]));
        this.vel.y=(this.fnVel.y.apply(this, [dt]));
        this.pos.x=(this.fnPos.x.apply(this, [dt]));
        this.pos.y=(this.fnPos.y.apply(this, [dt]));

    },

    mover: function (dt) {

        this.vel.x=(this.fnVel.x.apply(this, [dt]));
        this.vel.y=(this.fnVel.y.apply(this, [dt]));
        this.pos.x=(this.fnPos.x.apply(this, [dt]));
        //this.pos.addY(this.fnPos.y.apply(this, [dt]));
        this.pos.y = this.fnPos.y.apply(this, [dt]);
        //        this.vel.addX(this.fnVel.x(dt));
        //        this.vel.addY(this.fnVel.y(dt));
        //        this.pos.addX(this.fnPos.x(dt));
        //        this.pos.addY(this.fnPos.y(dt));

        //this.vel.fnAdd(this.fnVel, dt);
        //this.pos.fnAdd(this.fnPos, dt);

        //this.vel.set(this.fnVel(dt));
        //this.pos.set(this.fnPos(dt));

    }

})
.End();