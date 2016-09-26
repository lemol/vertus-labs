/// <reference path="*.js" />


(function (_) {

    var _Implements = function (cls, imp) {

        if (imp !== undefined) {
            for (var f in imp) {
                cls.prototype[f] = imp[f];
            }
        }

    };

    var _ImplementsInterface = function (cls, intf, impl) {

        cls.prototype[intf.toString()] = {};
        for (var f in impl.prototype) {
            cls.prototype[intf.toString()][f] = impl.prototype[f]; //function () {
            //impl[f].apply(this, arguments);
            //}
        }
    }

    var _ClassOf = function (cls, base) {

        if (base !== undefined) {

            cls.base = base;
            return;
            cls.prototype.base = cls.prototype.base || {};

            for (_base = base; _base !== undefined; _base = _base.base) {

                if (_base.ctor !== undefined) {
                    cls.prototype.base[_base.toString()] = (function (_base) {
                        return function () {
                            _base.ctor.prototype.constructor.apply(this.o, arguments);
                        };
                    })(_base);
                }
                else {
                    cls.prototype.base[_base.toString()] = new Function();
                }

                cls.prototype[_base.toString()] = {};
                for (var f in _base.prototype) {
                    cls.prototype[_base.toString()][f] = _base.prototype[f];
                }

            }
        }

    };

    var Class = function (ctor, nome) {

        if (ctor === undefined) {
            ctor = new Function();
        }

        var cls = (function (ctor) {
            return function () {

                if (this.cls === undefined) {
                    this.base = {};
                    for (var base = cls.base; base !== undefined; base = base.base) {

                        if (base.ctor !== undefined) {
                            this.base[base.toString()] = (function (b, o) {
                                return function () {
                                    b.ctor.prototype.constructor.apply(o, arguments);
                                };
                            })(base, this);
                        }

                        this[base.toString()] = {};
                        for (var f in base.prototype) {
                            this[base.toString()][f] = (function (m, o) {
                                return function () {
                                    return m.apply(o, arguments);
                                };
                            })(base.prototype[f], this);
                        }
                    }

                    for (var intf in cls.intfs) {

                        var impl = cls.intfs[intf][1];
                        this[cls.intfs[intf][0].toString()] = {};

                        for (var f in impl.prototype) {
                            this[cls.intfs[intf][0].toString()][f] = (function (i, o) {
                                return function () {
                                    return i.apply(o, arguments);
                                };
                            })(impl.prototype[f], this);
                        }
                    }

                    this[cls.toString()] = {};
                    for (var impl in cls.impls) {

                        for (var f in cls.impls[impl]) {
                            this[f] = this[cls.toString()][f] = (function (m, o) {
                                return function () {
                                    return m.apply(o, arguments);
                                }
                            })(cls.impls[impl][f], this);
                        }

                    }

                    this.cls = cls;
                }

                ctor.apply(this, arguments);

                //this.base = (cls.base || { ctor: function () { return this; } }).ctor.prototype.constructor.apply(this);

            }
        })(ctor);

        cls.ctor = cls;
        cls.nome = nome;
        cls.bases = [];
        cls.impls = [];
        cls.intfs = [];

        cls.Implements = function (impl) {

            var isInterface = typeof impl == 'function';

            if (isInterface) {

                return {
                    impl: impl,
                    As: function (intf) {
                        cls.intfs.push([intf, this.impl]);
                        return cls;
                    }
                };

            }
            else {
                cls.impls.push(impl);
                return cls;
            }

        };

        cls.ClassOf = function (base) {
            cls.bases.push(base);
            return cls;
        }

        cls.End = function () {

            for (var base in cls.bases)
                _ClassOf(cls, cls.bases[base]);

            //for (var intf in cls.intfs)
            //  _ImplementsInterface(cls, cls.intfs[intf][0], cls.intfs[intf][1]);


            for (var impl in cls.impls)
                _Implements(cls, cls.impls[impl]);

            //delete cls.bases;
            //delete cls.impls;
            //delete cls.intfs;

            return cls;

        }

        cls.toString = function () {
            return nome;
        }


        return cls;

    };

    _.Class = Class;
    _.Function.prototype.Class = function (nome) { return Class(this, nome); }

})(window);

function getClassName(cls) {
    
    var ctr = cls.constructor.toString();
    var ini = ctr.indexOf('function ') + 9;
    var fim = ctr.indexOf('(');
    
    return ctr.substring(ini, fim).trim();
    
}