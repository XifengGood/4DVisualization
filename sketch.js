/* eslint-disable */

export function setup() {
  createCanvas(innerWidth, innerHeight);
  background(220);
}

export function draw() {
  rect(50, 50, width - 100, height - 100);
}

export function onResize() {
  resizeCanvas(innerWidth, innerHeight);
}
