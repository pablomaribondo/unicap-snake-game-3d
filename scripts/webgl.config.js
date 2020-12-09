const vertexShaderSource = `
attribute vec3 vertexPosition;
uniform mat4 p_matrix;
uniform mat4 v_matrix;

void main() {
  gl_Position = p_matrix * v_matrix * vec4(vertexPosition, 1.0);
}
`;

const fragmentShaderSource = `
uniform highp vec3 v_color;

void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
`;

const initBuffers = (gl, positions) => {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
};

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return undefined;
};

const createProgram = (gl) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    const programInfo = {
      program,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(program, "vertexPosition"),
      },
      uniformLocations: {
        pMatrix: gl.getUniformLocation(program, "p_matrix"),
        vMatrix: gl.getUniformLocation(program, "v_matrix"),
        color: gl.getUniformLocation(program, "v_color"),
      },
    };

    return programInfo;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return undefined;
};

const setBuffersNAttributes = (gl, programInfo, buffers) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
};

const setUniforms = (gl, programInfo, pMatrix, vMatrix, color) => {
  gl.uniformMatrix4fv(programInfo.uniformLocations.pMatrix, false, pMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.vMatrix, false, vMatrix);
  gl.uniform3fv(programInfo.uniformLocations.color, color);
};

export { initBuffers, createProgram, setBuffersNAttributes, setUniforms };
