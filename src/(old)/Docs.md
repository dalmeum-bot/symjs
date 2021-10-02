# Numbers.js Docs

```jsx
const { factorization, gcd, lcm, Fraction, Complex } = require('Numbers');
```

위와 같이 메인 프로젝트에 모듈을 탑재할 수 있습니다.

---

## **`factorization`**

```tsx
factorization(n: (Number | String), isShow?: Boolean): (Object | String)

factorization(24) >> "2^3×3"
factorization(24, false) >> {"2": 3, "3": 1}
```

`num`을 소인수분해 하는 함수입니다.
`isShow`가 `true`일 시 `"2^2×3"`, `false`일 시 `{"2":2, "3":1}`과 같이 출력합니다.

`num`은 정수말고 유리수, 심지어는 순환소수도 가능합니다.
순환소수 `2.533333...` 은 `2.5[3]`으로 입력할 수 있습니다.

---

## `gcd`

```tsx
gcd(a: (Number | String), b: (Number | String)): Fraction

gcd(24, 48) >> {"s": 1, "n": 24, "d": 1}
gcd(24, 48).print() >> "24/1"
```

`num1`과 `num2`의 최대공약수를 반환하는 함수입니다.
반환값은 `Fraction`이기 때문에 직접 값을 보려면 `gcd(24, 48).print()`와 같이 사용해야합니다.

---

## **`lcm`**

```tsx
lcm(a: (Number | String), b: (Number | String)): Fraction

lcm(24, 48) >> {"s": 1, "n": 48, "d": 1}
lcm(24, 48).print() >> "48/1"
```

`num1`과 `num2`의 최소공배수를 반환하는 함수입니다.
반환값은 `Fraction`이기 때문에 직접 값을 보려면 `lcm(24, 48).print()`와 같이 사용해야합니다.

---

## **`Fraction`**

```tsx
new Fraction(): Fraction
new Fraction(v: (String | Number | Object)): Fraction
new Fraction(n: (String | Number), d: (String | Number)): Fraction

// ex. 분수 3.51111... = 158/45 를 만드는 법
new Fraction(158, 45)
new Fraction(158, "45")
new Fraction("158", 45)
new Fraction("158", "45")
new Fraction("15.8", 4.5)
new Fraction("3.5(1)")
new Fraction({"n": 158, "d": 45})
new Fraction("158/45")
new Fraction("158:45")
```

- `Fraction.type`

    클래스명 `Fraction`을 반환합니다.

- `Fraction.isFraction`

    `true`를 반환합니다.

- `Fraction.add(f)`

    `this`에서 `f`를 더한 분수를 반환합니다.

- `Fraction.sub(f)`

    `this`에서 `f`를 뺀 분수를 반환합니다.

- `Fraction.mul(f)`

    `this`에서 `f`를 곱한 분수를 반환합니다.

- `Fraction.div(f)`

    `this`에서 `f`를 나눈 분수를 반환합니다.

- `Fraction.mod(f)`

    `this`에서 `f`를 나눈 나머지 분수를 반환합니다.

- `Fraction.pow(f)`

    `this`를 `f`제곱한 분수를 반환합니다.

- `Fraction.reduce()`

    `this`를 약분한 분수를 반환합니다.

- `Fraction.inverse()`

    `this`를 역수를 취한 분수를 반환합니다.

- `Fraction.print()`

    `this`를 출력합니다.

- `Fraction.equals(f)`

    `this`와 `f`의 값이 같은지 비교합니다.

- `Fraction.value()`

    `this`를 `Number` 로 바꿔 근사치로 반환합니다.

- `Fraction.big(f)`

    `this` > `f`의 여부를 반환합니다.

- `Fraction.small(f)`

    `this` < `f`의 여부를 반환합니다.

---

## **`Complex`**

```tsx
new Complex(r: (String | Number), i: (String | Number)): Complex

new Complex(3, 5) >> 3 + 5𝑖
new Complex("0.6", "1.5") >> 3/5 + 3/2 𝑖
```

- `Complex.type`

    클래스명 `Complex`을 반환합니다.

- `Complex.isComplex`

    `true`를 반환합니다.

- `Complex.add(c)`

    `this`에서 `c`를 더한 복소수를 반환합니다.

- `Complex.sub(c)`

    `this`에서 `c`를 뺀 복소수를 반환합니다.

- `Complex.mul(c)`

    `this`에서 `c`를 곱한 복소수를 반환합니다.

- `Complex.div(c)`

    `this`에서 `c`를 나눈 복소수를 반환합니다.

- `Complex.print()`

    `this`를 출력합니다.

- `Complex.equals(c)`

    `this`와 `c`의 값이 같은지 비교합니다.
