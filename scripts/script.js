import { createProgram } from "./webgl.config.js";
import { directions, setScore } from "./utils.js";
import { create, translate, perspective, lookAt } from "./matrix.js";

import Apple from "./models/Apple.js";
import Wall from "./models/Wall.js";
import Snake from "./models/Snake.js";

const canvas = document.getElementById("glcanvas"),
  highscoreButton = document.getElementById("highscore"),
  highscoreContainer = document.getElementById("highscore-container"),
  highscoreList = document.getElementById("highscore-list"),
  backButton = document.getElementById("back"),
  menu = document.getElementById("menu"),
  playButton = document.getElementById("play"),
  scoreContainer = document.getElementById("score-container"),
  scoreValue = document.getElementById("score"),
  apiUrl = "http://localhost:3000";

let snake,
  apple,
  tick = null,
  score = 0,
  highscores = [];

window.onload = () => {
  fetch(`${apiUrl}/highscore`, {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
    method: "GET",
  })
    .then((data) => {
      return data.json();
    })
    .then((response) => {
      const scores = [...response];

      scores.sort((a, b) => {
        if (a < b) {
          return 1;
        }
        if (a > b) {
          return -1;
        }
        return 0;
      });

      highscores = scores;
    })
    .catch((error) => console.log(error));
};

document.addEventListener("keydown", (event) => {
  if (!snake) {
    return;
  }

  switch (event.key) {
    case "ArrowUp":
      snake.heading(directions.up);
      break;
    case "ArrowRight":
      snake.heading(directions.right);
      break;
    case "ArrowDown":
      snake.heading(directions.down);
      break;
    case "ArrowLeft":
      snake.heading(directions.left);
      break;
  }
});

playButton.addEventListener("click", () => {
  menu.style.display = "none";
  canvas.style.display = "initial";
  scoreContainer.style.visibility = "visible";

  play();
});

highscoreButton.addEventListener("click", () => {
  menu.style.display = "none";
  highscoreContainer.style.display = "flex";

  highscoreList.innerHTML = "";
  highscores.forEach((element, index) => {
    highscoreList.innerHTML += `<ul class="list">${index + 1}: ${element}</ul>`;
  });
});

backButton.addEventListener("click", () => {
  menu.style.display = "flex";
  highscoreContainer.style.display = "none";
});

const gameOver = (gl) => {
  clearInterval(tick);

  menu.style.display = "flex";
  canvas.style.display = "none";
  scoreContainer.style.visibility = "hidden";

  const lowerScore = [...highscores].pop();

  if (score > lowerScore) {
    const scores = [...highscores];
    scores.push(score);

    scores.sort((a, b) => {
      if (a < b) {
        return 1;
      }
      if (a > b) {
        return -1;
      }
      return 0;
    });

    scores.pop();

    highscores = scores;

    fetch(`${apiUrl}/highscore`, {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ highscores }),
      method: "POST",
    }).catch((error) => console.log(error));
  }

  score = 0;
  setScore(scoreValue, score);
  initialize(gl);
};

const initialize = (gl) => {
  snake = new Snake();
  apple = new Apple();
  apple.createBuffer(gl);
};

const play = () => {
  const gl = canvas.getContext("webgl2");

  if (!gl) {
    return;
  }

  initialize(gl);

  const wall = new Wall();
  wall.createBuffer(gl);

  const programInfo = createProgram(gl);

  const pMatrix = create();
  perspective(pMatrix, (90 * Math.PI) / 180, 1, 0.1, 500);

  const projectionMatrix = create();
  translate(projectionMatrix, pMatrix, new Float32Array([0, 1.2, -0.2]));

  const viewMatrix = create();
  lookAt(
    viewMatrix,
    new Float32Array([0, -0.4, 0.5]),
    new Float32Array([0, 0, 0]),
    new Float32Array([0, 1, 1])
  );

  const drawScene = () => {
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(programInfo.program);

    snake.draw(gl, programInfo, projectionMatrix, viewMatrix);
    apple.draw(gl, programInfo, projectionMatrix, viewMatrix);
    wall.draw(gl, programInfo, projectionMatrix, viewMatrix);
  };

  const render = () => {
    drawScene();

    if (snake.eat(apple)) {
      apple.update();
      apple.createBuffer(gl);

      score += 10;
      setScore(scoreValue, score);
    }

    if (snake.dead()) {
      gameOver(gl);
    }
  };

  tick = setInterval(() => {
    render();
  }, 1000 / 20);
};
