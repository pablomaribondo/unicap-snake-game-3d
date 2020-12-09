import {
  initBuffers,
  setUniforms,
  setBuffersNAttributes,
} from "../webgl.config.js";
import { createCube, rgbToArray } from "../utils.js";

class Apple {
  constructor() {
    this.x = 2 + Math.floor(Math.random() * 47);
    this.y = 2 + Math.floor(Math.random() * 47);
    this.buffer = null;
    this.color = rgbToArray(196, 52, 8);
  }

  createBuffer(gl) {
    this.buffer = initBuffers(gl, createCube(this.x, this.y));
  }

  update() {
    this.x = 2 + Math.floor(Math.random() * 47);
    this.y = 2 + Math.floor(Math.random() * 47);
  }

  draw(gl, programInfo, projectionMatrix, viewMatrix) {
    setBuffersNAttributes(gl, programInfo, this.buffer);
    setUniforms(gl, programInfo, projectionMatrix, viewMatrix, this.color);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 24);
  }
}

export default Apple;
