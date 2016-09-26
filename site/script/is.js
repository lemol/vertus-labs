(function(window){

    function ControllerHandler(){
        this.ctrs = [];
        return this;
    }

    ControllerHandler.prototype = {

        addController: function(cls, nome){
            this.ctrs.push({cls:cls, nome:nome});
        },

        getController: function(nome){
            return new (this.ctrs.filter(function(x){ return x.nome === nome; })[0].cls)();
        }

    };

    var ch = null;
    var getControllerHandler = function() {
        if( ch === null )
            ch = new ControllerHandler();

        if(arguments.length == 2)
            ControllerHandler.prototype.addController.apply(ch, arguments);
        else if(arguments.length == 1)
            return ControllerHandler.prototype.getController.apply(ch, arguments);
        else
            return ch;
    }

    window.ControllerHandler = getControllerHandler;

})(window);

(function(window){

    if( !window.HashChangeEvent ) {

        window.onhashchange = function(e) {
        };

        var ultimoHash = window.location.hash;

        var intHandler = setInterval(function(){

            if( window.location.hash !== ultimoHash ) {
                window.onhashchange(ultimoHash);
            }

            ultimoHash = window.location.hash;

        }, 100);

    }

})(window);

(function(window){


    window.onhashchange = function(e){
        
        if(true || e.returnValue == true){
            
            var fullPath = window.location.hash.substring(2); //"leza/morais/lutonda/lemol?tag=lemol&id=1234&nome=leiza";
            var pathAndQueryRe = /(^\/?[\w\/]+\/?)\?(.+$)?/;
            var pathRe = /\/?(\w+)\/?/g;
            var queryRe = /&?(\w+=\w+)&?/g;

            var pq = pathAndQueryRe.exec(fullPath);

            var path = pq[1];
            var query = pq[2];

            var rotas = [];
            var c = null;

            while( (c = pathRe.exec(path)) )
                rotas.push(c[1]);

            var req = {};
            while( (c = queryRe.exec(query)) ){
                var sl = c[1].split('=');

                req[sl[0]] = sl[1];
            }


            var controller;
            var action;
            
            var _routes = [];

            while( (c = pathRe.exec(ControllerHandler.router)) ){
                _routes.push( c[1] );
            }

            var indexOfController = _routes.indexOf("controller");

            if( !rotas[indexOfController] ) {
                controller = ControllerHandler().getController(ControllerHandler.defaults.split('/')[0]);
            }
            else {
                controller = ControllerHandler().getController(rotas[indexOfController]);
            }

            var indexOfAction = _routes.indexOf("action");

            if( !rotas[indexOfAction] ){
                action = controller[ControllerHandler.defaults.split('/')[1]];
            }
            else {
                action = controller[rotas[indexOfAction]];
            }

            action(req);

        }

    };

    

})(window);

function Class(name, namespace, ctor) {

    this.namespace = namespace || window;
    this.name = name;
    this._class = ctor || function() {
        return this;
    };
    this.base = null;
    this.methods = {};
    
}

Class.prototype = {
    
    ctor: function(imp) {
        this._class = imp;
        return this;
    },

    inherits: function(base) {
        this.base = base;
        return this;
    },

    method: function(name, params, ret, imp) {
        
        var type = this;
        this.methods[name] = new Method(name);
        
        if( arguments.length === 1 ) {
            return {
                method: this.methods[name],
                overload: function(params, ret, imp) {
                    this.method.overload( new MethodOverload(params, ret, imp) );
                    return this;
                },
                endMethod: function() {
                    return type;
                }
            };
        }
        else {
            this.methods[name].overload( new MethodOverload(params, ret, imp) );
            return type;
        }

    },

    endClass: function() {

        var type = this;

        this._class.prototype = this._imp = {
            getType: function() {
                return type;
            },
            toString: function() {
                return type.name;
            }
        };

        var _call = function( obj, method, args ) {

            var _args = [];

            for(var i=0; i < args.length; i++){
                if( args[i].getType && args[i].getType() === Argument ) {
                    _args.push( args[i] );
                }
                else {
                    _args.push( (new ArgumentFactory()).get( args[i] ) );
                }
            }

            return method.caller( obj, _args );
        };

        /*for(var i in this.methods){
            (function(_method, _class){
                _class.prototype[_method.name] = function() {
                    return _call(this, _method, arguments);
                }
            })(this.methods[i], this._class);
        }*/

        var familia = function(raiz) {

            var este = raiz;
            var res = [];

            do {
                for(var i in este.methods)
                    res.push( este.methods[i] );
            }
            while( (este = este.base) != undefined );

            return res;
        };

        var fm = familia(this);
        for(var i=0; i < fm.length; i++){
            (function(_method, _class){
                _class.prototype[_method.name] = function() {
                    return _call(this, _method, arguments);
                }
            })(fm[i], this._class);
        }
        
        this.namespace[type.name] = this._class;

        return this._class;
    }

};

