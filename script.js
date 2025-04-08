"use strict";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let objs = Array.from(document.body.querySelectorAll("*"));
window.onload = function () {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  objs.splice(objs.indexOf(canvas), 1);
  for (let i = 0; i < objs.length; i++) {
    if (
      (() => {
        let obj = objs[i].getBoundingClientRect();
        let cv = canvas.getBoundingClientRect();
        if (obj.top > cv.top + canvas.offsetHeight) return true;
        else if (obj.left > cv.left + canvas.offsetWidth) return true;
        else return false;
      })()
    )
      objs.splice(i, 1);
  }
  objs.splice(objs.length - 3, 3);
  let temp = new Array(objs.length);
  for (let i = 0; i < objs.length; i++) {
    temp[i] = {
      x:
        objs[i].getBoundingClientRect().left -
        canvas.getBoundingClientRect().left,
      y:
        objs[i].getBoundingClientRect().top -
        canvas.getBoundingClientRect().top,
      w: objs[i].offsetWidth,
      h: objs[i].offsetHeight,
      e: objs[i],
      bounds: {
        tL: {
          x: this.x,
          y: this.y,
        },
        bL: {
          x: this.x,
          y: this.y + this.h,
        },
        tR: {
          x: this.x + this.w,
          y: this.y,
        },
      },
      init: function () {
        if (this.e.getAttribute("onclick")) {
          this.inFunc = function () {
            eval(this.e.getAttribute("onclick"));
          };
        } else
          this.inFunc = function () {
            console.log("no function!");
          };
      },
    };
  }
  objs = temp;
  objs.forEach((elem) => elem.init());
  objs.sort((a, b) => {
    let compA = window.getComputedStyle(a.e);
    let compB = window.getComputedStyle(b.e);
    let zA = compA.getPropertyValue("z-index");
    let zB = compB.getPropertyValue("z-index");
    if (compA.getPropertyValue("position") == "static") return -1;
    if (compB.getPropertyValue("postion") == "static") return 1;
    if (zA == "auto") return -1;
    if (zB == "auto") return 1;
    if (zA > zB) return 1;
    else if (zA < zB) return -1;
    else return 0;
  });
  divide();
};
function divide() {
  for (let i = 0; i < objs.length; i++) {
    console.log(objs[i]);
    ctx.fillStyle = "rgba(0,0,0,.2)";
    ctx.fillRect(objs[i].x, objs[i].y, objs[i].w, objs[i].h);
    ctx.stroke();
  }
}

function test() {
  console.log("testing");
}
