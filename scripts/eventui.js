(function (w) {

    var windowMouseUp = $(w).toObservable('mouseup');

    var setMouseEventOffset = function (window) {

        window.MouseEvent.prototype.OffsetX = window.jQuery.Event.prototype.OffsetX = function () {
            return this.offsetX || this.pageX - this.target.offsetLeft;
        };

        window.MouseEvent.prototype.OffsetY = window.jQuery.Event.prototype.OffsetY = function () {
            return this.offsetY || this.pageY - this.target.offsetTop;
        };


    };

    var setEvents = function (window) {

        var EventUI = function (context, listenWindowMouseUp) {

            this.context = context;
            this.listenWindowMouseUp = listenWindowMouseUp;
            this.init();

            var _ = this;

            var mouseMoves = _.mouseMove
                .Skip(1)
                .Zip(_.mouseMove, function (prev, actual) {
                    return { x1: prev.OffsetX(), y1: prev.OffsetY(),
                        x2: actual.OffsetX(), y2: actual.OffsetY()
                    };
                });

            var mouseDrags = _.mouseDown.SelectMany(function (e) {

                for (var i = 0, o; i < _.dragables.length && (o = _.dragables[i]); i++) {

                    if (o.clicado(e)) {

                        o.beforeDrag(e);
                        _.actual = o;

                        if (_.listenWindowMouseUp)
                            return mouseMoves.TakeUntil(windowMouseUp);
                        else
                            return mouseMoves.TakeUntil(_.mouseUp);

                    }

                }

                return Rx.Observable.Empty();

            });

            mouseDrags.Subscribe(function (e) {
                _.actual.mouseDrag(e);
            });

            if (_.listenWindowMouseUp) {
                windowMouseUp.Subscribe(function (e) {
                    if (_.actual) {
                        _.actual.mouseUp(e);
                        _.actual = null;
                    }
                });
            }
            else {
                _.mouseUp.Subscribe(function (e) {
                    _.actual.mouseUp(e);
                    _.actual = null;
                });
            }

            return this;
        };

        EventUI.prototype = {

            init: function () {
                this.setMouseDown();
                this.setMouseMove();
                this.setMouseUp();

                this.dragables = [];

            },
            addDragable: function (obj, defineMetodosEventos) {
                this.dragables.push(obj);

                if (defineMetodosEventos) {
                    this.setMetodosEventos(obj);
                }

                obj.setAsDragable && obj.setAsDragable(this);
            },
            removeObj: function(obj) {
                
                var indexOfObj = this.dragables.indexOf(obj);
                Array.remove(this.dragables, indexOfObj);

            },
            setMouseMove: function () {
                this.mouseMove = this.context.toObservable('mousemove');
            },
            setMouseDown: function () {
                this.mouseDown = this.context.toObservable('mousedown');
            },
            setMouseUp: function () {
                this.mouseUp = this.context.toObservable('mouseup');
            },

            setMetodosEventos: function (obj) {

                obj.clicado = function (e) {

                    if (this._clicado) {
                        return this._clicado(e);
                    }
                    else {
                        return (this.pos.getCanvasX() <= e.OffsetX() && e.OffsetX() <= this.pos.getCanvasX() + this.w &&
                        this.pos.getCanvasY() <= e.OffsetY() && e.OffsetY() <= this.pos.getCanvasY() + this.h) ||
                            (this._clicado && this._clicado(e));
                    }

                };

                obj.beforeDrag = function (e) {
                    this._beforeDrag && this._beforeDrag();
                    escena.css('cursor', 'move');
                };

                obj.mouseUp = function (e) {
                    this._mouseUp && this._mouseUp();
                    escena.css('cursor', 'auto');
                };

                obj.mouseDrag = function (e) {

                    if (this._mouseDrag) {
                        obj._mouseDrag(e);
                    }
                    else {
                        this.pos.setCanvasX(this.pos.getCanvasX() + e.x1 - e.x2);
                        this.pos.setCanvasY(this.pos.getCanvasY() + e.y1 - e.y2);
                    }

                };


            }
        };

        window.EventUI = EventUI;

    };

    (w.PROBANDO
        &&
        (w.setMouseEventOffset = setMouseEventOffset) && (w.setEvents = setEvents))
            ||
            (setMouseEventOffset(w) || setEvents(w));


})(window);

var Drawer = function() {
    this.objs = [];
};

Drawer.prototype = {

    addObj: function (obj) {
        this.objs.push(obj);

        obj.setDrawer && obj.setDrawer(this);
    },

    removeObj: function (obj) {

        var indexOfObj = this.objs.indexOf(obj);
        Array.remove(this.objs, indexOfObj);

    },

    drawAll: function (ctx, clear) {

        if (clear)
            ctx.clearRect(0, 0, 1000, 500);

        for (var i = 0; i < this.objs.length; i++) {
            this.objs[i].draw(ctx);
        }

    }

}