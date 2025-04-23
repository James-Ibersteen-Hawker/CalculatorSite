"use strict";
const canvas = document.getElementById("canvas");
let cursor = get("#cursor");
let objs;
let typeOffset = 0;
class Calculator {
  //what properties would a calculator have?
  buttons;
  width;
  minWidth;
  height;
  minHeight;
  wWidth;
  wHeight;
  bHeight;
  constructor(
    buttons,
    width,
    minWidth,
    height,
    minHeight,
    wWidth,
    wHeight,
    bHeight
  ) {
    this.buttons = buttons;
    this.width = width;
    this.minWidth = minWidth;
    this.height = height;
    this.minHeight = minHeight;
    this.wWidth = wWidth;
    this.wHeight = wHeight;
    this.bHeight = bHeight;
  }
  make() {
    let cont = get("#calculator");
    let temp = document.createElement("span");
    temp.setAttribute(
      "style",
      "display:block; font-size: 1ex; margin: 0; padding: 0;position: fixed;opacity: 0;"
    );
    temp.textContent = "x";
    temp.id = "temp";
    document.body.append(temp);
    let ex1 = get("#temp").offsetWidth;
    let ex1H = get("#temp").offsetHeight;
    let xOffset;
    let wNum;
    let hNum;
    let inOffset;
    let endW;
    let wH;
    get("#temp").remove();
    //topborder
    {
      let topBorder = document.createElement("span");
      topBorder.id = "tB";
      cont.append(topBorder);
      let w = topBorder.offsetWidth;
      let nW = Math.round(w * this.width);
      if (nW < this.minWidth) nW = this.minWidth;
      let split = Math.floor((w - nW) / 2);
      let aS1 = Math.round(split / (ex1 * 3));
      let amountP = Math.round(nW / (ex1 * 3));
      xOffset = aS1;
      wNum = amountP;
      for (let i = 0; i < aS1 + amountP; i++) {
        if (i < aS1) {
          get("#tB").append(" ");
        } else get("#tB").append(".");
      }
    }
    //sides
    {
      let nH = Math.round(window.innerHeight * this.height);
      if (nH < this.minHeight) nH = this.minHeight;
      let amountV = Math.round(nH / (ex1H * 3)) - 3;
      hNum = amountV;
      for (let i = 0; i < amountV; i++) {
        let row = document.createElement("span");
        row.id = `sB${i}`;
        cont.append(row);
        row = get(`#sB${i}`);
        row.classList.add("sideRow");
        for (let q = 0; q < xOffset + wNum; q++) {
          if (q == xOffset || q == xOffset + wNum - 1) row.append("|");
          else if (q > xOffset && q < xOffset + wNum) row.append("#");
          else row.append(" ");
        }
      }
    }
    //bottombottomborder
    {
      let bottomBorder = document.createElement("span");
      bottomBorder.id = "bB";
      cont.append(bottomBorder);
      for (let i = 0; i < xOffset + wNum; i++) {
        if (i < xOffset) {
          get("#bB").append(" ");
        } else get("#bB").append(".");
      }
    }
    //textWindow
    {
      //top of window
      let w = Math.round(wNum * this.wWidth);
      let rW = Math.round((wNum - w) / 2);
      inOffset = rW;
      let top = get("#sB0").textContent.split("");
      let wOffset = xOffset + rW;
      let t = wOffset + w;
      for (let i = 0; i < t; i++) {
        if (i == wOffset) top.splice(i, 0, "<span id='interspan'>");
        if (i == wOffset + w - 1) top.splice(i, 0, "</span>");
      }
      get("#sB0").innerHTML = top.join("");
      let h = Math.round(hNum / (this.wHeight / (ex1H * 3)));
      wH = h;
      let inters = [];
      for (let i = 1; i < h; i++) {
        inters.push(get(`#sB${i}`));
      }
      endW = inters.length + 1;
      for (let i = 0; i < inters.length; i++) {
        let current = inters[i].textContent.split("");
        for (let q = 0; q < t; q++) {
          if (q == wOffset || q == t - 3) current[q] = "|";
          else if (q > wOffset && q < t - 3) current[q] = " ";
        }
        inters[i].innerHTML = current.join("");
      }
      let bottom = get(`#sB${1 + inters.length}`);
      let txt = bottom.textContent.split("");
      for (let q = 0; q < t; q++) {
        if (q == wOffset) txt.splice(q, 0, "<span id='bInterspan'>");
        else if (q == t - 1) txt.splice(q, 0, "</span>");
      }
      bottom.innerHTML = txt.join("");
    }
    //buttons
    {
      let row1 = this.buttons.slice(0, this.buttons.indexOf(false));
      let w = Math.round(wNum * this.wWidth);
      let bW = Math.floor(w / row1.length);
      let rW = Math.round((wNum - w) / 2);
      let sI = wH + 1;
      let wOffset = xOffset + rW;
      let t = wOffset + w;
      let height = Math.round(hNum * this.bHeight);
      let inters = [];
      for (let i = sI; i < height + sI; i++) {
        inters.push(get(`#sB${i}`));
      }
      let fR = inters.slice(0, Math.round(inters.length / 2));
      for (let q = 0; q < fR.length; q++) {
        let txt = inters[q].textContent.split("");
        for (let i = 0; i < t; i++) {
          if (i == wOffset || i == t - 3) {
            if (q == 0) {
              if (i == wOffset)
                txt[i] =
                  "<span class='overscore'>|<span class='box1topRow' onclick='btnFunction()'>";
              if (i == t - 3) txt[i] = "</span>|</span>";
            } else if (q == fR.length - 1) {
              if (i == wOffset)
                txt[i] =
                  "<span class='underscore'>|<span class='box1topRow' onclick='btnFunction()'>";
              if (i == t - 3) txt[i] = "</span>|</span>";
            } else {
              if (i == wOffset)
                txt[i] = "|<span class='box1topRow' onclick='btnFunction()'>";
              else if (i == t - 3) txt[i] = "</span>|";
            }
          } else if (i > wOffset && i < t - 3) txt[i] = " ";
        }
        fR[q].innerHTML = txt.join("");
      }
      for (let q = 0; q < fR.length; q++) {
        let txt = fR[q].textContent.split("|").slice(2);
        txt.splice(1, 2);
        txt = txt[0];
        let content = fR[q].innerHTML.split("");
        let incr = Math.round(txt.length / row1.length);
        for (let i = 0; i < row1.length; i++) {
          for (let z = 0; z < txt.length; z++) {
            if (z == incr * (i + 1) && i != row1.length - 1) {
              if (q == 0)
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='overscore'><span class='box1topRow' onclick='btnFunction()'>"
                      .length
                ] = `</span>|<span class="box${
                  i + 2
                }topRow" onclick="btnFunction()">`;
              else if (q == fR.length - 1)
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='underscore'><span class='box1topRow' onclick='btnFunction()'>"
                      .length
                ] = `</span>|<span class="box${
                  i + 2
                }topRow" onclick="btnFunction()">`;
              else
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='box1topRow' onclick='btnFunction()'>".length
                ] = `</span>|<span class="box${
                  i + 2
                }topRow" onclick="btnFunction()">`;
            }
          }
        }
        fR[q].innerHTML = content.join("");
      }
      let bR = inters.slice(Math.round(inters.length / 2), inters.length);
      for (let q = 0; q < bR.length; q++) {
        let txt = inters[q].textContent.split("");
        for (let i = 0; i < t; i++) {
          if (i == wOffset || i == t - 3) {
            if (q == 0) {
              if (i == wOffset)
                txt[i] =
                  "<span class='overscore'>|<span class='box1downRow' onclick='btnFunction()'>";
              if (i == t - 3) txt[i] = "</span>|</span>";
            } else if (q == bR.length - 1) {
              if (i == wOffset)
                txt[i] =
                  "<span class='underscore'>|<span class='box1downRow' onclick='btnFunction()'>";
              if (i == t - 3) txt[i] = "</span>|</span>";
            } else {
              if (i == wOffset)
                txt[i] = "|<span class='box1downRow' onclick='btnFunction()'>";
              else if (i == t - 3) txt[i] = "</span>|";
            }
          } else if (i > wOffset && i < t - 3) txt[i] = " ";
        }
        bR[q].innerHTML = txt.join("");
      }
      for (let q = 0; q < bR.length; q++) {
        let txt = bR[q].textContent.split("|").slice(2);
        txt.splice(1, 2);
        txt = txt[0];
        let content = bR[q].innerHTML.split("");
        let incr = Math.round(txt.length / row1.length);
        for (let i = 0; i < row1.length; i++) {
          for (let z = 0; z < txt.length; z++) {
            if (z == incr * (i + 1) && i != row1.length - 1) {
              if (q == 0)
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='overscore'><span class='box1downRow' onclick='btnFunction()'>"
                      .length
                ] = `</span>|<span class="box${
                  i + 2
                }downRow" onclick="btnFunction()">`;
              else if (q == bR.length - 1)
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='underscore'><span class='box1downRow' onclick='btnFunction()'>"
                      .length
                ] = `</span>|<span class="box${
                  i + 2
                }downRow" onclick="btnFunction()">`;
              else
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='box1downRow' onclick='btnFunction()'>".length
                ] = `</span>|<span class="box${
                  i + 2
                }downRow" onclick="btnFunction()">`;
            }
          }
        }
        bR[q].innerHTML = content.join("");
      }
    }
    //assign color classes for build
    {
      let btns = Array.from(
        document.querySelectorAll("span[onclick^='btnFunction(']")
      );
      for (let i = 0; i < btns.length; i++) {
        let bg = window
          .getComputedStyle(btns[i])
          .getPropertyValue("background");
        bg = bg.split(")")[0];
        bg = bg.split("(")[1];
        bg = bg.split(" ").join("").split(",");
        if (bg.length == 3) bg.push("1");
        for (let q = 0; q < bg.length; q++) {
          let elem = bg[q].split("");
          for (let z = 0; z < elem.length; z++) {
            elem[z] = elem[z].toString();
          }
          if (elem.length != 3 && q != bg.length - 1) {
            if (elem.length == 2) {
              elem.splice(0, 0, "0");
            } else {
              elem.splice(0, 0, "0");
              elem.splice(0, 0, "0");
            }
          }
          bg[q] = elem.join("");
        }
        btns[i].classList.add(`c${bg[0]}-${bg[1]}-${bg[2]}-${bg[3]}`);
        btns[i].classList.add(
          `h${bg[0]}-${bg[1]}-${bg[2]}-${Number(bg[3]) + 0.2}`
        );
      }
    }
    buildSetup();
  }
  solve(equation) {
    alert(eval(equation));
  }
  btnPress(btn) {
    alert(this.buttons[btn]);
  }
}
let CALC = new Calculator(
  ["π", "^", "×", "-", false, "(", ")", "-1", "✓"],
  0.6,
  450,
  0.7,
  600,
  0.9,
  120,
  0.5
);
window.addEventListener("DOMContentLoaded", function () {
  let m1 = " JavaScript Terminal Calculator";
  type(m1, get("#text"));
  begin();
  setTimeout(() => {
    get("#text").classList.remove("cursor");
    get("#begin").append(">>");
    get("#begin").classList.add("cursor");
    type(" Type /begin to start", get("#begin"));
    setTimeout(() => {
      get("#textInput1").append(">> ");
      get("#begin").classList.remove("cursor");
      get("#textInput1").classList.add("cursor");
      window.addEventListener("keydown", (event) => {
        if (
          get("#textInput1").textContent.length - 3 > 15 &&
          event.key != "Backspace"
        )
          return;
        if (!get("#textInput1").classList.contains("d-none")) {
          let bx = get("#textInput1");
          let inp = bx.textContent;
          if (event.key.match(/[a-zA-Z\.\,\/\\]/) && event.key.length == 1)
            bx.append(event.key);
          else if (event.key == "Backspace" && inp != ">> ")
            bx.textContent = inp.substring(0, inp.length - 1);
          if (event.key == "Enter")
            if ("/" + inp.substring(4).toLowerCase() == "/begin") begin();
        }
      });
    }, " Type /begin to start".length * typeOffset + 1000);
  }, m1.length * typeOffset + 1000);
});
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
function btnFunction() {
  console.log("testing buttonFunction!");
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
      typeOffset * i,
      arg,
      i
    );
  }
}
function begin() {
  get("#intro").classList.add("d-none");
  get("#textInput1").classList.add("d-none");
  CALC.make();
}
function buildSetup() {
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
  window.addEventListener("resize", build());
}
