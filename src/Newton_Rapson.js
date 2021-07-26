var f = (x) => x*x - 3*x + 2;
var f_prime = (x) => 2*x - 3;
var degree = 2;
var root = Array(degree);

var x_0 = -18;
var x = x_0;
var x_before = null;

var tole = 0.0000000000001;
var count = 0;

while (count < degree) {
  for (let i = 0; i < 50; i++) {
    console.log(`${i} try : ${x}`);
    if (Math.abs(x - x_before) < tole) break;
    
    x_before = x;
    x = x - (f(x) / f_prime(x));
  }
  root[count] = x;
  count++;
  console.log(`x_${count}= ${x}`);
}