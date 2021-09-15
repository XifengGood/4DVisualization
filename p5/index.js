/* eslint-disable */

import * as transforms from "./transforms.js";
import * as sketch from "../sketch/index.js";

for (let func in sketch)
  window[func.substr(0, 2) == "on" ? func.toLowerCase() : func] =
    typeof transforms[func] == "function"
      ? transforms[func](sketch[func])
      : sketch[func];

let canvas = document.getElementsByClassName("p5Canvas");
function onresize() {
  if (canvas.length) {
    canvas[0].style.display = "block";
    let width = canvas[0].style.width;
    let height = canvas[0].style.height;

    width = +width.substr(0, width.length - 2);
    height = +height.substr(0, height.length - 2);

    let x = (innerWidth - width) / 2 + "px";
    let y = (innerHeight - height) / 2 + "px";

    document.documentElement.style.setProperty("--x", x);
    document.documentElement.style.setProperty("--y", y);
  }
}

function rgb(...args) {
  let c = color(...args);

  return `#${c
    ._getRed()
    .toString(16)
    .padStart(2, "0")}${c
    ._getGreen()
    .toString(16)
    .padStart(2, "0")}${c
    ._getBlue()
    .toString(16)
    .padStart(2, "0")}`;
}

Object.defineProperty(window, "background", {
  get() {
    return (...args) => {
      let c = color(...args);

      document.documentElement.style.background = rgb(c);
      return p5.prototype.background.call(p5.instance, c);
    };
  }
});

window.addEventListener("resize", onresize);
setInterval(onresize, 100);
