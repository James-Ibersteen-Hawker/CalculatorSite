"use strict";
const canvas = document.getElementById("canvas");
let cursor = get("#cursor");
let objs;
window.addEventListener("DOMContentLoaded", function () {
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
            if (!objs[i].e.classList.contains("focus")) {
              objs[i].e.removeAttribute("style");
              objs[i].e.classList.add("focus");
            }
            break;
          }
        }
      }
      canvas.classList.remove("pointer");
      if (objs[i].e.classList.contains("focus")) {
        objs[i].e.classList.remove("focus");
        objs[i].e.setAttribute(
          "style",
          `background: rgba(${objs[i].bg.join(",")});`
        );
      }
    }
  });
  type(" JavaScript Terminal Calculator", get("#text"));
});
window.onresize = build();
function build() {
  objs = Array.from(get("main").querySelectorAll("*"));
  console.log(objs);
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
      bg: (() => {
        let cClass = Array.from(objs[i].classList);
        let color = [];
        for (let i = 0; i < cClass.length; i++) {
          if (cClass[i].indexOf("c") == 0) {
            let t = cClass[i].split("-");
            t[0] = t[0].substring(1);
            for (let x = 0; x < t.length; x++) {
              if (t[x].length == 3) {
                if (isNaN(Number(t[x])) == false) {
                  color.push(t[x]);
                }
              } else if ((x = t.length - 1)) color.push(t[x]);
            }
          }
        }
        return color;
      })(),
      hBg: (() => {
        let hClass = Array.from(objs[i].classList);
        let color = [];
        for (let i = 0; i < hClass.length; i++) {
          if (hClass[i].indexOf("h") == 0) {
            let t = hClass[i].split("-");
            t[0] = t[0].substring(1);
            for (let x = 0; x < t.length; x++) {
              if (t[x].length == 3) {
                if (isNaN(Number(t[x])) == false) {
                  color.push(t[x]);
                }
              } else if ((x = t.length - 1)) color.push(t[x]);
            }
          }
        }
        return color;
      })(),
      init: function () {
        this.bg = (() => {
          let cClass = Array.from(this.e.classList);
          let color = [];
          for (let i = 0; i < cClass.length; i++) {
            if (cClass[i].indexOf("c") == 0) {
              let t = cClass[i].split("-");
              t[0] = t[0].substring(1);
              for (let x = 0; x < t.length; x++) {
                if (t[x].length == 3) {
                  if (isNaN(Number(t[x])) == false) {
                    color.push(t[x]);
                  }
                } else if ((x = t.length - 1)) color.push(t[x]);
              }
            }
          }
          return color;
        })();
        this.hBg = (() => {
          let hClass = Array.from(this.e.classList);
          let color = [];
          for (let i = 0; i < hClass.length; i++) {
            if (hClass[i].indexOf("h") == 0) {
              let t = hClass[i].split("-");
              t[0] = t[0].substring(1);
              for (let x = 0; x < t.length; x++) {
                if (t[x].length == 3) {
                  if (isNaN(Number(t[x])) == false) {
                    color.push(t[x]);
                  }
                } else if ((x = t.length - 1)) color.push(t[x]);
              }
            }
          }
          return color;
        })();
        this.e.setAttribute("style", `background: rgba(${this.bg.join(",")})`);
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
    temp[i].cL = `${objs[i].tagName}${i}_click`;
    temp[i].name = `${objs[i].tagName}${i}`;
    temp[i].e.classList.add(temp[i].name);
    temp[i].e.setAttribute("data-idef", temp[i].name);
    style.append(`
      .${temp[i].name}_click {
      background: ${(() => {
        let d = 50;
        let stylTemp = temp[i].hBg;
        let r = stylTemp[0];
        let g = stylTemp[1];
        let b = stylTemp[2];
        let a = stylTemp[3];
        let compile;
        if (stylTemp.length == 4) {
          if (r - d < 0) r = 0;
          else r = r - d;
          if (g - d < 0) g = 0;
          else g = g - d;
          if (b - d < 0) b = 0;
          else b = b - d;
          compile = `rgba(${r},${g},${b}, ${a})`;
          return compile;
        }
      })()} !important;
          }
      .${temp[i].name}.focus {
      background: rgba(${temp[i].hBg.join(",")});
      }
    `);
    style.id = `_${objs[i].tagName}${i}`;
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
  for (let q = 0; q < objs.length; q++) {
    let config = {
      attributes: true,
      attributeFilter: ["class", "style"],
    };
    let observer = new MutationObserver((record) => {
      console.log(record[0].target);
      // for (let i = 0; i < objs.length; i++) {
      //   if (objs[i].e == record[0].target) objs[i].init();
      // }
    });
    observer.observe(objs[q].e, config);
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
function type(arg, destination) {
  arg = arg.split("");
  for (let i = 0; i < arg.length; i++) {
    setTimeout(
      () => {
        destination.append(arg[i]);
      },
      200 * i,
      arg,
      i
    );
  }
}
