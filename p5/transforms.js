/* eslint-disable */

let canvas = document.getElementsByClassName("p5Canvas");

function pxToCoords(px, py) {
  if (canvas.length) {
    let x, y;

    try {
      x = document.documentElement.style.getPropertyValue("--x");
      y = document.documentElement.style.getPropertyValue("--y");

      x = +x.substr(0, x.length - 2);
      y = +y.substr(0, y.length - 2);
    } catch {
      return null;
    }

    return [Math.round(px - x), Math.round(py - y)];
  }

  return null;
}

export function mousePressed(callback) {
  return ({ clientX, clientY }) => {
    let c = pxToCoords(clientX, clientY);

    if (c) callback(...c);
  };
}

export function mouseMoved(callback) {
  return ({clientX,clientY}) => {
    let c = pxToCoords(clientX, clientY);

    if (c) callback(...c);
  }
}

export function mouseDragged(callback) {
  return ({clientX,clientY}) => {
    let c = pxToCoords(clientX, clientY);

    if (c) callback(...c);
  }
}

export function mouseReleased(callback) {
  return ({clientX,clientY}) => {
    let c = pxToCoords(clientX, clientY);

    if (c) callback(...c);
  }
}

export function mouseClicked(callback) {
  return ({clientX,clientY}) => {
    let c = pxToCoords(clientX, clientY);

    if (c) callback(...c);
  }
}

export function doubleClicked(callback) {
  return ({clientX,clientY}) => {
    let c = pxToCoords(clientX, clientY);

    if (c) callback(...c);
  }
}