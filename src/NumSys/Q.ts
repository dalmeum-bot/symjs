// import { Z } from 'Z'; // fixme

interface IQ {
  /* 분자 */
  numerator: number,

  /* 분모 */
  denominator: number,

  /* 부호 */
  sign: number,

  /* 간단하게 표현 */
  toString(isMixed?: boolean): string,

  /* 더 예쁘게 표현 */
  toBeautifyString(isJoin?: boolean): (string[] | string),

  /* 연분수로 표현 */
  toContinuedFraction(): string,

  /* 근사값 */
  value(): number,

  /* 역수 */
  inverse(): Q,

  /* 부호 바꾸기 */
  negate(): Q,

  /* 일치 비교 */
  isEqual(q: Q): boolean,

  /* 큰지 비교 */
  isBigger(q: Q): boolean,

  /* 작은지 비교 */
  isSmaller(q: Q): boolean,

  /* 덧셈 */
  add(q: Q): Q,

  /* 뺄셈 */
  sub(q: Q): Q,

  /* 곱셈 */
  mul(q: Q): Q,

  /* 나눗셈 */
  div(q: Q): Q,

  /* 나머지 */
  mod(q: Q): Q,

  /* 거듭제곱 */
  //pow(z: Z): Q // todo
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

export class Q implements IQ {
  numerator: number;
  denominator: number;

  constructor(numerator: number, denominator: number) {
    if (denominator == 0) throw "Divide By Zero Error";

    this.numerator = Math.abs(numerator) * (((numerator * denominator) > 0) ? 1 : -1);
    this.denominator = Math.abs(denominator);

    let gcdOfND: number = basic_gcd(Math.abs(this.numerator), Math.abs(this.denominator));
    this.numerator /= gcdOfND; this.denominator /= gcdOfND;
  }

  get sign () {
    return (this.numerator * this.denominator >= 0) ? 1 : -1;
  };

  toString (isMixed?: boolean): string {
    return isMixed ?
    `${Math.floor(this.value())} ${this.sub(new Q(Math.floor(this.value()), 1)).toString()}` :
    `${this.numerator}/${this.denominator}`;
  };

  toBeautifyString (isJoin?: boolean): (string[] | string) {
    let lines = ['', '', ''];

    if (this.sign == -1) {
      lines[0] += '  ';
      lines[1] += '- ';
      lines[2] += '  ';
    }

    lines[0] += toMonospace(String(Math.abs(this.numerator)));
    lines[1] += '━'.repeat(Math.max(String(Math.abs(this.numerator)).length, String(Math.abs(this.denominator)).length));
    lines[2] += toMonospace(String(Math.abs(this.denominator)));

    return (isJoin) ? lines.join('\n') : lines;
  };

  toContinuedFraction (): string {
    return '';
  };

  value (): number {
    return this.numerator / this.denominator;
  };

  inverse (): Q {
    return new Q(this.denominator, this.numerator);
  };

  negate (): Q {
    return new Q(-this.numerator, this.denominator);
  };

  isEqual (q: Q): boolean {
    return this.numerator == q.numerator && this.denominator == q.denominator;
  };

  isBigger (q: Q): boolean {
    let lcmOfDD = basic_lcm(this.denominator, q.denominator);
    return (this.numerator * (lcmOfDD / this.denominator)) > (q.numerator * (lcmOfDD / q.denominator));
  };

  isSmaller (q: Q): boolean {
    let lcmOfDD = basic_lcm(this.denominator, q.denominator);
    return (this.numerator * (lcmOfDD / this.denominator)) < (q.numerator * (lcmOfDD / q.denominator));
  };

  add (q: Q): Q {
    let lcmOfDD = basic_lcm(this.denominator, q.denominator);
    return new Q((this.numerator * (lcmOfDD / this.denominator)) + (q.numerator * (lcmOfDD / q.denominator)), lcmOfDD);
  };

  sub (q: Q): Q {
    return this.add(q.negate());
  };

  mul (q: Q): Q {
    return new Q(this.numerator * q.numerator, this.denominator * q.denominator);
  };

  div (q: Q): Q {
    return this.mul(q.inverse());
  };

  mod (q: Q): Q {
    let lcmOfDD = basic_lcm(this.denominator, q.denominator);
    return new Q((this.numerator * (lcmOfDD / this.denominator)) % (q.numerator * (lcmOfDD / q.denominator)), lcmOfDD);
  };

  // pow (z: Z): Q {
  //   return new Q(1, 1);
  // }; // fixme
}

const q1: Q = new Q(17, -314);
const q2: Q = new Q(7, 4);
console.log(q1.toBeautifyString(true));