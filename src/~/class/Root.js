var {type, isNone, isSimilNum} = require("../util/type");
var {lc} = require("../util/functions");

Root = function () {
  var value = toIrrational.apply(null, Array.from(arguments));
  this.s = value[0]; // sign
  this.f = value[1]; // factor
  this.n = value[2]; // nth root
  this.v = value[3]; // value
  this.isImagine = value[4]; // isImagine
};

toIrrational = function (s, f, n, v, is) {
  var sign = 1;
  var factor = 1;
  var nth = 1;
  var value = 1;
  var isImagine = false;

  //toIrrational()
  if (arguments.length === 0) {
    // 그대로
  }

  //toIrrational("3*2제곱근(5)") -> 2제곱근5
  //toIrrational(Math.pow(3, 1/5)) ...
  if (arguments.length === 1) {
    switch (type(s)) {
      case "String": {
        var matched = s.match(/[-]?\d+/g);
        factor = +matched[0];
        nth = +matched[1];
        value = +matched[2];
        toIrrational(factor, nth, value);
      }
      case "Number": {
        // ?
      }
    }
  }

  //toIrrational(3, '5') -> 3제곱근5
  if (arguments.length === 2) {
    nth = s;
    value = f;
    toIrrational(1, nth, value);
  }

  //toIrrational(1, '4', 2) -> 1*4제곱근2
  if (arguments.length === 3) {
    sign = (+s >= 0) ? 1 : -1;
    factor = Math.abs(+s);
    nth = +f;
    value = +n;
    isImagine = value < 0 && nth % 2 === 0;
    value = isImagine ? Math.abs(value) : value;
  }

  if (arguments.length === 4) {
    sign = +s;
    factor = Math.abs(+f);
    nth = +n;
    value = +v;
    isImagine = value < 0 && nth % 2 === 0;
    value = isImagine ? Math.abs(value) : value;
  }

  return [sign, factor, nth, value, isImagine];
};

Root.prototype = {
  type: "Root",
  isRoot: true,
  
  add : function (R) {
    T = this.case();
    R = R.case();

    if (T.v === R.v) {
      return new Root(T.s * T.f + R.s * R.f, T.n, T.v);
    } else {
      return this;
    }
  },

  sub : function (R) {
    R.s *= -1;
    return this.add(R);
  },

  mul : function (R) {
    T = this.case();
    R = R.case();

    return new Root(T.s * R.s, T.f * R.f, lc(T.n, R.n), Math.pow(T.v, lc(T.n, R.n) / T.n) * Math.pow(R.v, lc(T.n, R.n) / R.n)).case();
  },

  value : function () {
    return this.s * this.f * Math.pow(this.v, 1 / this.n) + (this.isImagine) ? "𝑖" : "";
  },

  print : function () {
    return String(this.s * this.f) + " * ^" + this.n + "√(" + this.v + ")";
  },

  case : function () {
    var close = Math.floor(Math.pow(this.v, 1 / this.n));
    var v = 0, f = 1;
    for (let i = close; i >= 1; i--) {
      if (this.v % Math.pow(i, this.n) === 0) {
        f = i;
        v = this.v / Math.pow(i, this.n);
        break;
      }
    }
    return new Root(this.s, this.f * f, this.n, v);
  }
};

module.exports = Root;