var {type, isNone, isSimilNum, isFraction} = require("../util/type");
var Fraction = require("./Fraction");
var Root = require("./Root");

Complex = function (r, i) {
  this.r = (!isFraction(r)) ? new Fraction(r) : r;
  this.i = (!isFraction(i)) ? new Fraction(i) : i;

  if (i.value() == 0) return new Fraction(r);
};

Complex.prototype = {
  type : "Complex",
  isComplex : true,

  add : function (comp, p2) {
    if (isSimilNum(comp) || isSimilNum(p2)) comp = new Complex(comp, p2);
    var r = this.r.add(comp.r);
    var i = this.i.add(comp.i);
    return new Complex(r, i);
  },
  sub : function (comp, p2) {
    if (isSimilNum(comp) || isSimilNum(p2)) comp = new Complex(comp, p2);
    var r = this.r.sub(comp.r);
    var i = this.i.sub(comp.i);
    return new Complex(r, i);
  },
  mul : function (comp, p2) {
    if (isSimilNum(comp) || isSimilNum(p2)) comp = new Complex(comp, p2);
    var r = (this.r.mul(comp.r)).sub(this.i.mul(comp.i));
    var i = (this.r.mul(comp.i)).add(this.i.mul(comp.r));
    // (a + bi) * (c + di) = (ac - bd) + (ad + bc)i
    return new Complex(r, i);
  },
  div : function (comp, p2) {
    if (isSimilNum(comp) || isSimilNum(p2)) comp = new Complex(comp, p2);
    var r = this.r.mul(comp.r).add(this.i.mul(comp.i)).div(comp.r.mul(comp.r).add(comp.i.mul(comp.i)));
    var i = this.i.mul(comp.r).sub(this.r.mul(comp.i)).div(comp.r.mul(comp.r).add(comp.i.mul(comp.i)));
    // (a + bi) / (c + di) = ((ac + bd) / (cc + dd)) + ((bc - ad) / (cc + dd))i
    return new Complex(r, i);
  },
  print : function () {
    var r = this.r.print();
    var i = this.i.print();
    var oper = (this.i.s === 1) ? "+" : "-";

    if (this.r.value() === 0) return oper.replace('+', '') + i.replace('-', '') + " 𝑖";
    else return r + " " + oper + " " + i.replace('-', '') + " 𝑖";
  }
};

module.exports = Complex;