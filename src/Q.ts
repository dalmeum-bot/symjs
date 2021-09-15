interface IQ {
  numerator: number,
  denominator: number
}

const basic_gcd = (a: number, b: number): number => (!b) ? a : basic_gcd(b, a % b);
const basic_lcm = (a: number, b: number): number => a * b / basic_gcd(a, b);

class Q implements IQ {
  constructor(public numerator: number, public denominator: number) {
    if (denominator == 0) throw "Divide By Zero Error";

    this.numerator = Math.abs(numerator) * (((numerator * denominator) > 0) ? 1 : -1);
    this.denominator = Math.abs(denominator);

    let gcdOfND: number = basic_gcd(Math.abs(this.numerator), Math.abs(this.denominator));
    this.numerator /= gcdOfND; this.denominator /= gcdOfND;
  }

  toString: () => string;
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

Q.prototype.toString = function (): string {
  return `${this.numerator}/${this.denominator}`;
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

const q1: Q = new Q(1, -3);
const q2: Q = new Q(1, 3);
console.log(q1.div(q2).toString());