// LONGITUD
function pixelToMm(pixels) {
    return 25.4 * pixels / dpi;
}
function mmToPixel(mm) {
    return mm * dpi / 25.4;
}

function pixelToNm(pixel) {
    return pixelToMm(pixel) * 1e12;
}
function nmToPixel(nm){
    return mmToPixel(nm * 1e-12);
}

function pixelToMicro(pixel){
    return pixelToMm(pixel) * 1e9;
}
function microToPixel(micro){
    return mmToPixel(micro * 1e-9);
}

// ANGULOS
function radianoToGrado90(radiano) {
    return radiano * 180 / Math.PI;
}
function grado90ToRadiano(grado90) {
    return grado90 * Math.PI / 180;
}