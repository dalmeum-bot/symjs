gcd = (a, b) => !b ? a : gcd(b, a % b);
lcm = (a, b) => a * b / gcd(a, b);

class Rational {
  constructor(sign, numerator, denominator) {
    this.type = 'Rational';

    this.s = sign;
    this.n = numerator;
    this.d = denominator;
  }
}

Rational.prototype.getNumerator = function() {
  return this.s * this.n;
}

Rational.prototype.getDenominator = function() {
  return this.d;
}

Rational.prototype.getValue = function() {
  return this.s * this.n / this.d; 
}

Rational.prototype.reduce = function() {
  var g = gcd(this.n, this.d);
  return new Rational(this.s, this.n / g, this.d / g);
}

Rational.prototype.toString = function() {
  return `${this.s == -1 ? '- ' : ''}${this.n}${this.d == 1 ? '' : '/' + this.d}`;
}

Rational.prototype.add = function(Q) {
  if (!(Q instanceof Rational)) Q = Rationalize(Q);

  var l = lcm(this.d, Q.d);
  return Rationalize(l / this.d * this.getNumerator() + l / Q.d * Q.getNumerator(), l);
}

Rational.prototype.sub = function(Q) {
  if (!(Q instanceof Rational)) Q = Rationalize(Q);

  Q.s *= -1;
  return this.add(Q);
}

Rational.prototype.mul = function(Q) {
  if (!(Q instanceof Rational)) Q = Rationalize(Q);

  return Rationalize(this.getNumerator() * Q.getNumerator(), this.getDenominator() * Q.getDenominator());
}

Rational.prototype.div = function(Q) {
  if (!(Q instanceof Rational)) Q = Rationalize(Q);

  Q = new Rational(Q.s, Q.d, Q.n);
  return this.mul(Q);
}

Rational.prototype.abs = function() {
  return new Rational(1, this.n, this.d);
}

Rational.ZERO = new Rational(1, 0, 1);
Rational.ONE = new Rational(1, 1, 1);

Rationalize = (...args) => {
  switch (args.length) {
    case 0: return Rational.ZERO;
    case 1: {
      if (args[0].type == 'Rational') return args[0];
      else if (String(args[0]).includes('/')) {
        var a = String(args[0]).split('/');
        return new Rational((+a[0] * +a[1]) >= 0 ? 1 : -1, Math.abs(+a[0]), Math.abs(+a[1])).reduce();
      }

      const symbol = { open: "'", close: "'" };
      var matched = String(args[0]).match(new RegExp("([+-]?)(\\d+)(?:\\.(\\d+)?(?:\\"+symbol.open+"(\\d+)\\"+symbol.close+")?)?")).slice(1).map(e => e || '');

      return new Rational(
        (matched[0] == '' || matched[0] == '+') ? 1 : -1,
        Number(matched[1] + matched[2] + (matched[3] || '0')) - Number(matched[1] + matched[2]),
        Math.pow(10, matched[2].length) * (Math.pow(10, (matched[3] || '0').length) - 1)
      ).reduce();
    }
    case 2: return new Rational((+args[0] * +args[1]) >= 0 ? 1 : -1, Math.abs(+args[0]), +args[1]).reduce();
    default: throw new SyntaxError(`length of args : ${args.length} > 2`);
  }
};

a = Rationalize('2');
b = Rationalize('3.5');
c = Rationalize('-4.7');