class Node {
  constructor(val) {
    this.val = val;
    this.children = [];
  }
}

class Tree {
  constructor() {
    this.root = null;
  }

  add(val) {
    const node = new Node(val);
    if (this.root == null) {
      this.root = node;
      return this;
    }

    let current = this.root;

    while (current) {
      if (val === current.val) return undefined;
      else if (val < current.val) {

      }
    }
  }
}