interface IZ {
  /* 부호 */
  sign: number,

  /* 자릿수 배열 */
  _: number[],

  /* 출력 */
  toString(): string,

  /* 양수 유무 */
  isPositive(): boolean,

  /* 음수 유무 */
  isNegative(): boolean,

  /* 부호 바꾸기 */
  negate(): Z,

  /* 덧셈 */
  add(z: Z): Z,

  /* 뺄셈 */
  sub(z: Z): Z,

  /* 곱셈 */
  mul(z: Z): Z,

  /* 나눗셈 */
  div(z: Z): Z,

  /* 나머지 */
  mod(z: Z): Z,

  /* 거듭제곱 */
  pow(z: Z): Z,
}

const BASE_DIGIT = 7;
const SEPARATOR = ' ';
var BASE = Math.pow(10, BASE_DIGIT);

// TODO base N 구현 (base -N 도 가능해야함)
// TODO sign 자동 추론 (속도 보고 결정해)
export class Z implements IZ {
  sign: number;
  _: number[];
  base: number;

  constructor(number: (string | number | number[]), sign?: number, base?: number) {
    this.sign = (sign == null) ? 1 : sign / Math.abs(sign);
    this.base = (base == null) ? 10 : base; 

    BASE = Math.pow(base, BASE_DIGIT);
        
    if (number instanceof String || number instanceof Number) {
      if (!Number.isInteger(Number(number))) throw new Error('Z 에는 정수만 가능');

      if (number instanceof Number) number = String(number);
      number = number.replace(/ |\+|-/g, ''); 

      let chucks = new Array<string>();    
      while (number.length != 0) {
        let chucklen: number = (number.length % BASE_DIGIT == 0) ? BASE_DIGIT : number.length % BASE_DIGIT;
        chucks.push(number.slice(0, chucklen));
        number = number.slice(chucklen);
      }

      this._ = chucks.map(Number).reverse();
    }
    else if (number instanceof Array) {
      this._ = number;
    }
  }

  toString (): string {
    let r = '';
    this._.forEach(e => r = e + r);
    return r.replace(/\B(?=(\d{3})+(?!\d))/g, SEPARATOR);
  }

  isPositive (): boolean {
    return this.sign == 1;
  }

  isNegative (): boolean {
    return this.sign == -1;
  }

  negate (): Z {
    return new Z(this._, -this.sign);
  }

  add (z: Z): Z {
    if (this.isPositive() && z.isNegative()) return this.sub(z);
    if (this.isNegative() && z.isPositive()) return z.sub(this);
    
    let a, b;
    if (this._.length < z._.length) [a, b] = [z._, this._];
    else [a, b] = [this._, z._];
  
    let r = new Array<number>(a.length);
  
    let i = 0,
        carry = 0,
        sum = 0;
  
    for (i = 0; i < b.length; i++) {
      sum = a[i] + b[i] + carry;
      carry = (sum >= BASE) ? 1 : 0;
      r[i] = sum - carry * BASE;
    }
  
    while (i < a.length) {
      sum = a[i] + carry;
      carry = (sum == BASE) ? 1 : 0;
      r[i] = sum - carry * BASE;
      i++;
    }
  
    if (carry > 0) r.push(carry);
  
    return new Z(r, this.sign);
  }
  
  sub (z: Z): Z {
    if (this.isPositive() && z.isNegative()) return this.add(z);
    if (this.isNegative() && z.isPositive()) return z.add(this);

    let a, b;

    return new Z(0);
  }

  mul (z: Z): Z {
    return new Z(1, +1);
  }
  
  div (z: Z): Z {
    return new Z(1, +1);
  }

  mod (z: Z): Z {
    return new Z(1, +1);
  }

  pow (n: Z): Z {
    if (n.sign < 0) return new Z(0);
    
    return new Z(0);
  }
}

const z1 = new Z(232);
const z2 = new Z(339);
console.log(`z1 = ${z1.toString()}\nz2 = ${z2.toString()}\nz1 + z2 = ${z1.add(z2).toString()}`);