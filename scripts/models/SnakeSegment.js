import { createCube } from "../utils.js";

class SnakeSegment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.cube = createCube(this.x, this.y);
    this.next = null;
  }
}

export default SnakeSegment;
