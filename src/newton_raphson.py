def f(x): return x**2 - x + 3
def fp(x): return 2*x - 1

count = 0
root = []
x_0 = 1 + 2j # 초깃값

x_before = 0 + 0j
x = x_0

for i in range(50):
  print(f"{i} try: {x}")
  
  x_before = x
  x = x - (f(x) / fp(x))

print(f"root: {x}")