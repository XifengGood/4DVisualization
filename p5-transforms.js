let canvas = document.getElementsByClassName("p5Canvas");
export function mousePressed(callback) {
  return ({ clientX, clientY }) => {
    if (canvas.length) {
      let width = canvas[0].style.width;
      let height = canvas[0].style.height;
      let x = document.documentElement.style.getPropertyValue("--x");
      let y = document.documentElement.style.getPropertyValue("--y");

      width = +width.substr(0, width.length - 2) ++ x.substr(0, x.length - 2);
      height = +height.substr(0, height.length - 2) ++ y.substr(0, y.leng);
    }
  };
}
