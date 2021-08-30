/* eslint-disable */

import * as sketch from "./sketch.js";
for (let func in sketch) window[func] = sketch[func];

let canvas = document.getElementsByClassName("p5Canvas");
function onresize() {
  if (canvas.length) {
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

window.addEventListener("resize", onresize);
setInterval(onresize, 100);
