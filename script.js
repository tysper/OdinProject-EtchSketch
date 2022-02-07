"use strict";

// ELEMENTS
const drawingBoardEl = document.querySelector(".c__drawing");
const colorInputEl = document.querySelector(".color__input");

const penBtnEl = [document.querySelector(".pencil__btn"), pencilMode];
const rainbowBtnEl = [document.querySelector(".rainbow__btn"), rainbowMode];
const gradientBtnEl = [document.querySelector(".gradient__btn"), gradientMode];
const eraserBtnEl = [document.querySelector(".eraser__btn"), eraserMode];
const clearPadBtnEl = document.querySelector(".clear__btn");
const rangeSliderEl = document.querySelector(".range__slider");
const gridVisualizerEls = document.querySelectorAll(".grid__visualizer");

const btnModes = [penBtnEl, rainbowBtnEl, gradientBtnEl, eraserBtnEl];

// STATE MANAGERS
let totalSquare = 20 * 20;
let mouseDown = false;
let currentColor = "black";
let currentMode = "pencil";
let currentGradient = 100;

// check whether mouse is up or down
window.onmousedown = function () {
  mouseDown = true;
};
window.onmouseup = function () {
  mouseDown = false;
};

// INITIAL SETTING
function createGridItems(gridSize) {
  for (let i = 0; i < gridSize; i++) {
    drawingBoardEl.insertAdjacentHTML(
      "beforeend",
      `
      <div class="grid-item"></div>
      `
    );
  }
}

createGridItems(totalSquare);
let gridItems = document.querySelectorAll(".grid-item");

function removeGridItems() {
  gridItems.forEach((x) => {
    drawingBoardEl.removeChild(x);
  });
}

function removeEvents() {
  gridItems.forEach((x) => {
    if (x.getAttribute("listener")) {
      x.removeEventListener("mouseover");
      x.removeEventListener("mousedown");
    }
  });
}

function updateGridItemsValue() {
  gridItems = document.querySelectorAll(".grid-item");
}

function getRandomColor() {
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "a", "b", "c", "d", "e", "f"];
  let finalColor = "#";
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * 16) + 1;
    finalColor += values[index];
  }

  return finalColor;
}

function getGradientColor() {
  const pastColor = currentGradient;
  if (currentGradient > 0) {
    currentGradient -= 4;
  } else {
    currentGradient = 100;
    return currentGradient;
  }
  return pastColor;
}

function pencilMode() {
  return currentColor;
}
function rainbowMode() {
  return getRandomColor();
}
function gradientMode() {
  return `hsl(0, 0%, ${getGradientColor()}%)`;
}
function eraserMode() {
  return "#fff";
}

function updateCurrentMode(mode) {
  updateGridItemsValue();
  removeEvents();
  gridItems.forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });
    el.addEventListener("mouseover", () => {
      if (mouseDown) {
        el.style.backgroundColor = mode();
      }
    });
    el.addEventListener("mousedown", () => {
      el.style.backgroundColor = mode();
    });
  });
}

function updateGridSize(grid) {
  drawingBoardEl.setAttribute("style", `--cols: ${grid}; --rols: ${grid};`);
  removeGridItems();
  createGridItems(grid * grid);
  updateCurrentMode(pencilMode);
}

btnModes.forEach((x) => {
  const [el, mode] = x;
  el.addEventListener("click", () => {
    console.log(mode);
    updateCurrentMode(mode);
  });
});

colorInputEl.onchange = function () {
  currentMode = "pencil";
  updateCurrentMode(pencilMode);
  currentColor = colorInputEl.value;
};

clearPadBtnEl.addEventListener("click", () => {
  gridItems.forEach((el) => {
    el.style.backgroundColor = "#fff";
  });
});

rangeSliderEl.onchange = function () {
  const size = rangeSliderEl.value;
  gridVisualizerEls.forEach((el) => {
    el.textContent = size;
  });
  updateGridSize(size);
};

updateCurrentMode(pencilMode);
