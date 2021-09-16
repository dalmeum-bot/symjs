var {type, isNone, isSimilNum, isMap} = require("../util/functions");
var Fraction = require("./Fraction");
var Root = require("./Root");

Real = function (formula, map) {
  this.sign = 1;
  this.val = !isNone(formula) ? toReal(formula) : map;
};

var replacement = [];

toReal = (str) => {
  var input = str.replace(/제곱근/g, '');
  var nonB = "";
  var index = 0;

  while (input.match(/(?<=\()((-*\d+\/*\d*\(#*-*\d+\/*\d*\))|\+)+(?=\))/)) {
    nonB = input.match(/(?<=\()((-*\d+\/*\d*\(#*-*\d+\/*\d*\))|\+)+(?=\))/g)[0];
    index = input.indexOf(nonB);

    input = input.slice(0,index) + roots(nonB) + input.slice(index + nonB.length);
  }

  return roots(input, 1);
};

roots = (input, retobj) => {
  var ret = new Map();
  var lastplus = -1;
  var lastopen = 0;
  var firstnum = "";
  var secondnum = "";

  for (let i = 0; i < input.length; i++) {
    if (input[i] == "(") {
      firstnum = input.slice(lastplus + 1,i);
      lastopen = i;
    }

    if (input[i] == ")") {
      secondnum = rp(input.slice(lastopen + 1, i));
      if (ret.get(firstnum) == undefined) {
        ret.set(firstnum, [secondnum]);
      } else {
        ret.get(firstnum).push(secondnum);
      }
      lastplus = i + 1;
    }

  }

  if (retobj) return ret;
  else {
    replacement.push(ret);
    return "#" + String(replacement.length-1);
  }
};

rp = (str) => {
  if (str[0] == "#") return replacement[Number(str.slice(1))];
  else return str;
};

sumObjects = (obj1, obj2) => Object.keys(Object.assign({}, obj1, obj2)).reduce((acc, key) => {
  key1 = obj1 && obj1[key] || 0;
  key2 = obj2 && obj2[key] || 0;
  if (typeof (key1) == 'object' || typeof (key2) == 'object') {
    acc[key] = sumObjects(key1, key2);
  } else {
    acc[key] = (Array(key1) || ['0']).concat(key2 || ['0']);
  }
  return acc;
}, {});
    
sumReals = (r1, r2) => Array.from(new Map(Array.from(r1).concat(Array.from(r2))).keys()).map(String).reduce((acc, key) => {
  if (!isMap(acc)) acc = new Map();
  var key1 = r1.has(key) ? r1.get(key) : ['0'];
  var key2 = r2.has(key) ? r2.get(key) : ['0'];
  if (isMap(key1) || isMap(key2))
    acc.set(key, sumReals(key1, key2));
  else
    acc.set(key, ([key1] || ['0']).concat([key2] || ['0']));
  return acc;
});

Real.prototype = {
  type: "Real",
  isReal: true,

  add: function (R) {

  },
  sub: function (R) {

  },
  mul: function (R) {

  },
  div: function (R) {

  },
  print: function () {

  },
  simplify: function () {
    var str = JSON.stringify(this.val);
  }
};

module.exports = Real;

e(r(2, e(3)), r(3, e(7, r(4, e(2)))))