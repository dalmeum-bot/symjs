BigNumber = function (number) {
  this.n1 = 0//00000000000000;
  this.n2 = 0//00000000000000;
  this.n3 = 0//00000000000000;
};
BigNumber.prototype = {
  type: "BigNumber",
  isBigNumber: true,
};

module.exports = BigNumber;