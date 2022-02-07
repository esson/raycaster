export default class Vector {

  constructor(x, y) {
    if (x instanceof Vector) {
      y = x.y;
      x = x.x;
    }
    if (typeof y !== 'number') {
      y = x;
    }
    this.x = x;
    this.y = y;
  }

  add(x, y) {
    return this.operate(x, y, '+');
  }

  subtract(x, y) {
    return this.operate(x, y, '-');
  }

  multiply(x, y) {
    return this.operate(x, y, '*');
  }

  divide(x, y) {
    return this.operate(x, y, '/');
  }

  operate(x, y, operation) {
    if (x instanceof Vector) {
      y = x.y;
      x = x.x;
    }
    if (typeof y !== 'number') {
      y = x;
    }
    switch (operation) {
      case '+':
        return new Vector(this.x + x, this.y + y);
      case '-':
        return new Vector(this.x - x, this.y - y);
      case '*':
        return new Vector(this.x * x, this.y * y);
      case '/':
        return new Vector(this.x / x, this.y / y);
    }
  }

  distance(vector) {
    return Vector.distance(this.x, this.y, vector.x, vector.y);
  }

  static distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }
}