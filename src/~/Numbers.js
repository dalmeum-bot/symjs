var {type, isNone, isSimilNum} = require("./util/type");
var F = require("./util/functions");
var {pi, e} = require("./util/Const");

var Fraction = require("./class/Fraction");
var Root = require("./class/Root");
var Real = require("./class/Real");
var Complex = require("./class/Complex");
var BigNumber = require("./class/BigNumber");

module.exports = {
  Fraction: Fraction,
  Root: Root,
  Real: Real,
  Complex: Complex,
  BigNumber: BigNumber,
  type : type,
  func : func
};
