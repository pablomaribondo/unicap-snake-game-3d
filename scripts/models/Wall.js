import {
  initBuffers,
  setUniforms,
  setBuffersNAttributes,
} from "../webgl.config.js";
import { createCube, rgbToArray } from "../utils.js";

class Wall {
  constructor() {
    this.color = rgbToArray(29, 120, 95);
    this.buffer = null;
  }

  createBuffer(gl) {
    const wallArray = [];
    for (let i = 0; i < 50; i += 1) {
      wallArray.push(...createCube(i, 0));
    }
    for (let i = 1; i < 50; i += 1) {
      wallArray.push(...createCube(0, i));
    }
    for (let i = 1; i < 50; i += 1) {
      wallArray.push(...createCube(i, 49));
    }
    for (let i = 1; i < 50; i += 1) {
      wallArray.push(...createCube(49, i));
    }
    this.buffer = initBuffers(gl, wallArray);
  }

  draw(gl, programInfo, projectionMatrix, viewMatrix) {
    setBuffersNAttributes(gl, programInfo, this.buffer);
    setUniforms(gl, programInfo, projectionMatrix, viewMatrix, this.color);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4728);
  }
}

export default Wall;
