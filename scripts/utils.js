const createCube = (a, b) => {
  const x = (a / 50) * 2 - 1;
  const y = (b / 50) * -2 + 1;
  const z = -1.05;
  const l = (1 / 50) * 2;
  return [
    // Front Face
    x,
    y,
    z,
    x + l,
    y,
    z,
    x,
    y - l,
    z,
    x + l,
    y - l,
    z,
    // Back Face
    x,
    y,
    z + l,
    x + l,
    y,
    z + l,
    x,
    y - l,
    z + l,
    x + l,
    y - l,
    z + l,
    // Top Face
    x,
    y,
    z + l,
    x + l,
    y,
    z + l,
    x,
    y,
    z,
    x + l,
    y,
    z,
    // Bottom Face
    x,
    y - l,
    z + l,
    x + l,
    y - l,
    z + l,
    x,
    y - l,
    z,
    x + l,
    y - l,
    z,
    // Left Face
    x,
    y,
    z + l,
    x,
    y,
    z,
    x,
    y - l,
    z + l,
    x,
    y - l,
    z,
    // Right Face
    x + l,
    y,
    z,
    x + l,
    y,
    z + l,
    x + l,
    y - l,
    z,
    x + l,
    y - l,
    z + l,
  ];
};

const directions = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
};

const rgbToArray = (red, green, blue) => [red / 255, green / 255, blue / 255];

const setScore = (element, value) => {
  element.innerText = value.toString().padStart(5, "0");
};

export { createCube, directions, rgbToArray, setScore };
