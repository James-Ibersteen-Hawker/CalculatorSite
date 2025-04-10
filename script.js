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
            if (!objs[i].e.classList.contains("focus")) {
              objs[i].e.classList.add("focus");
            }
            break;
          }
        }
      }
      canvas.classList.remove("pointer");
      if (objs[i].e.classList.contains("focus")) {
        objs[i].e.classList.remove("focus");
        objs[i].e.classList.remove("focus");
      }
    }
  });
};
function build() {
  objs = Array.from(get("main").querySelectorAll("*"));
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
    temp[i].e.classList.add(`${objs[i].tagName}${i}_set`);
    temp[i].cL = `${objs[i].tagName}${i}_click`;
    style.append(`
      .${objs[i].tagName}${i}_click {
      background: ${(() => {
        let d = 50;
        let styles = window.getComputedStyle(temp[i].e);
        let bg = styles.getPropertyValue("background");
        if (bg != "auto" && !bg.includes("url") && !bg.includes("gradient")) {
          bg = bg.toString().split(")")[0];
          bg = bg.split("");
          let stylTemp = [];
          for (let q = 0; q < bg.length; q++) {
            if ((isNaN(Number(bg[q])) != true && bg[q] != " ") || bg[q] == ",")
              stylTemp.push(bg[q]);
          }
          stylTemp = stylTemp.join("").split(",");
          let r = stylTemp[0];
          let g = stylTemp[1];
          let b = stylTemp[2];
          let a = 1;
          let compile;
          if (stylTemp.length == 3) {
            if (r - d < 0) r = 0;
            else r = r - d;
            if (g - d < 0) g = 0;
            else g = g - d;
            if (b - d < 0) b = 0;
            else b = b - d;
            compile = `rgb(${r},${g},${b})`;
            return compile;
          } else if (stylTemp.length == 4) {
            if (r - d < 0) r = 0;
            else r = r - d;
            if (g - d < 0) g = 0;
            else g = g - d;
            if (b - d < 0) b = 0;
            else b = b - d;
            a = stylTemp[3];
            compile = `rgba(${r},${g},${b}, ${a})`;
            return compile;
          }
        }
      })()} !important;
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
    };
    let observer = new MutationObserver(() => {
      let i;
      let classItem;
      objs[q].e.classList.forEach((elem) => {
        if (elem.includes("set")) classItem = elem;
      });
      for (let k = 0; k < classItem.length; k++) {
        if (!isNaN(Number(classItem[k]))) i = Number(classItem[k]);
      }
      let elem = get(`.${classItem}`);
      for (let r = 0; r < objs.length; r++) {
        if (objs[r].e == elem) {
          elem = objs[r];
          break;
        }
      }
      if (get(`#_${elem.e.tagName}${i}`)) {
        get(`#_${elem.e.tagName}${i}`).remove();
      }
      let style = document.createElement("style");
      style.id = `_${elem.e.tagName}${i}`;
      let CSSclass = `.${elem.e.tagName}${i}_click {
          background: ${(() => {
            let d = 50;
            let styles = window.getComputedStyle(elem.e);
            let bg = styles.getPropertyValue("background");
            if (
              bg != "auto" &&
              !bg.includes("url") &&
              !bg.includes("gradient")
            ) {
              bg = bg.toString().split(")")[0];
              console.log(bg);
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
              let r = stylTemp[0];
              let g = stylTemp[1];
              let b = stylTemp[2];
              let a = 1;
              let compile;
              if (stylTemp.length == 3) {
                if (r - d < 0) r = 0;
                else r = r - d;
                if (g - d < 0) g = 0;
                else g = g - d;
                if (b - d < 0) b = 0;
                else b = b - d;
                compile = `rgb(${r},${g},${b})`;
                console.log("here", compile);
                return compile;
              } else if (stylTemp.length == 4) {
                if (r - d < 0) r = 0;
                else r = r - d;
                if (g - d < 0) g = 0;
                else g = g - d;
                if (b - d < 0) b = 0;
                else b = b - d;
                a = stylTemp[3];
                console.log(compile);
                compile = `rgba(${r},${g},${b}, ${a})`;
                return compile;
              }
            }
          })()};
          }
        `;
      console.log(CSSclass);
      style.append(CSSclass);
      document.head.append(style);
      console.log(
        elem.e.classList,
        window.getComputedStyle(elem.e).getPropertyValue("background")
      );
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
