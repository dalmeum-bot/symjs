interface IZ {
  sign: number,
  ints: number[],
  isPositive: boolean,
  isNegative: boolean
}

enum config {
  BASE = 10e10,
}

export class Z implements IZ {
  sign: number;
  ints: number[];

  constructor(input: (string | number[]), sign: number) {
    this.sign = sign / Math.abs(sign);   
    
    if (input instanceof String) {
      input = input.replace(/ |\+|-/g, ''); 

      let chucks = new Array<string>();    
      while (input.length != 0) {
        let chucklen: number = (input.length % 10 == 0) ? 10 : input.length % 10;
        chucks.push(input.slice(0, chucklen));
        input = input.slice(chucklen);
      }

      this.ints = chucks.map(Number).reverse();
    }
    else if (input instanceof Array) {
      this.ints = input;
    }
  }

  get isPositive() {
    return this.sign == 1;
  }

  get isNegative() {
    return this.sign == -1;
  }

  add: (z: Z) => Z;
  sub: (z: Z) => Z;
  mul: (z: Z) => Z;
  div: (z: Z) => Z;
}

Z.prototype.add = function(z: Z): Z {
  if (this.sign == 1 && z.sign == -1) return this.sub(z)
  
  let r = new Array<number>(Math.max(this.ints.length, z.ints.length));

  let i = 0,
      carry = 0,
      sum = 0;

  for (i = 0; i < Math.min(this.ints.length, z.ints.length); i++) {
    sum = this.ints[i] + z.ints[i] + carry;
    carry = (sum >= config.BASE) ? 1 : 0;
    r[i] = sum - carry * config.BASE;
  }

  while ()
};

Z.prototype.sub = function (z: Z): Z {

};

const z = new Z("234234234234", 1);
console.log(z);