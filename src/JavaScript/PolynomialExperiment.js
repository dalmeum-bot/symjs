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
    }

    // 항 얻기
    if (typeof formula == 'string') {
      var term = formula.split('+');
      if (term[0] == '') term = term.slice(1);
    }

    // 계수 얻기
    if (typeof formula == 'string') {
      term.forEach(term => {
        console.log(term);
        let match = term.match(new RegExp("((?:-?\\d+)\\/(?:-?\\d+)|(?:-?\\d+)) " + this.vari + "\\^(-?\\d+)"));  // REVIEW 분수를 계수로 인식했으므로, Rational Class로 계수를 만드는 작업 필요
        this.coeff.set(+match[2], Rationalize(this.coeff.get(+match[2]) || 0).add(Rationalize(+match[1])));
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
      var oper_in = coeff >= 0 ? '+' : '-';
      var coeff_in = Math.abs(coeff) == 1 ? power == 0 ? '1' : '' : Math.abs(coeff);
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
var g = new Polynomial("3/4x^2 + 3x", 'x');
console.log(g);
console.log(g.toString());