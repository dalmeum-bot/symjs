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
    this.term = new Array();  // 항
    this.coeff = new Map(); // 계수
    this.degree = new Number();  // 차수

    // 문자 얻기
    this.vari = variable;

    // 수식 해석
    formula = formula.replace(/ /g, '');

    formula = formula
      .replace(/(?<=\+|\-|^)[a-z]+/g, match => `1${match}`)
      .replace(/[a-z](?!\^)+/g, match => `${match}^1`)
      .replace(/(?<!\^)(-|\+|^)\d+(?![a-z]+)/g, match => `${match}${this.vari}^0`);
    
    formula = formula.replace(/(?<!\^)-/g, '+-');
    /*
      x^-2 - x - 2 => 1x^-2 + -1x + -2 (공백은 제거)
      계수 1 생략, 지수 1 생략, 문자 + 지수 0 생략
    */

    // if (!formula.startsWith('+')) formula = '+' + formula + '+';
    // formula = formula
    //   .replace(/[a-zA-Z](?!\^-?\d+)/g, (match) => match + "^1")
    //   .replace(/(?<=\+)-?\d+(?=\+)/g, (match) => match + this.vari + "^0")
    //   .replace(/(?<!-?\d+?)[a-zA-Z]/g, (match) => '1' + match);
    // if (formula.startsWith('+')) formula = formula.slice(1);
    // if (formula.endsWith('+')) formula = formula.slice(0, formula.length - 1);

    // 항 얻기
    this.term = formula.split('+');
    if (this.term[0] == '') this.term = this.term.slice(1);

    // 계수 얻기
    try {
      this.term.forEach((element) => {
        let match = element.match(new RegExp("(-?\\d+)" + this.vari + "\\^(-?\\d+)"));
        this.coeff.set(Number(match[2]), (this.coeff.get(Number(match[2])) | 0) + Number(match[1]));
      });
    } catch(e) {
      console.log(e + '\n' + e.lineNumber);
    }
    
    // 차수 얻기
    this.degree = this.coeff.size - 1;
  }

  toString() {
    let string = new String();

    for (let i = this.coeff.size - 1; i >= 0; i--) {
      if (this.coeff.get(i) == 0) continue;
      string = string.concat(`${(this.coeff.get(i) >= 0) ? ' + ' : ' - '}${Math.abs(this.coeff.get(i))}${this.vari}^${i}`);
    }
    string = string.trim();
    string = string.replace(new RegExp("(\\" + this.vari + "\\^0)|(\\^1(?!\\d+))", 'g'), '');
    string = string.replace(new RegExp("(?<!\\d+)1(?=" + this.vari + ")", 'g'), '');
    if (string.startsWith('+ ')) string = string.slice(2);

    return string;
  }
}
// TODO: this.vari에 해당하지 않는 문자는 상수로 취급해 계수에 반영

/* 다항식 덧셈
   @param {Polynomial} P
*/
Polynomial.prototype.add = function(P) {
  let ret = new Polynomial('0', this.vari);

  for (let i = 0; i < Math.max(this.coeff.size, P.coeff.size); i++) {
    ret.coeff.set(i, this.coeff.get(i) + P.coeff.get(i));
  }

  return new Polynomial(ret.toString(), this.vari);
}

/* 다항식 뺄셈
   @param {Polynomial} P
*/
Polynomial.prototype.sub = function(P) {
  let ret = new Polynomial('0', this.vari);

  for (let i = 0; i < Math.max(this.coeff.size, P.coeff.size); i++) {
    ret.coeff.set(i, this.coeff.get(i) - P.coeff.get(i));
  }

  return new Polynomial(ret.toString(), this.vari);
}

/* 다항식 곱셈
   @param {Polynomial} P
*/
Polynomial.prototype.mul = function(P) {
  let ret = new Polynomial('0', this.vari);

  for (let i = 0; i < this.coeff.size; i++) {
    for (let j = 0; j < P.coeff.size; j++) {
      ret.coeff.set(i + j, (ret.coeff.get(i + j) | 0) + this.coeff.get(i) * P.coeff.get(j));
    }
  }

  return new Polynomial(ret.toString(), this.vari);
}

/* 다항식 나눗셈
   @param {Polynomial} P
*/
Polynomial.prototype.div = function(P) {
  let ret = new Polynomial('0', this.vari);

  // TODO: 나눗셈 구현하기

  return new Polynomial(ret.toString(), this.vari);
}

/* 다항식 근으로 나누기
   @param {Number} root : 근
*/
Polynomial.prototype.lowByRoot = function(root) {
  let ret = new Polynomial('0', this.vari);

  ret.coeff.set(this.coeff.size - 2, this.coeff.get(this.coeff.size - 1));
  for (let i = this.coeff.size - 3; i >= 0; i--) {
    ret.coeff.set(i, this.coeff.get(i + 1) + root * ret.coeff.get(i + 1));
  }

  return new Polynomial(ret.toString(), this.vari);
}

/* 다항식 미분하기
*/
Polynomial.prototype.diff = function() {
  let ret = new Polynomial('0', this.vari);

  for (let i = 0; i < this.coeff.size - 1; i++) {
    ret.coeff.set(i, (i + 1) * (this.coeff.get(i + 1) | 0));
  }

  return new Polynomial(ret.toString(), this.vari);
}

/* 다항식 대입
   @param {Number} num : 대입할 수
*/
Polynomial.prototype.plugIn = function(num) {
  let ret = 0;

  this.coeff.forEach((value, index) => {
    ret += value * Math.pow(num, index);
  });

  return ret;
}

/* 다항식 근 구하기
  @param {Number} x0 : 초깃값
  @param {Number} margin : 허용오차범위
*/
Polynomial.prototype.solve = function(x_0, margin) {
  let roots = new Array();
  let func = this;

  x_0 = (x_0 == null) ? 0 : x_0;
  margin = (margin == null) ? 0.0000000000001 : margin;

  let x = x_0;
  let x_before = null;

  while (func.degree > 1) {
    for (let i = 0; i < 100; i++) {
      if (i > 15 && Math.abs(Math.round(x) - x) <= margin) {
        x = Math.round(x);
        break;
      }
      
      /*if (Math.abs(x - x_before) <= tole) {
        console.log(`find root before: ${x}`); //FIXME
        break;
      }*/
      
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

var f = new Polynomial("-3+x^-2-x-2", 'x');
console.log(f);