function MethodOverload( params, ret, imp ) {

    this.params = params || [];
    this.imp = imp || function() {
        throw new Error('NotImplementedError');
    };
    if( !ret )
        this.ret = 'void';

}

MethodOverload.prototype = {
    param: function( name, type, deflt ) {

        if( arguments.length === 1)
            this.params.push( name );

        this.addParam( new Parameter(name, type, deflt) );

    },
    implements: function(imp) {
        this.imp = imp;
    }
};

function Method(name, overloads) {
    this.name = name;
    this.overloads = overloads || [];
}

Method.prototype = {
    overload: function(overload) {
        this.overloads.push(overload);
    },
    getOverload: function(args) {

        var orlds = this.overloads.filter( function(ovrld) {

            if( args.length !== ovrld.params.length )
                return false;

            for( var i = 0; i < args.length; i++ ) {
                if( args[i].type !== ovrld.params[i].type )
                    return false;
            }

            return true;

        });

        return orlds[0];

    },
    implements: function(params, ret, imp) {
        this.addOverload( new MethodOverload(params, ret, imp) );
    },
    caller: function( obj, args ) {

        var overload = this.getOverload( args );
        var _args = args.map(function(arg){ return arg.value; });

        return overload.imp.apply( obj, _args );

    }
};

function Parameter( name, type, deflt ) {
    this.name = name;
    this.type = type;
    this.deflt = deflt;
}

function Argument( value, type ) {
    this.value = value;
    this.type = type;
}

function ArgumentFactory() {
    return this;
}

ArgumentFactory.prototype = {
    get: function(valor) {

        var type = ( valor.getType && valor.getType() ) || typeof valor;

        return new Argument( valor, type );

    }
};


function Labs() {
    return this;
}

Labs.prototype = {

    index: function(req){

        var tag = req.tag;

        $.ajax({
		    url: 'index.json',
		    success: function(data){
                data = JSON.parse(data);
                data = data.filter(function(x){ return x.tags.indexOf(tag) !== -1; });
                carregar(data);
            }
	    });

    }

};

ControllerHandler.defaults = 'Labs/index';
ControllerHandler.router = 'controller/action/id';
ControllerHandler(Labs, "Labs");

(function(namespace){

    var FooBase = new Class('FooBase', namespace, function(a, b) {
        this.a = a;
        this.b = b;
    });
    FooBase.method('algo')
           .overload([new Parameter('x', 'string'), new Parameter('y', 'number')], 'number', function(x, y) {
               return x + y;
           })
           .overload([new Parameter('z', 'number')], Array, function(z) {
               var res= []; for(var i=0; i<=z; i++) res.push(i); return res;
           })
       .endMethod();

    FooBase.endClass();

})(window);

(function(namespace){

    var Foo = new Class('Foo', namespace, function(a, b) {
        this.a = a;
        this.b = b;
    });
    Foo
    .inherits((new FooBase()).getType())
    .method('f')
        .overload([new Parameter('x', 'string'), new Parameter('y', 'number')], 'number', function(x, y) {
            return x + y;
        })
        .overload([new Parameter('z', 'number')], Array, function(z) {
            var res= []; for(var i=0; i<=z; i++) res.push(i); return res;
        })
    .endMethod()
    .method('g', [new Parameter('u', 'number'), new Parameter('v', 'number')], 'number', function(u, v) {
        this.a = u+v;
        return this.a;
    });

    Foo.endClass();

})(window);

var foo = new Foo(10, 12);
var t = foo.getType();
var s = foo.toString();
var a = foo.g(3, 4);
var b = foo.f('lemol', 2);
var c = foo.f(10);
var e = foo.algo("Lemolsoft", 2);
var d = 10;