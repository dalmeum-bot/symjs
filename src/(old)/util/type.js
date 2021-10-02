//var math = require("./util/functions");

var Fraction = require("../class/Fraction");
var Root = require("../class/Root");
var Real = require("../class/Real");
var Complex = require("../class/Complex");
var BigNumber = require("../class/BigNumber");

Number.prototype.type = "Number";
Object.prototype.type = "Object";
Map.prototype.type = "Map";
String.prototype.type = "String";
Array.prototype.type = "Array";
Date.prototype.type = "Date";
Function.prototype.type = "Function";
Boolean.prototype.type = "Boolean";
RegExp.prototype.type = "Regex";

isNumber = (n) => n.type === "Number";
isBigNumber = (b) => b.type === "BigNumber";
isComplex = (c) => c.type === "Complex";
isFraction = (f) => f.type === "Fraction";
isRoot = (r) => r.type === "Root";
isReal = (R) => R.type === "Real";
isArray = (a) => a.type === "Array";
isString = (s) => s.type === "String";
isObject = (o) => o.type === "Object";
isMap = (m) => m.type === "Map";
isRegex = (g) => g.type === "Regex";
isDate = (d) => d.type === "Date";
isBoolean = (B) => B.type === "Boolean";
isNull = (N) => N === null;
isUndefined = (u) => u === undefined;
isNone = (e) => e == null;
isSimilNum = (sn) => sn.type === "Number" || sn.type === "String";

type = (p) => {
  if (isNaN(p)) return "NaN";
  if (isNumber(p)) return "Number";
  if (isBigNumber(p)) return "BigNumber";
  if (isComplex(p)) return "Complex";
  if (isFraction(p)) return "Fraction";
  if (isRoot(p)) return "Root";
  if (isReal(p)) return "Real";
  if (isArray(p)) return "Array";
  if (isString(p)) return "String";
  if (isObject(p)) return "Object";
  if (isMap(p)) return "Map";
  if (isRegex(p)) return "Regex";
  if (isDate(p)) return "Date";
  if (isBoolean(p)) return "Boolean";
  if (isNull(p)) return "Null";
  if (isUndefined(p)) return "Undefined";

  return "?";
};

module.exports = {
  type: type,
  isNumber : isNumber,
  isBigNumber : isBigNumber,
  isComplex : isComplex,
  isFraction : isFraction,
  isRoot : isRoot,
  isReal : isReal,
  isArray : isArray,
  isString : isString,
  isObject : isObject,
  isMap : isMap,
  isRegex : isRegex,
  isDate : isDate,
  isBoolean : isBoolean,
  isNull : isNull,
  isUndefined : isUndefined,
  isNone : isNone,
  isSimilNum : isSimilNum
};