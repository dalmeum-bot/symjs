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
  if (Q.type != 'Rational') Q = Rationalize(Q);

  var l = lcm(this.d, Q.d);
  return Rationalize(l / this.d * this.getNumerator() + l / Q.d * Q.getNumerator(), l);
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

sigma = (k, n, func) => {
  let ret = 0;

  for (k = k; k <= n; k++) {
    ret += func(k, n);
  }

  return ret;
};

class Polynomial {
  constructor(formula, variable) {
    this.isPolynomial = true;
    this.vari = new String();  // 문자
    this.coeff = new Map(); // 계수
    this.maxDegree = new Number();  // 최고차수
    this.minDegree = new Number();  // 최저차수

    // 문자 얻기
    this.vari = variable;

    // 수식 해석
    if (typeof formula == 'string') {
      formula = formula.replace(/ /g, '');

      formula = formula
        .replace(/(?<=\+|\-|^)[a-z]/g, match => `1${match}`)  // x^2 => 1x^2
        .replace(/[a-z](?!\^)+/g, match => `${match}^1`)  // 3x => 3x^1
        .replace(/(?<!\^)(-|\+|^)\d+(?![a-z/])/g, match => `${match}${this.vari}^0`)  // 4 => 4x^0
        .replace(/(-?\d+\/-?\d+)([a-z])/g, (_, g1, g2) => `${g1}${g2}`) // 3/2x^2 => 3/2x^2
        .replace(/\/([a-z]\^)(-?\d+)/g, (_, g1, g2) => `${g1}${-Number(g2)}`)  // 3/[x^][2] => 3x^-2
        .replace(/(\d+)([a-z])/g, (_, g1, g2) => `${g1} ${g2}`) // 3x^2 => 3 x^2
        .replace(/(?<!\^)-/g, '+-');

      //console.log(formula);
    }

    // 항 얻기
    if (typeof formula == 'string') {
      var term = formula.split('+');
      if (term[0] == '') term = term.slice(1);
    }

    // 계수 얻기
    if (typeof formula == 'string') {
      term.forEach(term => {
        let match = term.match(new RegExp("((?:-?\\d+)\\/(?:-?\\d+)|(?:-?\\d+)) " + this.vari + "\\^(-?\\d+)"));  // REVIEW 분수를 계수로 인식했으므로, Rational Class로 계수를 만드는 작업 필요
        this.coeff.set(+match[2], Rationalize((this.coeff.get(+match[2]) || 0)).add(Rationalize(match[1])));
      });
    }
    else {
      this.coeff = formula;
    }

    this.coeff = new Map(Array.from(this.coeff).filter(([key, value]) => value != 0));
    
    // 차수 얻기
    this.maxDegree = Math.max(...Array.from(this.coeff.keys()));
    this.minDegree = Math.min(...Array.from(this.coeff.keys()));
  }

  toString() {
    let string = new String();

    this.coeff.forEach((coeff, power) => {
      var oper_in = coeff.getValue() >= 0 ? '+' : '-';
      var coeff_in = Math.abs(coeff.getValue()) == 1 ? power == 0 ? '1' : '' : coeff.abs().toString();
      var variAndPower_in = power == 1 ? this.vari : power == 0 ? '' : this.vari + '^' + power;

      string += ` ${oper_in} ${coeff_in} ${variAndPower_in}`;
    });
    string = string.slice(1);
    if (string.startsWith("+ ")) string = string.slice(2);

    return string;
  }
}

Polynomial.prototype.add = function(P) {
  let ret = new Polynomial('0', this.vari);

  for (let i = Math.min(this.minDegree, P.minDegree); i <= Math.max(this.maxDegree, P.maxDegree); i++) {
    if (this.coeff.get(i) == null && P.coeff.get(i) == null) continue;
    ret.coeff.set(i, (this.coeff.get(i) | 0) + (P.coeff.get(i) | 0));
  }

  return new Polynomial(ret.coeff, this.vari);
}

Polynomial.prototype.sub = function(P) {
  let ret = new Polynomial('0', this.vari);

  for (let i = Math.min(this.minDegree, P.minDegree); i <= Math.max(this.maxDegree, P.maxDegree); i++) {
    if (this.coeff.get(i) == null && P.coeff.get(i) == null) continue;
    ret.coeff.set(i, (this.coeff.get(i) | 0) - (P.coeff.get(i) | 0));
  }

  return new Polynomial(ret.coeff, this.vari);
}

Polynomial.prototype.mul = function(P) {
  let ret = new Polynomial('0', this.vari);

  for (let i = this.minDegree; i <= this.maxDegree; i++) {
    for (let j = P.minDegree; j <= P.maxDegree; j++) {
      ret.coeff.set(i + j, (ret.coeff.get(i + j) | 0) + (this.coeff.get(i) | 0) * (P.coeff.get(j) | 0));
    }
  }

  return new Polynomial(ret.coeff, this.vari);
}

Polynomial.prototype.div = function(P) {
  let ret = new Polynomial('0', this.vari);

  // TODO: 나눗셈 구현하기

  return new Polynomial(ret.coeff, this.vari);
}

Polynomial.prototype.lowByRoot = function(root) {
  let ret = new Polynomial('0', this.vari);

  ret.coeff.set(this.maxDegree - 1, this.coeff.get(this.maxDegree));
  // FIXME
  for (let i = this.maxDegree - 2; i >= this.minDegree; i--) {
    ret.coeff.set(i, (this.coeff.get(i + 1) | 0) + root * (ret.coeff.get(i + 1) | 0));
  }

  return new Polynomial(ret.coeff, this.vari);
}

Polynomial.prototype.diff = function() {
  let ret = new Polynomial('0', this.vari);

  for (let i = this.minDegree - 1; i < this.maxDegree; i++) {
    ret.coeff.set(i, (i + 1) * (this.coeff.get(i + 1) | 0));
  }

  return new Polynomial(ret.coeff, this.vari);
}

Polynomial.prototype.plugIn = function(num) {
  let ret = 0;

  this.coeff.forEach((value, index) => {
    ret += value * Math.pow(num, index);
  });

  return ret;
}

Polynomial.prototype.solve = function(x_0, margin) {
  let roots = new Array();
  let func = this;

  x_0 = (x_0 == null) ? 0 : x_0;
  margin = (margin == null) ? 0.0000000000001 : margin;

  let x = x_0;
  let x_before = null;

  while (func.maxDegree > 1) {
    for (let i = 0; i < 100; i++) {
      if (i > 15 && Math.abs(Math.round(x) - x) <= margin) {
        x = Math.round(x);
        break;
      }
      
      x_before = x;
      x = x - (func.plugIn(x) / func.diff().plugIn(x));
    }
    roots[roots.length] = x;
    func = func.lowByRoot(x);

    x = x_0;
    x_before = null;
  }
  roots[roots.length] = (-1 * func.coeff.get(0)) / func.coeff.get(1);

  return roots;
}
var g = new Polynomial("3/9x^-2 + 3x", 'x');
var f = new Polynomial("x^2-3x+4", 'x');
console.log(f.toString());