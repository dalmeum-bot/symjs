const { add } = require("../types/F");

f = new Formula("1 + 2 * 3 - 4");
f.toPostFixNotation() // -> [1, 2, 3, mul, add, 4, sub]
f.oper = {
  'add': {
    shape: '+',
    execute: (numbers) => add(numbers)
  },
}

f.calculate() // -> 3