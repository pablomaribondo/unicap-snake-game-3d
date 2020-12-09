import {
  initBuffers,
  setUniforms,
  setBuffersNAttributes,
} from "../webgl.config.js";
import { directions, rgbToArray } from "../utils.js";

import SnakeSegment from "./SnakeSegment.js";

class Snake {
  constructor(x = 10, y = 25, direction = directions.right) {
    this.tail = new SnakeSegment(x - 3 * direction.x, y - 3 * direction.y);
    this.tail.next = new SnakeSegment(x - 2 * direction.x, y - 2 * direction.y);
    this.tail.next.next = new SnakeSegment(x - direction.x, y - direction.y);
    this.head = new SnakeSegment(x, y);
    this.tail.next.next.next = this.head;
    this.length = 4;
    this.direction = direction;
    this.nextDirection = direction;
    this.bodyColor = rgbToArray(27, 143, 79);
    this.headColor = rgbToArray(6, 66, 33);
  }

  heading(direction) {
    this.nextDirection = direction;
  }

  eat(apple) {
    if (
      (this.direction.x !== 0 && this.nextDirection.y !== 0) ||
      (this.direction.y !== 0 && this.nextDirection.x !== 0)
    ) {
      this.direction = this.nextDirection;
    }
    this.head.next = new SnakeSegment(
      this.head.x + this.direction.x,
      this.head.y + this.direction.y
    );
    this.head = this.head.next;
    if (this.head.x === apple.x && this.head.y === apple.y) {
      this.length += 1;
      return true;
    }
    this.tail = this.tail.next;
    return false;
  }

  createBuffer(gl) {
    let current = this.tail;
    const rects = [];
    while (current) {
      rects.push(...current.cube);

      current = current.next;
    }
    return initBuffers(gl, rects);
  }

  createHeadBuffer(gl) {
    return initBuffers(gl, [...this.head.cube]);
  }

  collide(other) {
    let current = other.tail;
    while (current) {
      if (this.head.x === current.x && this.head.y === current.y) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  dead() {
    const outofbound =
      this.head.x > 48 ||
      this.head.x < 1 ||
      this.head.y > 48 ||
      this.head.y < 1;
    let eatmyself = false;
    let current = this.tail;
    while (current && current !== this.head) {
      if (this.head.x === current.x && this.head.y === current.y) {
        eatmyself = true;
      }
      current = current.next;
    }
    return outofbound || eatmyself;
  }

  draw(gl, programInfo, projectionMatrix, viewMatrix) {
    setBuffersNAttributes(gl, programInfo, this.createBuffer(gl));
    setUniforms(gl, programInfo, projectionMatrix, viewMatrix, this.bodyColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.length * 24);

    setBuffersNAttributes(gl, programInfo, this.createHeadBuffer(gl));
    setUniforms(gl, programInfo, projectionMatrix, viewMatrix, this.headColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 24);
  }
}

export default Snake;
