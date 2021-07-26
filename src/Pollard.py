from math import gcd

n = int(input('input n: '));
x = 2
y = 2
d = 1

while d == 1:
  x = (x ** 2 + 1) % n
  y = (((y ** 2 + 1) % n) ** 2 + 1) % n
  d = gcd(abs(x - y), n)

if d == n:
  print('fail')
else:
  print(d)