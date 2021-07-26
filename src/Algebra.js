class Polynomial {
  type = "Polynomial";
  isPolynomial = true;

  constructor(formula, variable) {
    this.vari = variable; // 문자
    this.fm = formula; // 표현식
    this.maxDegree; // 최고차수
    this.term = []; // 항
    this.coeff = []; // 계수
    
    // 항 분리
    formula = formula.replace(/ /g, '').replace(/-/g, '+-');
    this.term = formula.split('+');

    // 생략표현 복구
    this.term = this.term.map((val, idx) => {
      var ret = val;

      // 계수에 1 생략된 파트
      if (val[0] == this.vari) {
        ret = '1' + ret;
      }
      // 계수에 -1 생략된 파트
      else if (val[0] == '-' && val[1] == this.vari) {
        ret = '-1' + ret.substring(1);
      }

      if (!val.includes('^')) {
        // 지수에 1 생략된 파트
        if (val.includes(this.vari)) {
          ret += '^1';
        }
        // 지수에 0 생략된 파트
        else {
          ret += this.vari + '^0';
        }
      }
      return ret;
    });

    // 계수 구하기
    formula = this.term.join('+');
    formula = (formula[0] == '+') ? formula.slice(1) : formula;
    var ns = formula.match(/[-]?\d+/g).map(Number);
    for (let i = 0; i < ns.length; i++) {
      if (i % 2 === 1) {
        if (this.coeff[ns[i]] == null) this.coeff[ns[i]] = 0;
        this.coeff[ns[i]] += ns[i - 1];
      }
    }

    // 존재하지 않는 차수의 계수는 0
    this.coeff.map(value => value | 0);

    // 최고차수 구하기
    for (let i = this.coeff.length - 1; i >= 0; i--) {
      if (this.coeff[i] != 0) {
        this.maxDegree = i;
        break;
      }
    }
  }

  get toString() {
    return this.simplify().fm;
  }

  solve(n) {

  }

  expand() {

  }

  collect() {

  }
};

// 동류항 정리
Polynomial.prototype.simplify = function() {
  let eq = "";
  for (let i = this.coeff.length - 1; i >= 0; i--) {
    if (this.coeff[i] == undefined || this.coeff[i] == 0) continue;
    eq += this.coeff[i] + this.vari + '^' + i + '+';
  } eq = eq.slice(0, -1);
  eq = eq.replace(/\+-/g, '-')
    .replace(new RegExp(this.vari+'\\^0', 'g'), '')
    .replace(/\^1/g, '')
    .replace(new RegExp('1' + this.vari, 'g'), this.vari);
    
  return new Polynomial(eq, this.vari);
};

/* 다항식 덧셈
   @param {Polynomial} P
*/
Polynomial.prototype.add = function(P) {
  if (P.isPolynomial != true) P = new Polynomial(P, this.vari);
  let ret = new Polynomial(this.fm, this.vari);

  for (let i = 0; i < Math.max(this.coeff.length, P.coeff.length); i++) {
    ret.coeff[i] = (this.coeff[i] | 0) + (P.coeff[i] | 0);
  }

  return ret;
}

/* 다항식 뺄셈
   @param {Polynomial} P
*/
Polynomial.prototype.sub = function(P) {
  if (P.isPolynomial != true) P = new Polynomial(P, this.vari);
  let ret = new Polynomial(this.fm, this.vari);

  for (let i = 0; i < Math.max(this.coeff.length, P.coeff.length); i++) {
    ret.coeff[i] = (this.coeff[i] | 0) - (P.coeff[i] | 0);
  }

  return new Polynomial(ret.toString, this.vari);
}

/* 다항식 곱셈
   @param {Polynomial} P
*/
Polynomial.prototype.mul = function(P) {
  if (P.isPolynomial != true) P = new Polynomial(P, this.vari);
  let ret = new Polynomial(this.fm, this.vari);

  for (let i = 0; i < this.coeff.length; i++) {
    for (let j = 0; j < P.coeff.length; j++) {
      ret.coeff[i + j] = (ret.coeff[i + j] | 0) + ((this.coeff[i] | 0) * (P.coeff[j] | 0));
    }
  }

  return ret.simplify();
}

//--------------------------------------------------------------------------------------------------

var p_a = new Polynomial("x^2-1", 'x');
var p_b = new Polynomial("x^2+1", 'x');

console.log("동류항 정리 ----");
console.log(`x^2-1 = ${p_a.toString}`);
console.log(`x^2+1 = ${p_b.toString}`);

console.log("다항식 연산 ----");
console.log(`(${p_a.toString}) + (${p_b.toString}) = (${p_a.add(p_b).toString})`);
console.log(`(${p_a.toString}) - (${p_b.toString}) = (${p_a.sub(p_b).toString})`);
console.log(`(${p_a.toString}) * (${p_b.toString}) = (${p_a.mul(p_b).toString})`);