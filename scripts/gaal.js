
var Vector = function (x, y, sis) {

    this.x = x;
    this.y = y;
    this.sis = sis;

}
.Class("Vector")
.Implements({

    getCanvasX: function () { return this.sis.toCanvasX(this.x); },
    getCanvasY: function () { return this.sis.toCanvasY(this.y); },
    setCanvasX: function (x) { this.x = this.sis.toSistemaX(x); return this; },
    setCanvasY: function (y) { this.y = this.sis.toSistemaY(y); return this; },

    addX: function (x) { return this.x += x; },
    addY: function (y) { return this.y += y; },
    add: function (v) {
        v = v || new Vector(1, 1);
        this.x += v.x;
        this.y += v.y;
        return this;
    },
    fnAdd: function (fnV, dt) {
        this.x += fnV.fnX(dt);
        this.y += fnV.fnY(dt);
        return this;
    },
    sub: function (v) {
        v = v || new Vector(1, 1);
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },
    // Producto punto
    mult: function (v) { v = v || this; return this.x * v.x + this.y * v.y; },
    // Producto con escalar
    escalar: function (k) {
        this.x *= k;
        this.y *= k;
        return this;
    },
    escala: function (k) { return new Vector(this.x * k, this.y * k); },
    norma: function () { return Math.sqrt(this.x * this.x + this.y * this.y); },
    normal: function () { return new Vector(this.x / this.norma(), this.y / this.norma()); },
    distancia2: function (v) { return Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2); },
    distancia: function (v) {
        v = v || new Vector(0, 0);
        return Math.sqrt(this.distancia2(v));
    },

    set: function (v, sis) {
        this.x = v.x;
        this.y = v.y;
        this.sis = sis || this.sis;

        return this;
    },
    equal: function (v) { return this.x == v.x && this.y == v.y; },
    toString: function () { return "(" + this.x + ", " + this.y + ")"; },
    duplicar: function () { return new Vector(this.x, this.y, this.sis); }

})
.End();

var FnVector = function (x, y) {
    this.x = x;
    this.y = y;
}
.Class("FnVector")
.Implements({
    
})
.End();

var Sistema = function (canvasPos, ori, deltaT) {

    this.canvasPos = canvasPos || new Vector(0, 0);
    this.ori = ori;
    this.dt = 0;
    this.objs = [];

}
.Class("Sistema")
.Implements({

    addObj: function (item) { this.objs.push(item); },
    remObj: function (item) {
        for (var i = 0; i < this.objs.length; i++) {
            if (this.objs[i] === item) {
                Array.remove(this.objs, i);
                return;
            }
        }
    },
    newVector: function (x, y) { return new Vector(x, y, this); },
    toCanvasX: function (x) { return this.canvasPos.x + this.ori.x + x; },
    toCanvasY: function (y) { return this.canvasPos.y + this.ori.y - y; },
    toSistemaX: function (x) { return x - this.canvasPos.x - this.ori.x; },
    toSistemaY: function (y) { return this.canvasPos.y + this.ori.y - y; }

}).End();

function Rectangulo(x1, y1, x2, y2){
    
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    
    this.contieneVector = function(v){
        return v.getX() >= this.x1 && v.getX() <= this.x2 &&
               v.getY() >= this.y1 && v.getY() <= this.y2;
    };
    
    this.area = function(){
        return (this.x2 - this.x1) * (this.y2 - this.y1);
    }
    
}
