def gcd(a, b):
  if b == 0: return a
  else: return gcd(b, a % b)

# gcd = (a, b) => (!b) ? a : gcd(b, a % b);