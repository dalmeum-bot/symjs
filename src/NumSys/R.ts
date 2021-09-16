interface IR {
  formula: string
}

class R implements IR {
  constructor(public formula: string) {
    this.formula = formula;
  }
}

/* 
 * √(3)+³√(7+⁴√(3))
 * = ²rt(3),³rt(7+⁴rt(3))
 * = = [rt(2, 3), rt(3, [7, rt(4, 3)])]
 */