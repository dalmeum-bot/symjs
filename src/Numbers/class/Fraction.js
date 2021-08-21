var {type, isNone, isSimilNum} = require("../util/type");

Fraction = function () {
  if (value.type === "Fraction") return value;
  
  var value = toFraction.apply(null, Array.from(arguments));
  this.s = value[0]; // sign
  this.n = value[1]; // numerator
  this.d = value[2]; // denominator
  return this;
};

toFraction = function (n, d) {
  var sign = 1;
  var numerator = 0;
  var denominator = 1;

  // toFraction()
  if (arguments.length === 0) {
    // 기본 설정값 그대로
  }

  // toFraction(3.5)
  // toFraction("14.7(2)")
  // toFraction({n: 8, d: 3})
  if (arguments.length === 1) {
    switch (type(n)) {
      case "Object":
        numerator = ("n" in n) ? n.n : numerator;
        denominator = ("d" in n) ? n.d : denominator;
        break;
      case "Array":
        numerator = !isNone(n[0]) ? n[0] : numerator;
        denominator = !isNone(n[1]) ? n[1] : denominator;
        break;
      case "String":
      case "Number":
        n = String(n);

        if (n.includes(':') || n.includes('/')) {
          var args = n.split(/\:|\//g);
          if (args.length <= 2) {
            toFraction(args[0], args[1]);
          } else {
            throw new Error("인자가 2개 초과 입니다.");
          }
        }
        else {
          var front = n.split('.');
          var cycleSeparator = ['[', ']'];
          var cycle = n.match(new RegExp('\\'+ cycleSeparator[0] + '(.*?)\\' + cycleSeparator[1], 'g'));

          if (isNone(cycle)) cycle = ['0'];

          if (front.length === 1) {
            numerator = Number(front[0]);
            break;
          } else if (front.length === 2) {
            if (cycle.length > 1) {
              throw new Error("순환마디가 1개 초과 입니다.");
            } cycle = cycle[0];

            front[1] = front[1].replace(cycle, '');
            cycle = cycle.replace(new RegExp('\\' + cycleSeparator[0] + '|\\' + cycleSeparator[1], 'g'), '');

            if (cycle.replace(/\d+/g, '').length > 0) throw new Error("순환마디 내용이 잘못되었습니다.");
            
            numerator = Number(front[0] + front[1] + cycle) - Number(front[0] + front[1]);
            denominator = Math.pow(10, front[1].length) * (Math.pow(10, cycle.length) - 1);
            break;
          } else {
            throw new Error("소수점이 1개 초과 입니다.");
          }
        }
      default:
        throw new Error("인자 자료형이 잘못되었습니다.");
    }
  }

  // toFraction(3, 11)
  // toFraction("4.7", 11.3)
  if (arguments.length === 2) {
    var p1_arr = toFraction(n);
    var p2_arr = toFraction(d);

    numerator = p1_arr[1] * p2_arr[2];
    denominator = p1_arr[2] * p2_arr[1];
    numerator *= p1_arr[0] * p2_arr[0];
  }

  if (denominator == 0) throw new Error("0으로 나눌 수 없습니다.");

  // reduce code
  g = gc(numerator, denominator);
  numerator /= g; denominator /= g;

  if (numerator * denominator === 0) sign = 1;
  else sign = (numerator * denominator) / Math.abs(numerator * denominator);
  numerator = Math.abs(numerator);
  denominator = Math.abs(denominator);

  return [sign, numerator, denominator];
};

Fraction.prototype = {
  type : "Fraction",
  isFraction : true,

  add : function (F) {
    if (isSimilNum(F)) F = new Fraction(F);
    var n = this.s * this.n * (lc(this.d, F.d) / this.d) + F.s * F.n * (lc(this.d, F.d) / F.d);
    var d = lc(this.d, F.d);
    return new Fraction(n, d).reduce();
  },
  sub : function (F) {
    if (isSimilNum(F)) F = new Fraction(F);
    return this.add(new Fraction(-F.s * F.n, F.d)).reduce();
  },
  mul : function (F) {
    if (isSimilNum(F)) F = new Fraction(F);
    var n = this.s * F.s * this.n * F.n;
    var d = this.d * F.d;
    return new Fraction(n, d).reduce();
  },
  div : function (F) {
    if (isSimilNum(F)) F = new Fraction(F);
    return this.mul(F.inverse()).reduce();
  },
  mod : function (F) {
    if (isSimilNum(F)) F = new Fraction(F);
    var l = single_lcm(this.d, F.d).value();
    return new Fraction((this.n * (l / this.d)) % (F.n * (l / F.d)), l).reduce();
  },
  pow : function (F) {
    if (isSimilNum(F)) F = new Fraction(F);
    var p = Math.trunc(F.value);
    var n = Math.pow(this.n, p);
    var d = Math.pow(this.d, p);
    return new Fraction(n, d).reduce();
  },
  reduce : function () {
    var g = single_gcd(this.n, this.d).value();
    return new Fraction(this.s * this.n / g, this.d / g);
  },
  inverse : function () {
    return new Fraction(this.s * this.d, this.n).reduce();
  },
  value : function () {
    return Number(this.s * this.n / this.d);
  },
  print : function () {
    return this.s * this.n + ((this.d !== 1) ? ("/" + this.d) : (""));
  },
  equals : function (F) {
    if (isSimilNum(F)) F = new Fraction(F);
    return ((this.s === F.s) && (this.n === F.n) && (this.d === F.d));
  },
  big : function (F) {
    if (isSimilNum(F)) F = new Fraction(F);
    var a = this.s * this.n * (single_lcm(this.d, F.d).value() / this.d);
    var b = F.s * F.n * (single_lcm(this.d, F.d).value() / F.d);

    return (a > b);
  },
  small : function (F) {
    if (isSimilNum(F)) F = new Fraction(F);
    var a = this.s * this.n * (single_lcm(this.d, F.d).value() / this.d);
    var b = F.s * F.n * (single_lcm(this.d, F.d).value() / F.d);

    return (a < b);
  }
};

//module.exports = Fraction;
a = new Fraction('3.52[4]');
console.log(a)