interface IStack<T> {

}

class StackNode<T> {
  data: T;

  constructor(node: T) {
    this.data = node;
  }
}

class Stack<T> implements IStack<T> {
  private content: Array<StackNode<T>>;
  public size: number;

  constructor(stack?: Array<T>) {
    if (stack != null) {
      this.content = stack.map(e => new StackNode(e));
      this.size = stack.length;
    }
    else {
      this.content = new Array<StackNode<T>>();
      this.size = 0;
    }
  }

  push(item: T) {
    const node = new StackNode<T>(item);
    this.content.push(node);
    this.size++;
  }

  pop() {
    if (this.size == 0) throw new RangeError("size of stack is 0");
    this.content.length--;
    this.size--;
  }

  peek(): StackNode<T> {
    return this.content[this.content.length - 1];
  }

  isEmpty(): boolean {
    return this.size == 0;
  }

  toString(): string {
    return '[' + this.content.map(e => e.data).join('|') + ']';
  }
}

// let a = new Stack<number>();
// a.push(3);
// a.push(4);
// a.push(7);
// console.log(a.peek());
console.log(3);