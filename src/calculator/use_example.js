const Direction = {
  RIGHT: 1,
  NONE: 0,
  LEFT: -1
};

class Formula {
  constructor(formula) {
    this.formula = formula.replace(/ /g, '');

    this.opers = {};
    this.funcs = {};
    this.vars = {};
    this.consts = {};
  }
}

Formula.prototype.toPreFixNotation = function() { // 전위표기식으로 변환
    
};

Formula.prototype.toPostFixNotation = function() { // 후위표기식으로 변환

};

Formula.prototype.solve = function() {
  // idea
  return {
    process: () => [],
    result: (approximate) => approximate + ""
  }
}

class FOperator {
  constructor(sign, name, prior, direction, execute) {
    this.sign = sign;
    this.name = name;
    this.prior = prior;
    this.direction = direction;
    this.execute = execute;
  }
}

class FFunction {
  constructor(name, execute) {
    this.name = name;
    this.execute = execute;
  }
}

class FVariable {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class FConstant {
  constructor(name, sign, value) {
    this.name = name;
    this.sign = sign;
    this.coeff = 0;
    this.value = value;
  }
}

Formula.prototype.defineOperator = function (sign, name, prior, direction, execute) {
  this.opers[name] = new FOperator(sign, name, prior, direction, execute);
};

Formula.prototype.defineFunction = function (name, execute) {
  this.funcs[name] = new FFunction(name, execute);
};

Formula.prototype.defineVariable = function (name, value) {
  this.vars[name] = new FVariable(name, value);
};

Formula.prototype.defineConstant = function (name, sign, value) {
  this.consts[name] = new FConstant(name, sign, value);
};

f = new Formula("1 + 2 * 3 - 4 + gcd(3, 6, 12) * pi");  // 수식 정의

f.toPostFixNotation() // 후위표기식으로 변환 (보여주기용)
[1, 2, 3, "*", "+", 4, "-", "gcd(3,6,12)", "pi", "*", "+"]

// 실제 연산 처리 // todo - 상수의 연산, 계수 처리 어케하지
[1, 2, 3, f.opers["*"], f.opers["+"], 4, f.opers["-"], [f.funcs["gcd"].execute(3, 6, 12), f.consts["pi"]], f.opers["*"], f.opers["+"]]
[1, 2, 3, f.opers["*"], f.opers["+"], 4, f.opers["-"], [3, f.consts["pi"]], f.opers["*"], f.opers["+"]]
[1, 6, f.opers["+"], 4, f.opers["-"], [3, f.consts["pi"]], f.opers["*"], f.opers["+"]]
[7, 4, f.opers["-"], [3, f.consts["pi"]], f.opers["*"], f.opers["+"]]
[3, [3, f.consts["pi"]], f.opers["*"], f.opers["+"]]
[3, "3π", f.opers["+"]]
["3 + 3π"]

f.defineOperator( // operator는 1, 2항 연산자를 기준으로 한다.
  '+', // 연산자 기호
  "add", // 연산자 이름
  5,  // 연산자 우선순위
  Direction.RIGHT,  // 연산방향
  function (n1, n2) { // 연산 정의
    return n1 + n2;
  }
);

f.defineOperator( // 1항 연산자 예시
  '!',
  "factorial",
  3,
  Direction.RIGHT,
  function (n1, n2) {
    const factorial = (n) => {
      if (n == 0) return 1;
      else return n * factorial(n - 1);
    }
    return factorial(n1);
  }
);

f.defineFunction( // function은 항 개수와 상관이 없다.
  "gcd",
  function (...args) {
    const gcd = (n) => n.length === 2 ? n[1] ? gcd(n[1], n[0] % n[1]) : n[0] : n.reduce((a, b) => gcd(a, b));
    return gcd(args);
  }
);

f.defineVariable(
  "x_0",
  13.5
);

f.defineConstant(
  "pi",
  "π",
  3.14159265358979
);

arr.forEach(e => {
  if (e instanceof Number) {

  }
  else if (e instanceof FOperator) {

  }
  else if (e instanceof FFunction) {

  }
  else if (e instanceof FVariable) {

  }
  else if (e instanceof FConstant) {
    
  }
});

f.solve().process() // 연산 과정
[
  "1+2*3-4+gcd(3,6,12)*pi",
  "1+2*3-4+3*pi",
  "1+6-4+3*pi",
  "7-4+3*pi",
  "3+3*pi"
]

f.solve().result()  // 연산 결과
"3+3*pi"

f.solve().result(true)  // 연산 결과 근사값
"12.42477796076937971..."