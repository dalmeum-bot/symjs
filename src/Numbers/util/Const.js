var {type, isNone} = require("./util/type");
var func = require("./util/functions");

var Fraction = require("../class/Fraction");
var Root = require("../class/Root");
var Real = require("../class/Real");
var Complex = require("../class/Complex");
var BigNumber = require("../class/BigNumber");

function Const (name, value) {
  this.name = name;
  this.val = value;
}

var Consts = {
  pi : new Const('π', 3.14159265358979),
  e : new Const('e', 2.718)
}

module.exports = Consts;