var timeHandler,
    ctx, dt=0;

var Caja = classOf(Particula, function(pos, w, h, color, vel){
    this.pos   = pos;
    this.w     = w;
    this.h     = h;
    this.color = color;
    this.vel   = vel;
});

implements(Caja, {
    
    draw: function(ctx){

        var x = this.pos.getCanvasX(),
            y = this.pos.getCanvasY() - this.h;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.w, this.h);
        
    },
    mover: function(ctx, dt){
    
        this.base.mover.call(this, dt);
        this.draw(ctx);
        
    }
    
});

var c1;

function cargar(){

    parar();
    ctx.clearRect(0, 0, 700, 500 - 30);
    
    var sis = new Sistema(new Vector(0,0), new Vector(0, 500-30));
    c1  = new Caja(sis.newVector(0,0), 25, 25, '#0000ff',new Vector(0,0));
    
    c1.draw(ctx);
}

function iniciar(){
    timeHandler = setInterval(animar, 11);
}

function animar(){
    
    dt += .011;
    
    ctx.clearRect(0, 0, 700, 500 - 30);
    c1.mover(ctx, .011);
    
    $('#tiempo').text(dt);
    $('#vel').text(pixelToMm(c1.vel.x, 96)/10);
    $('#deplazamiento').html(pixelToMm(c1.pos.x,96)/10 + '<br/>' + pixelToMm(c1.vel.x,96) * dt/10);
    
    //alert(c1.vel.x + '\n' + dt);
    
    
    
}

function parar(){
    clearInterval(timeHandler);
}

function setContext(context){
    ctx = context;
}

function drawRegla(ctx){
    
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(0, 500 - 30, 700, 30);
    ctx.fillStyle="yellow";
    ctx.fillRect(0, 500-30, 700, 30);
    
    for(var x = 0; x <= 700; x += mmToPixel(10, 96) ){
        
        ctx.moveTo(x, 500 - 30);
        ctx.strokeStyle="#000000";
        ctx.lineTo(x, 500 - 20);
        ctx.stroke();
        
        var X = redondear(pixelToMm(x, 96)/10, 0);
        
        var textW = ctx.measureText(X).width;
        
        ctx.fillStyle="#000000";
        ctx.fillText(X, x - textW/2, 500-10);
        
    }
    
}
