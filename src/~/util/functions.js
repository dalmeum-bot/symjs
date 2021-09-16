var {type, isNone} = require("./util/type");
var func = require("./util/functions");

var Fraction = require("../class/Fraction");
var Root = require("../class/Root");
var Real = require("../class/Real");
var Complex = require("../class/Complex");
var BigNumber = require("../class/BigNumber");

fact = (num, isShow) => {
  if (isShow == null) isShow = true;
  var n = new Fraction(num);
  var factored = {};

  // 부호
  if (n.s < 0) factored[-1] = 1;

  // 분자 소인수분해
  for (let i = 2; i * i <= new Fraction(num).n; i++) {
    if (i !== 2 && i % 2 === 0) continue;
    while (n.n % i === 0) {
      n.n /= i;
      (factored[i] == null) ? factored[i] = 1 : factored[i]++;
    }
  }
  if (factored[n.n] == null && n.n > 1) factored[n.n] = 1;

  // 분모 소인수분해
  for (let i = 2; i * i <= new Fraction(num).d; i++) {
    if (i !== 2 && i % 2 === 0) continue;
    while (n.d % i === 0) {
      n.d /= i;
      (factored[i] == null) ? factored[i] = -1 : factored[i]--;
    }
  }
  if (factored[n.d] == null && n.d > 1) factored[n.d] = -1;

  if (!isShow) {
    return factored;
  } else {
    var str = "";
    Object.keys(factored).forEach((v) => {
      if (factored[v] === 1) {
        str += v + "×";
      } else {
        str += v + "^" + factored[v] + "×";
      }
    });

    return str.slice(0, -1);
  }
};
single_gcd = (a, b) => {
  var a_ftz = a.type === 'Fraction' ? a : fact(a, false);
  var b_ftz = b.type === 'Fraction' ? b : fact(b, false);
  var gcd_ftz = {};

  Object.keys(a_ftz).filter((val) => {
    if (Object.keys(b_ftz).includes(val)) {
      gcd_ftz[val] = Math.min(a_ftz[val], b_ftz[val]);
    }
  });

  let ret = new Fraction(1);
  if (gcd_ftz === {}) return ret; // 서로소

  Object.keys(gcd_ftz).forEach((val) => {
    if (gcd_ftz[val] > 0) ret.n *= Math.pow(val, gcd_ftz[val]);
    else if (gcd_ftz[val] < 0) ret.d *= Math.pow(val, -1 * gcd_ftz[val]);
  })
  return ret;
};
single_lcm = (a, b) => {
  var m = new Fraction(a).mul(new Fraction(b));
  return m.div(single_gcd(a, b));
};
gcd = function () {
  var args = Array.from(arguments);
  var result = single_gcd(args[0], args[1]);
  for (let i = 2; i < args.length; i++) {
    result = single_gcd(result, args[i]);
  }
  return result.value();
};
lcm = function () {
  var args = Array.from(arguments);
  var result = single_lcm(args[0], args[1]);
  for (let i = 2; i < args.length; i++) {
    result = single_lcm(result, args[i]);
  }
  return result.value();
};
gc = (a, b) => (!b) ? a : gc(b, a % b);
lc = (a, b) => (a * b) / gc(a, b);

abs = (n) => {

};

pow = (n, p) => {
  p = new Fraction(p);
  
};

random = (s, e) => {
  s = Math.ceil(s);
  e = Math.floor(e);
  return Math.floor(Math.random() * (e - s + 1)) + s;
};

module.exports = {
  fact : fact,
  gcd : gcd,
  lcm : lcm,
  gc : gc,
  lc : lc,
  abs : abs,
  pow : pow,
  random : random
};