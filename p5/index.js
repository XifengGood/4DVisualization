/* eslint-disable */

import * as sketch from "../sketch/index.js";

for (let func in sketch)
  window[func.substr(0, 2) == "on" ? func.toLowerCase() : func] = sketch[func];
