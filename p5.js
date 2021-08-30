/* eslint-disable */

import * as sketch from "./sketch.js";
for (let func in sketch) window[func] = sketch[func];