(function (window) {

    var _ellipse = function (cx, cy, rx, ry, startAngle, endAngle, anticlockwise) {
        ellipse(this, cx, cy, rx, ry, startAngle, endAngle, anticlockwise);
    };

    if (window.CanvasRenderingContext2D)
        window.CanvasRenderingContext2D.prototype.ellipse = _ellipse;

})(window);

function ellipse(context, cx, cy, rx, ry, startAngle, endAngle, anticlockwise) {
    
    context.save(); 
    context.beginPath();

    context.translate(cx - rx, cy - ry);
    context.scale(rx, ry);
    context.arc(1, 1, 1, startAngle || 0, endAngle || 2 * Math.PI, anticlockwise);
    
    context.restore();
    context.stroke();

    context.save();
}


function drawEllipse1(x, y, w, h) {
    var ctx = this;
    var kappa = .5522848,
			ox = (w / 2) * kappa, // control point offset horizontal
	  oy = (h / 2) * kappa, // control point offset vertical
	  xe = x + w,           // x-end
	  ye = y + h,           // y-end
	  xm = x + w / 2,       // x-middle
	  ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.closePath();

    ctx.stroke();
}
		