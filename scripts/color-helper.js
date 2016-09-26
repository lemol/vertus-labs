function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

Color.prototype = {

    factorizar: function (t) {

        this.r *= t;
        this.g *= t;
        this.b *= t;

        return this;

    },

    toString: function (t) {

        t = t || 1;
        return 'rgb(' + Math.round(this.r * t) + ',' + Math.round(this.g * t) + ',' + Math.round(this.b * t) + ')';

    },

    toRgbaString: function (a) {
        return 'rgba(' + Math.round(this.r) + ',' + Math.round(this.g) + ',' + Math.round(this.b) + ',' + a + ')';
    }

}

Color.fromLambda = function (lambda) {

    var gamma = 0.80,
        intesidadMax = 255,
        blue, green, red, factor;

    lambda = Math.ceil(lambda);

    var adjust = function (color, factor) {
        if (color === 0.0) {
            return 0;     // Don't want 0^x = 1 for x <> 0
        }
        else {
            return Math.round(intesidadMax * Math.pow(color * factor, gamma))
        }
    }

    if (lambda >= 380 && lambda <= 439) {
        red = -(lambda - 440) / (440 - 380);
        green = 0.0;
        blue = 1.0;
    }
    else if (lambda >= 440 && lambda <= 489) {
        red = 0.0;
        green = (lambda - 440) / (490 - 440);
        blue = 1.0;
    }
    else if (lambda >= 490 && lambda <= 509) {
        red = 0.0;
        green = 1.0;
        blue = -(lambda - 510) / (510 - 490);
    }
    else if (lambda >= 510 && lambda <= 579) {
        red = (lambda - 510) / (580 - 510);
        green = 1.0;
        blue = 0.0;
    }
    else if (lambda >= 580 && lambda <= 644) {
        red = 1.0;
        green = -(lambda - 645) / (645 - 580);
        blue = 0.0;
    }
    else if (lambda >= 645 && lambda <= 780) {
        red = 1.0;
        green = 0.0;
        blue = 0.0;
    }
    else {
        red = 0.0;
        green = 0.0;
        blue = 0.0;
    }

    if (lambda >= 380 && lambda <= 419) {
        factor = 0.3 + 0.7 * (lambda - 380) / (420 - 380);
    }
    else if (lambda >= 420 && lambda <= 700) {
        factor = 1.0;
    }
    else if (lambda >= 701 && lambda <= 780) {
        factor = 0.3 + 0.7 * (780 - lambda) / (780 - 700);
    }
    else {
        factor = 0.0;
    }

    return new Color(adjust(red, factor), adjust(green, factor), adjust(blue, factor));

}