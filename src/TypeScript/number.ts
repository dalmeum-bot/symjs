class int {
  list: number[];
  size: number;

  add: (Z: int) => int;
  sub: (Z: int) => int;
  mul: (Z: int) => int;
  div: (Z: int) => int;
  mod: (Z: int) => int;
  pow: (Z: int) => int;

  constructor(number: string) {
    number = (number == '') ? '0' : number;
    number = number.replace(/,|_| /g, '');

    this.list = [];
    this.size = number.length;

    let n: number = 0;
    while (n < this.size) {
      this.list = this.list.concat(Number(number.slice(n, n + 15)));
      n += 15;
    }
  }

  get getNumber() {
    return this.list.join('');
  }

  get getSize() {
    return this.size;
  }
}

var a: int = new int("123 456_789_123_456_789_1");
console.log(a.getNumber);