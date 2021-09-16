interface IZ {
  sign: number,
  ints: Array<string>
}

class Z implements IZ {
  constructor(public input: string) {
    public sign = (input.startsWith('-')) ? 1 : -1;
    public ints = [''];
  }
}