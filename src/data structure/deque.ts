interface IDeque<T> {

}

class Deque<T> implements IDeque<T> {
  content: Array<T>;

  constructor(arr: T[]) {
    this.content = arr;
  }
}