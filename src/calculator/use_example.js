const Direction = {
  RIGHT: 1,
  NONE: 0,
  LEFT: -1
};

class Formula {
  constructor(formula) {
    this.formula = formula;

    this.operators = {};
    this.functions = {};
    this.variables = {};
  }
}

Formula.prototype.defineOperator = function(operator) {

};

Formula.prototype.defineFunction = function(function) {

};

Formula.prototype.toPreFixNotation = function() { // 전위표기식으로 변환
    
};

Formula.prototype.toPostFixNotation = function() { // 후위표기식으로 변환

};

class OperatorBuilder {
  constructor() {
    this.sign = null;
    this.name = null;
    this.prior = null;
    this.direction = 1;
    this.execute = null;
  }

  setSign(sign) {
    this.sign = sign;
  }
  setName(name) {
    this.name = name;
  }
  setPrior(prior) {
    this.prior = prior;
  }
  setDirection(direction) {
    this.direction = direction;
  }
  setExcute(execute) {
    this.execute = execute;
  }
}

class FunctionBuilder {
  constructor() {
    this.name = null;
    this.execute = null;
  }

  setName(name) {
    this.name = name;
  }
  setExcute(execute) {
    this.execute = execute;
  }
}

f = new Formula("1 + 2 * 3 - 4");

f.defineOperator(new OperatorBuilder() // operator는 2항 연산자를 기준으로 한다.
  .setSign("+") // 연산자 기호
  .setName("add") // 연산자 이름
  .setPrior(5)  // 연산자 우선순위
  .setDirection(Direction.RIGHT)  // 연산방향
  .setExcute((n1, n2) => n1 + n2) // 연산 정의
);

f.defineFunction(new FunctionBuilder() // function은 항 개수와 상관이 없다.
  .setName("gcd")
  .setExcute((...args) => {
    const gcd = (n) => n.length === 2 ? n[1] ? gcd(n[1], n[0] % n[1]) : n[0] : n.reduce((a, b) => gcd(a, b));
    return gcd(args);
  })
);

f.toPostFixNotation() // -> [1, 2, 3, mul, add, 4, sub]
f.calculate() // -> 3