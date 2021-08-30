/* eslint-disable */

import "https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.min.js";

p5.Element.prototype.position = function(x = null, y = null) {
  if (x === null || y === null) {
    this.elt.classList.add("auto");
  } else {
    this.elt.classList.remove("auto");
    this.elt.style.setProperty("--x", x + "px");
    this.elt.style.setProperty("--y", y + "px");
  }
};

window.rgb = function() {
  let color = window.color(...arguments);

  let red = color
    ._getRed()
    .toString(16)
    .padStart(2, "0");

  let green = color
    ._getGreen()
    .toString(16)
    .padStart(2, "0");

  let blue = color
    ._getBlue()
    .toString(16)
    .padStart(2, "0");

  return `#${red}${green}${blue}`;
};

Object.defineProperty(window, "background", {
  get: () =>
    function() {
      document.documentElement.style.background = rgb(...arguments);

      return p5.prototype.background.apply(p5.instance, arguments);
    },
  set: () => {}
});
