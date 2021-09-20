interface IZ {
  /* 부호 */
  sign: number,

  /* 자릿수 배열 */
  ints: number[],

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

enum consts {
  BASE = 1e7,
  BASE_DIGIT = 7,
  SEPARATOR = ''
}

export class Z implements IZ {
  sign: number;
  ints: number[];

  constructor(input: (string | number[]), sign: number) {
    this.sign = sign / Math.abs(sign);   
    
    if (typeof input == 'string') {
      input = input.replace(/ |\+|-/g, ''); 

      let chucks = new Array<string>();    
      while (input.length != 0) {
        let chucklen: number = (input.length % consts.BASE_DIGIT == 0) ? consts.BASE_DIGIT : input.length % consts.BASE_DIGIT;
        chucks.push(input.slice(0, chucklen));
        input = input.slice(chucklen);
      }

      this.ints = chucks.map(Number).reverse();
    }
    else if (typeof input == 'object') {
      this.ints = input;
    }
  }

  toString (): string {
    let r = '';
    this.ints.forEach(e => r = e + r);
    return r.replace(/\B(?=(\d{3})+(?!\d))/g, consts.SEPARATOR);
  }

  isPositive (): boolean {
    return this.sign == 1;
  }

  isNegative (): boolean {
    return this.sign == -1;
  }

  negate (): Z {
    return new Z(this.ints, -this.sign);
  }

  add (z: Z): Z {
    if (this.isPositive() && z.isNegative()) return this.sub(z);
    if (this.isNegative() && z.isPositive()) return z.sub(this);
    
    let a, b;
    if (this.ints.length < z.ints.length) [a, b] = [z.ints, this.ints];
    else [a, b] = [this.ints, z.ints];
  
    let r = new Array<number>(a.length);
  
    let i = 0,
        carry = 0,
        sum = 0;
  
    for (i = 0; i < b.length; i++) {
      sum = a[i] + b[i] + carry;
      carry = (sum >= consts.BASE) ? 1 : 0;
      r[i] = sum - carry * consts.BASE;
    }
  
    while (i < a.length) {
      sum = a[i] + carry;
      carry = (sum == consts.BASE) ? 1 : 0;
      r[i] = sum - carry * consts.BASE;
      i++;
    }
  
    if (carry > 0) r.push(carry);
  
    return new Z(r, this.sign);
  }
  
  sub (z: Z): Z {

  }

  mul (z: Z): Z {

  }
  
  div (z: Z): Z {

  }

  mod (z: Z): Z {

  }

  pow (z: Z): Z {

  }
}

const z1 = new Z("232", 1);
const z2 = new Z("339", 1);
console.log(`z1 = ${z1.toString()}\nz2 = ${z2.toString()}\nz1 + z2 = ${z1.add(z2).toString()}`);