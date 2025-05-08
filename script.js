"use strict";
const canvas = document.getElementById("canvas");
let cursor = get("#cursor");
let objs;
const typeOffset = 0;
let hlp = {
  setup: false,
  _type: false,
  set type(bool) {
    if (bool == false) {
      get("#helpDiv").classList.remove("cursor");
      get("#helpDiv").textContent = ">> ";
    } else if (bool) get("#helpDiv").classList.add("cursor");
    this._type = bool;
  },
  get type() {
    return this._type;
  },
};
class Calculator {
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
    this.inputNum = 0;
    this.stack = [];
    this.temp = "";
    this.lock = true;
    this.queue = [];
  }
  make() {
    const cont = get("#calculator");
    let xOffset, wNum, hNum, inOffset, endW, wH;
    document.body.insertAdjacentHTML(
      "beforeend",
      "<span id='temp' style='display:block; font-size: 1ex; margin: 0; padding: 0;position: fixed;opacity: 0;'>x</span>"
    );
    const [ex1, ex1H] = [
      get("#temp").offsetWidth * 3,
      get("#temp").offsetHeight * 3,
    ];
    get("#temp").remove();
    //topborder
    {
      const tB = create("span", "tB");
      cont.append(tB);
      let w = tB.offsetWidth;
      let nW = Math.max(Math.round(w * this.width, this.minWidth));
      let aS1 = Math.round(Math.floor((w - nW) / 2) / ex1);
      let amountP = Math.round(nW / ex1);
      (xOffset = aS1), (wNum = amountP);
      for (let i = 0; i < aS1 + amountP; i++) {
        i < aS1 ? get("#tB").append(" ") : get("#tB").append(".");
      }
    }
    //sides
    {
      let nH = Math.max(
        Math.round(window.innerHeight * this.height),
        this.minHeight
      );
      let amountV = Math.round(nH / ex1H) - 3;
      hNum = amountV;
      for (let i = 0; i < amountV; i++) {
        let row = create("span", `sB${i}`, "sideRow");
        cont.append(row);
        row = get(`#sB${i}`);
        for (let q = 0; q < xOffset + wNum; q++) {
          if (q == xOffset || q == xOffset + wNum - 1) row.append("|");
          else if (q > xOffset && q < xOffset + wNum) row.append("#");
          else row.append(" ");
        }
      }
    }
    //bottombottomborder
    {
      let bB = create("span", "bB");
      cont.append(bB);
      for (let i = 0; i < xOffset + wNum; i++) {
        i < xOffset ? get("#bB").append(" ") : get("#bB").append(".");
      }
    }
    //textWindow
    {
      //top of window
      let w = Math.round(wNum * this.wWidth);
      let rW = Math.round((wNum - w) / 2);
      let top = get("#sB0").textContent.split("");
      let wOffset = xOffset + rW;
      let t = wOffset + w;
      for (let i = 0; i < t; i++) {
        if (i == wOffset) top.splice(i, 0, "<span id='interspan'>");
        if (i == wOffset + w - 1) top.splice(i, 0, "</span>");
      }
      get("#sB0").innerHTML = top.join("");
      let h = Math.round(hNum / (this.wHeight / ex1H));
      (inOffset = rW), (wH = h);
      let inters = Array.from({ length: h - 1 }, (v, i) => {
        return get(`#sB${i + 1}`);
      });
      inters.forEach((e) => {
        e.classList.add("windowBox");
      });
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
                  "<span class='overscore'>|<span class='box1topRow' onclick='btnFunction(0)'>";
              if (i == t - 3) txt[i] = "</span>|</span>";
            } else if (q == fR.length - 1) {
              if (i == wOffset)
                txt[i] =
                  "<span class='underscore'>|<span class='box1topRow' onclick='btnFunction(0)'>";
              if (i == t - 3) txt[i] = "</span>|</span>";
            } else {
              if (i == wOffset)
                txt[i] = "|<span class='box1topRow' onclick='btnFunction(0)'>";
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
                    "<span class='overscore'><span class='box1topRow' onclick='btnFunction(x)'>"
                      .length
                ] = `</span>|<span class="box${
                  i + 2
                }topRow" onclick="btnFunction(${i + 1})">`;
              else if (q == fR.length - 1)
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='underscore'><span class='box1topRow' onclick='btnFunction(x)'>"
                      .length
                ] = `</span>|<span class="box${
                  i + 2
                }topRow" onclick="btnFunction(${i + 1})">`;
              else
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='box1topRow' onclick='btnFunction(x)'>".length
                ] = `</span>|<span class="box${
                  i + 2
                }topRow" onclick="btnFunction(${i + 1})">`;
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
                  "<span class='overscore'>|<span class='box1downRow' onclick='btnFunction(5)'>";
              if (i == t - 3) txt[i] = "</span>|</span>";
            } else if (q == bR.length - 1) {
              if (i == wOffset)
                txt[i] =
                  "<span class='underscore'>|<span class='box1downRow' onclick='btnFunction(5)'>";
              if (i == t - 3) txt[i] = "</span>|</span>";
            } else {
              if (i == wOffset)
                txt[i] = "|<span class='box1downRow' onclick='btnFunction(5)'>";
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
              if (q == 0) {
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='overscore'><span class='box1downRow' onclick='btnFunction(x)'>"
                      .length
                ] = `</span>|<span class="box${
                  i + 2
                }downRow" onclick="btnFunction(${i + 6})">`;
              } else if (q == bR.length - 1)
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='underscore'><span class='box1downRow' onclick='btnFunction(x)'>"
                      .length
                ] = `</span>|<span class="box${
                  i + 2
                }downRow" onclick="btnFunction(${i + 6})">`;
              else
                content[
                  z +
                    xOffset +
                    inOffset +
                    "<span class='box1downRow' onclick='btnFunction(x)'>".length
                ] = `</span>|<span class="box${
                  i + 2
                }downRow" onclick="btnFunction(${i + 6})">`;
            }
          }
        }
        bR[q].innerHTML = content.join("");
      }
    }
    //btn graphics
    {
      let divs = Array.from(
        document.querySelectorAll("span[onclick^='btnFunction(']")
      );
      let rows = [];
      let divClasses = [];
      for (let i = 0; i < divs.length; i++) {
        let classA = Array.from(divs[i].classList);
        for (let i = 0; i < classA.length; i++) {
          if (classA[i].includes("box")) {
            classA = classA[i];
            break;
          }
        }
        divClasses.push(classA);
      }
      //got classes
      let num = 0;
      for (let i = 0; i < divClasses.length; i++) {
        if (!rows.includes(divClasses[i])) {
          rows.push(divClasses[i]);
          num++;
        }
      }
      rows = new Array(num);
      for (let q = 0; q < rows.length; q++) {
        rows[q] = [];
      }
      for (let i = 0; i < divs.length; i++) {
        let classes = Array.from(divs[i].classList);
        let Class;
        for (let q = 0; q < classes.length; q++) {
          if (classes[q].includes("box")) {
            Class = classes[q];
            break;
          }
        }
        let subNum = 0;
        for (let z = 0; z < Class.length; z++) {
          if (isNaN(Number(Class[z])) == false) {
            subNum = Number(Class[z] - 1);
            break;
          }
        }
        if (Class.includes("down")) subNum += 4;
        rows[subNum].push(divs[i]);
      }
      //btns now separate
      for (let i = 0; i < rows.length; i++) {
        let midrow = rows[i][Math.floor(rows[i].length / 2)];
        let horiz = midrow.textContent.split("");
        let index = Math.floor(horiz.length / 2);
        horiz[index] = this.buttons[i];
        let classes = Array.from(midrow.classList);
        for (let q = 0; q < classes.length; q++) {
          if (classes[q].includes("down")) {
            horiz[index] = this.buttons[i + 1];
          }
        }
        if (this.buttons[i] == "Clr") {
          horiz[index - 1] = "C";
          horiz[index] = "l";
          horiz[index + 1] = "r";
        }
        midrow.textContent = horiz.join("");
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
    //line starts
    {
      let ps = Array.from(document.querySelectorAll("#calculator span"));
      for (let i = 0; i < ps.length; i++) {
        let txt = ps[i].innerHTML.split("");
        txt[0] = ">";
        txt[1] = ">";
        ps[i].innerHTML = txt.join("");
      }
    }
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Backspace":
          this.btnPress(0);
          break;
        case "Enter":
          this.btnPress(1);
          break;
        case "+":
          this.btnPress(2);
          break;
        case "*":
          this.btnPress(3);
          break;
        case "^":
          this.btnPress(5);
          break;
        case "<":
          this.btnPress(6);
          break;
        case "1":
          this.btnPress(7);
          break;
        case "Alt":
          this.btnPress(8);
          break;
      }
    });
    helpBuild();
  }
  solve(button, l) {
    let [op2, op1] = [this.stack[l - 1], this.stack[l - 2]];
    if (!op1 || !op2) alert("inadequate arguments");
    else {
      let result;
      switch (button) {
        case "+":
          result = op1 + op2;
          break;
        case "*":
          result = op1 * op2;
          break;
        case "^":
          result = Math.pow(op1, op2);
          break;
      }
      let str = this.stack.join(",");
      str += `${result},`;
      if (str.length > this.maxChar) alert("overflow error");
      else {
        this.stack.push(result);
        this.stack.splice(this.stack.lastIndexOf(op1), 1);
        this.stack.splice(this.stack.lastIndexOf(op2), 1);
      }
      this.lock = false;
    }
  }
  btnPress(btn) {
    const button = this.buttons[btn];
    const display = Array.from(document.querySelectorAll(".windowBox"));
    const textRow = display[Math.round(display.length / 2) - 1];
    if (display.length == 1) textRow = display[0];
    let temp = textRow.textContent.split("|");
    let txt = temp[2].split("").slice(1);
    let l = this.stack.length;
    this.maxChar = txt.length - 1;
    switch (button) {
      case "Clr":
        this.stack.pop();
        this.temp = "";
        this.drawStack(txt, temp, textRow);
        break;
      case "<":
        if (l < 2) break;
        [this.stack[l - 2], this.stack[l - 1]] = [
          this.stack[l - 1],
          this.stack[l - 2],
        ];
        this.drawStack(txt, temp, textRow);
        break;
      case "±":
        if (l < 1) break;
        if (!isNaN(Number(this.stack[l - 1])))
          this.stack[l - 1] = -this.stack[l - 1];
        this.drawStack(txt, temp, textRow);
        break;
      case "!":
        if (this.temp.length < 1) break;
        this.stack.push(Number(this.temp));
        if (this.temp == "0") alert(this.temp);
        this.temp = "";
        this.drawStack(txt, temp, textRow);
        break;
      case "1":
        this.temp += "1";
        let i = txt.indexOf(" ");
        txt[i] = "1";
        this.inputNum++;
        temp[2] = " " + txt.join("");
        textRow.textContent = temp.join("|");
        break;
      default:
        if (!this.lock) break;
        this.solve(button, l);
        this.drawStack(txt, temp, textRow);
        this.lock = true;
        break;
    }
  }
  drawStack(txt, temp, textRow) {
    let calcWindow = new Array(txt.length);
    calcWindow[0] = this.stack.join(",") + ",";
    if (this.stack.length < 1) calcWindow[0] = "";
    calcWindow = calcWindow.join("").split("");
    let diff = txt.length - calcWindow.length;
    if (diff > 0) calcWindow.push(...Array(diff).fill(" "));
    else calcWindow -= -diff;
    temp[2] = " " + calcWindow.join("");
    textRow.textContent = temp.join("|");
  }
}
let CALC = new Calculator(
  ["Clr", "!", "+", "*", false, "^", "<", "1", "±"],
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
  setTimeout(() => {
    get("#text").classList.remove("cursor");
    get("#begin").append(">>");
    get("#begin").classList.add("cursor");
    type(" Type /begin to start and press Enter", get("#begin"));
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
    }, " Type /begin to start and press Enter".length * typeOffset + 1000);
  }, m1.length * typeOffset + 1000);
});
function get(arg) {
  return document.querySelector(arg);
}
function create(tag, id = "", ...cls) {
  const e = document.createElement(tag);
  e.id = id;
  cls.length > 0 ? e.classList.add(...cls) : (e.className = "");
  return e;
}
function build() {
  objs = [];
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
        cClass.forEach((Class) => {
          if (Class.indexOf("c") == 0 && Class != "cursor") {
            let t = Class.split("-");
            t[0] = t[0].substring(1);
            t.forEach((elem, i, arr) => {
              if (elem.length == 3 && !isNaN(Number(elem))) color.push(elem);
              else if ((i = arr.length - 1)) color.push(elem);
            });
          }
        });
        return color;
      })(),
      hBg: (() => {
        let hClass = Array.from(objs[i].classList);
        let color = [];
        hClass.forEach((Class) => {
          if (Class.indexOf("h") == 0) {
            let t = Class.split("-");
            t[0] = t[0].substring(1);
            t.forEach((elem, i, arr) => {
              if (elem.length == 3 && !isNaN(Number(elem))) color.push(elem);
              else if ((i = arr.length - 1)) color.push(elem);
            });
          }
        });
        return color;
      })(),
      init: function () {
        this.e.setAttribute("style", `background: rgba(${this.bg.join(",")})`);
        if (this.e.getAttribute("onclick")) {
          this.inFunc = function () {
            eval(this.e.getAttribute("onclick"));
          };
          this.hasFunc = true;
        } else {
          this.inFunc = function () {
            hlp.type = false;
          };
          this.hasFunc = false;
        }
      },
    };
    const style = create("style", `_${objs[i].tagName}${i}`);
    temp[i].cL = `${objs[i].tagName}${i}_click`;
    temp[i].name = `${objs[i].tagName}${i}`;
    temp[i].e.classList.add(temp[i].name);
    temp[i].e.setAttribute("data-idef", temp[i].name);
    style.append(`
      .${temp[i].name}_click {
        background: ${(() => {
          const d = 50;
          const sTemp = temp[i].hBg;
          let [r, g, b, a] = sTemp;
          if (sTemp.length == 4) {
            r - d < 0 ? (r = 0) : (r = r - d);
            g - d < 0 ? (g = 0) : (g = g - d);
            b - d < 0 ? (b = 0) : (b = b - d);
            return `rgba(${r},${g},${b}, ${a})`;
          }
        })()} !important;
      }
      .${temp[i].name}.focus {
        background: rgba(${temp[i].hBg.join(",")});
      }
    `);
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
}
function visualDivide() {
  for (let i = 0; i < objs.length; i++) {
    ctx.fillStyle = "rgba(0,0,0,.2)";
    ctx.fillRect(objs[i].x, objs[i].y, objs[i].w, objs[i].h);
    ctx.stroke();
  }
}
function btnFunction(selector) {
  CALC.btnPress(selector);
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
  let helpP = Array.from(document.querySelectorAll(".pHelp"));
  for (let i = 0; i < helpP.length; i++) {
    helpP[i].classList.add("d-none");
  }
  CALC.make();
}
function buildSetup() {
  build();
  canvas.addEventListener("mousedown", (event) => {
    objs.forEach((elem) => {
      let c = elem.tBounds;
      if (event.x >= c.tL.x && event.x <= c.tR.x) {
        if (event.y >= c.tL.y && event.y <= c.bL.y) {
          elem.inFunc();
        }
      }
    });
  });
  canvas.addEventListener("mousemove", (event) => {
    for (let i = 0; i < objs.length; i++) {
      let c = objs[i].tBounds;
      if (event.x >= c.tL.x && event.x <= c.tR.x) {
        if (event.y >= c.tL.y && event.y <= c.bL.y) {
          if (objs[i].hasFunc == true) {
            canvas.classList.add("pointer");
            if (!objs[i].e.classList.contains("syncFocus")) {
              objs[i].e.classList.add("syncFocus");
              syncFocus(objs[i].e);
            }
            break;
          }
        }
      }
      canvas.classList.remove("pointer");
      if (objs[i].e.classList.contains("syncFocus")) {
        objs[i].e.classList.remove("syncFocus");
        syncFocus(objs[i].e);
      }
    }
  });
  window.addEventListener("resize", build());
}
function syncFocus(target) {
  let classes = target.classList;
  let idef;
  for (let i = 0; i < classes.length; i++) {
    if (classes[i].includes("box") && classes[i].includes("Row")) {
      idef = classes[i];
      break;
    }
  }
  let btnBits = Array.from(document.querySelectorAll(`.${idef}`));
  if (target.classList.contains("syncFocus")) {
    for (let i = 0; i < btnBits.length; i++) {
      btnBits[i].removeAttribute("style");
      btnBits[i].classList.add("focus");
    }
  } else {
    for (let i = 0; i < btnBits.length; i++) {
      btnBits[i].classList.remove("focus");
      btnBits[i].setAttribute(
        "style",
        `background: rgba(${objs[i].bg.join(",")});`
      );
    }
  }
}
function helpBuild() {
  let helpP = document.createElement("p");
  helpP.id = "helpDiv";
  get("#calculator").insertAdjacentHTML(
    "beforeend",
    "<p id='prehelp'>>> </p><br>"
  );
  type("Click below and type /help for help and press Enter", get("#prehelp"));
  get("#prehelp").classList.add("cursor");
  setTimeout(
    () => {
      //<outerP onclick="helpActivate()"><helpP></helpP></outerP>
      let outerP = document.createElement("span");
      outerP.id = "outerP";
      get("#calculator").append(outerP);
      get("#outerP").append(helpP);
      helpP = get("#helpDiv");
      helpP.textContent = ">> ";
      get("#outerP").setAttribute("onclick", "helpActivate()");
      get("#prehelp").classList.remove("cursor");
      buildSetup();
    },
    "Click below and type /help for help and press Enter".length * typeOffset +
      1000,
    helpP
  );
}
function helpActivate() {
  let div = get("#helpDiv");
  hlp.type ? (hlp.type = false) : (hlp.type = true);
  if (hlp.setup == false) {
    window.addEventListener("keydown", (event) => {
      if (hlp.type == true) {
        let key = event.key;
        if (key == "Enter" || key.textContent == ">> /help") {
          alert(
            "<-------HELP MENU------->\n\n  1. This calculator uses STACK ARITHMETIC, not CONVENTIONAL ARITHMETIC\n  2. STACK ARITHMETIC functions like this: number, number, operation\n  3. Examples: 1,1,+ = 2, 3,3,* = 9\n  4. The calculator is keyboard operated as well\n  5. Enter (the '!' button) must be pressed to confirm your inputted number, otherwise it will be wiped immediately\n  6. Clr clears most recent number \n  7. ± (Alt key) changes the number sign\n  8. < swaps the top two (most recent two) numbers of the equation\n  9. All other keys match their button\n  10. More examples: 1,1,1,++ = 3, 1,1,+1,1,+^ = 4\n  11. All operations are performed immediately after the operation is triggered, thus not needing parentheses"
          );
          hlp.type = false;
        } else if (key == "Backspace" && div.textContent != ">> ") {
          let txt = div.textContent.split("");
          txt.splice(txt.length - 1, 1);
          div.textContent = txt.join("");
        } else if (key.match(/[a-zA-Z]/) || key == "/") {
          if (key.length == 1) div.append(event.key);
        }
      }
    });
    hlp.setup = true;
  }
}
