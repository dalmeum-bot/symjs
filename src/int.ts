class int {
  numbers: number[];
  sign: number;
  size: number;

  add!: (Z: int) => int;
  sub!: (Z: int) => int;
  mul!: (Z: int) => int;
  div!: (Z: int) => int;
  mod!: (Z: int) => int;
  pow!: (Z: int) => int;

  constructor(number: string | void) {
    number ??= '0';
    
    this.numbers = [];
    this.sign = 0;
    this.size = 0;

    number = number.replace(/,|_| /g, '');
    this.sign = !number.startsWith('-') ? 1 : -1;
    number = number.replace(/-/g, '');
    this.size = number.length;

    let n: number = 0;
    while (n < this.size) {
      this.numbers = this.numbers.concat(Number(number.slice(n, n + 14)));
      n += 14;
    }
  }

  get getNumber() {
    return `${(this.sign >= 0) ? '+' : '-'}${this.numbers.join('')}`;
  }

  get getSign() {
    return this.sign;
  }

  get getSize() {
    return this.size;
  }
}

/**
 * add two integers
 * @param {int} Z
 * @returns int
 */
int.prototype.add = function(Z: int): int {
  let up: number = 0; // 받아올림
  let ret: int = new int();

  if (this.sign == 1 && Z.sign == -1) return this.sub(Z);
  else if (this.sign == -1 && Z.sign == 1) return Z.sub(this);

  ret.sign = this.sign; 
  for (let i: number = 0; i < Math.max(this.numbers.length, Z.numbers.length); i++) {
    ret.numbers[ret.numbers.length - i - 1] = (this.numbers[this.numbers.length - i - 1] | 0) + (Z.numbers[Z.numbers.length - i - 1] | 0);

    if (String(ret.numbers[ret.numbers.length - i - 1]).length >= 15) {
      up = Number(String(ret.numbers[ret.numbers.length - i - 1])[0]);
      ret.numbers[ret.numbers.length - i - 1] = Number(String(ret.numbers[ret.numbers.length - i - 1]).slice(1));
      ret.numbers[ret.numbers.length - i] += up;  // BUG
    } 
  }

  return ret;
}

var a: int = new int("111111111111111111");
var b: int = new int("1111");
console.log(a);
console.log(b);
console.log(a.add(b));