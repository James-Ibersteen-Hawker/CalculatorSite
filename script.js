"use strict";
const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
let objs;
window.onload = function () {
  build();
  canvas.addEventListener("mousedown", (event) => {
    for (let i = 0; i < objs.length; i++) {
      let c = objs[i].tBounds;
      if (event.x >= c.tL.x && event.x <= c.tR.x) {
        if (event.y >= c.tL.y && event.y <= c.bL.y) {
          objs[i].e.classList.add(objs[i].cL);
          objs[i].inFunc();
        }
      }
    }
  });
  canvas.addEventListener("mouseup", () => {
    for (let i = 0; i < objs.length; i++) {
      if (objs[i].e.classList.contains(objs[i].cL))
        objs[i].e.classList.remove(objs[i].cL);
    }
  });
  canvas.addEventListener("mousemove", (event) => {
    for (let i = 0; i < objs.length; i++) {
      let c = objs[i].tBounds;
      if (event.x >= c.tL.x && event.x <= c.tR.x) {
        if (event.y >= c.tL.y && event.y <= c.bL.y) {
          if (objs[i].hasFunc == true) {
            canvas.classList.add("pointer");
            objs[i].e.classList.add("focus");
            break;
          }
        }
      }
      canvas.classList.remove("pointer");
      objs[i].e.classList.remove("focus");
    }
  });
};
function build() {
  objs = Array.from(get("main").querySelectorAll("*"));
  canvas.removeAttribute("width");
  canvas.removeAttribute("height");
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
      tX: objs[i].getBoundingClientRect().left,
      tY: objs[i].getBoundingClientRect().top,
      cBounds: {
        tL: {
          x:
            objs[i].getBoundingClientRect().left -
            canvas.getBoundingClientRect().left,
          y:
            objs[i].getBoundingClientRect().top -
            canvas.getBoundingClientRect().top,
        },
        bL: {
          x:
            objs[i].getBoundingClientRect().left -
            canvas.getBoundingClientRect().left,
          y:
            objs[i].getBoundingClientRect().top -
            canvas.getBoundingClientRect().top +
            objs[i].offsetHeight,
        },
        tR: {
          x:
            objs[i].getBoundingClientRect().left -
            canvas.getBoundingClientRect().left +
            objs[i].offsetWidth,
          y:
            objs[i].getBoundingClientRect().top -
            canvas.getBoundingClientRect().top,
        },
      },
      tBounds: {
        tL: {
          x: objs[i].getBoundingClientRect().left,
          y: objs[i].getBoundingClientRect().top,
        },
        bL: {
          x: objs[i].getBoundingClientRect().left,
          y: objs[i].getBoundingClientRect().top + objs[i].offsetHeight,
        },
        tR: {
          x: objs[i].getBoundingClientRect().left + objs[i].offsetWidth,
          y: objs[i].getBoundingClientRect().top,
        },
      },
      init: function () {
        if (this.e.getAttribute("onclick")) {
          this.inFunc = function () {
            eval(this.e.getAttribute("onclick"));
          };
          this.hasFunc = true;
        } else {
          this.inFunc = function () {
            console.log("no function");
          };
          this.hasFunc = false;
        }
      },
    };
    let style = document.createElement("style");
    style.append(`
      .${objs[i].tagName}${i}_set {
      /*nothing here*/
      }
      .${objs[i].tagName}${i}_click {
      background: ${(() => {
        let d = 100;
        let styles = window.getComputedStyle(temp[i].e);
        let bg = styles.getPropertyValue("background");
        if (bg != "auto") {
          bg = bg.toString().split(")")[0] + ")";
          bg = bg.split("");
          let stylTemp = [];
          for (let q = 0; q < bg.length; q++) {
            if ((isNaN(Number(bg[q])) != true && bg[q] != " ") || bg[q] == ",")
              stylTemp.push(bg[q]);
          }
          stylTemp = stylTemp.join("").split(",");
          if (stylTemp.length == 3)
            return `rgb(${stylTemp[0] - d},${stylTemp[1] - d},${
              stylTemp[2] - d
            })`;
          else if (stylTemp.length == 4) {
            return `rgba(${stylTemp[0] - d},${stylTemp[1] - d},${
              stylTemp[2] - d
            }, ${stylTemp[3]})`;
          }
        }
      })()}
      }
    `);
    style.id = `_${objs[i].tagName}${i}`;
    temp[i].e.classList.add(`${objs[i].tagName}${i}_set`);
    temp[i].cL = `${objs[i].tagName}${i}_click`;
    document.head.append(style);
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
  objs.sort(() => {
    return -1;
  });
  for (let i = 0; i < objs.length; i++) {
    let config = {
      attributes: true,
    };
    let observer = new MutationObserver(() => {
      console.log("here", objs[i].cL);
      get(`#_${objs[i].e.tagName}${i}`).remove();
      let style = document.createElement("style");
      style.id = `_${objs[i].e.tagName}${i}`;
      style.append(`.${objs[i].tagName}${i}_click {
        background: ${(() => {
          let d = 100;
          let styles = window.getComputedStyle(objs[i].e);
          let bg = styles.getPropertyValue("background");
          if (bg != "auto") {
            bg = bg.toString().split(")")[0] + ")";
            bg = bg.split("");
            let stylTemp = [];
            for (let q = 0; q < bg.length; q++) {
              if (
                (isNaN(Number(bg[q])) != true && bg[q] != " ") ||
                bg[q] == ","
              )
                stylTemp.push(bg[q]);
            }
            stylTemp = stylTemp.join("").split(",");
            if (stylTemp.length == 3)
              return `rgb(${stylTemp[0] - d},${stylTemp[1] - d},${
                stylTemp[2] - d
              })`;
            else if (stylTemp.length == 4) {
              return `rgba(${stylTemp[0] - d},${stylTemp[1] - d},${
                stylTemp[2] - d
              }, ${stylTemp[3]})`;
            }
          }
        })()}
      }
      `);
    });
    observer.observe(objs[i].e, config);
  }
}
function visualDivide() {
  for (let i = 0; i < objs.length; i++) {
    ctx.fillStyle = "rgba(0,0,0,.2)";
    ctx.fillRect(objs[i].x, objs[i].y, objs[i].w, objs[i].h);
    ctx.stroke();
  }
}
function test() {
  console.log("testing");
}
function get(arg) {
  return document.querySelector(arg);
}
