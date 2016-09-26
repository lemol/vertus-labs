var dpi = 96;

function redondear(numero, exactitud){
    
    var potencia = Math.pow( 10, exactitud || 2);
    
    return Math.round(numero * potencia) / potencia;
    
}

function floatAleatorio(min, max) {
    return min + Math.random() * (max - min + 1);
}

function intAleatorio(min, max) {
    return Math.round(floatAleatorio(min, max));
}

/* Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
*/
// Array Remove - By John Resig (MIT Licensed)
Array.remove = function (array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

function isInt(number){

    return number == Math.ceil(number);

}

function Invalido(msg, callback) {
    return { msg: msg, callback: callback, isValido: false };
}

function Valido(callback) {
    return { callback: callback, isValido: true };
}

function showError(msg) {
    alert(msg);
}