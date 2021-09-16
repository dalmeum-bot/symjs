interface IQ {
  numerator: number,
  denominator: number,
  sign: number
}

const basic_gcd = (a: number, b: number): number => (!b) ? a : basic_gcd(b, a % b);
const basic_lcm = (a: number, b: number): number => a * b / basic_gcd(a, b);
const toMonospace = (s: string): string => s
  .replace(/0/g, '𝟶')
  .replace(/1/g, '𝟷')
  .replace(/2/g, '2')
  .replace(/3/g, '3')
  .replace(/4/g, '4')
  .replace(/5/g, '5')
  .replace(/6/g, '6')
  .replace(/7/g, '7')
  .replace(/8/g, '8')
  .replace(/9/g, '9');

class Q implements IQ {
  constructor(public numerator: number, public denominator: number) {
    if (denominator == 0) throw "Divide By Zero Error";

    this.numerator = Math.abs(numerator) * (((numerator * denominator) > 0) ? 1 : -1);
    this.denominator = Math.abs(denominator);

    let gcdOfND: number = basic_gcd(Math.abs(this.numerator), Math.abs(this.denominator));
    this.numerator /= gcdOfND; this.denominator /= gcdOfND;
  }

  get sign() {
    return (this.numerator * this.denominator >= 0) ? 1 : -1;
  };

  toString: (isMixed?: boolean) => string;
  toBeautifyString: () => Array<string>;
  toContinuedFraction: () => string;

  value: () => number;
  inverse: () => Q;

  isEqual: (q: Q) => boolean;
  isBigger: (q: Q) => boolean;
  isSmaller: (q: Q) => boolean;

  add: (q: Q) => Q;
  sub: (q: Q) => Q;
  mul: (q: Q) => Q;
  div: (q: Q) => Q;
  mod: (q: Q) => Q;
  pow: (q: Q) => Q;
}

Q.prototype.toString = function (isMixed: boolean): string {
  return isMixed ?
  `${Math.floor(this.value())} ${this.sub(new Q(Math.floor(this.value()), 1)).toString()}` :
  `${this.numerator}/${this.denominator}`;
};

Q.prototype.toBeautifyString = function (): Array<string> {
  let lines = ['', '', ''];

  if (this.sign == -1) {
    lines[0] += '  ';
    lines[1] += '- ';
    lines[2] += '  ';
  }

  lines[0] += toMonospace(String(Math.abs(this.numerator)));
  lines[1] += '━'.repeat(Math.max(String(Math.abs(this.numerator)).length, String(Math.abs(this.denominator)).length));
  lines[2] += toMonospace(String(Math.abs(this.denominator)));

  return lines;
};

Q.prototype.toContinuedFraction = function (): string {
  return '';
};

Q.prototype.value = function (): number {
  return this.numerator / this.denominator;
};

Q.prototype.inverse = function (): Q {
  return new Q(this.denominator, this.numerator);
};

Q.prototype.isEqual = function (q: Q): boolean {
  return this.numerator == q.numerator && this.denominator == q.denominator;
};

Q.prototype.isBigger = function (q: Q): boolean {
  let lcmOfDD = basic_lcm(this.denominator, q.denominator);
  return (this.numerator * (lcmOfDD / this.denominator)) > (q.numerator * (lcmOfDD / q.denominator));
};

Q.prototype.isSmaller = function (q: Q): boolean {
  let lcmOfDD = basic_lcm(this.denominator, q.denominator);
  return (this.numerator * (lcmOfDD / this.denominator)) < (q.numerator * (lcmOfDD / q.denominator));
};

Q.prototype.add = function (q: Q): Q {
  let lcmOfDD = basic_lcm(this.denominator, q.denominator);
  return new Q((this.numerator * (lcmOfDD / this.denominator)) + (q.numerator * (lcmOfDD / q.denominator)), lcmOfDD);
};

Q.prototype.sub = function (q: Q): Q {
  return this.add(q.mul(new Q(-1, 1)));
};

Q.prototype.mul = function (q: Q): Q {
  return new Q(this.numerator * q.numerator, this.denominator * q.denominator);
};

Q.prototype.div = function (q: Q): Q {
  return this.mul(q.inverse());
};

Q.prototype.mod = function (q: Q): Q {
  let lcmOfDD = basic_lcm(this.denominator, q.denominator);
  return new Q((this.numerator * (lcmOfDD / this.denominator)) % (q.numerator * (lcmOfDD / q.denominator)), lcmOfDD);
};

// Q.prototype.pow = function (z: Z): Q {

// };

const q1: Q = new Q(17, -314);
const q2: Q = new Q(7, 4);
console.log(q1.toBeautifyString().join('\n'));