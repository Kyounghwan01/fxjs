const log = console.log;
const products = [
  { name: "반팔티", price: 15000 },
  { name: "긴팔", price: 13000 },
  { name: "바지", price: 30000 }
];

const map = (f, iter) => {
  let res = [];
  for (const a of iter) {
    // 함수형 프로그래밍은 어떤 값(name or price)을 수집하는지 명령하지 않고 추상화 시킨다
    // res.push(p.name);
    res.push(f(a));
  }
  return res;
};

console.log(map(p => p.name, products));

// 함수형 프로그래밍에서는 함수가 인자와 리턴값으로 소통을 권장
// 전역적으로 변화일으키는 것을 싫어함
let m = new Map();
m.set("a", 20);
m.set("b", 30);
console.log(new Map(map(([k, a]) => [k, a * 2], m)));

const filter = (f, iter) => {
  let res = [];
  for (const a of iter) {
    if (f(a)) res.push(a);
  }
  return res;
};

// 보조함수를 전달하여 어떤 값 매핑할지 정의 - 고차함수
console.log(...filter(p => p.price < 20000, products));
console.log(filter(el => el % 2, [1, 2, 3, 4]));
console.log(
  filter(
    el => el % 2,
    (function* () {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
      yield 5;
    })()
  )
); // [1,3];

const nums = [1, 2, 3, 4, 5];

const reduce = (f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    // acc는 1부터 시작, nums = [2,3,4,5]로 시작
    acc = iter.next().value;
  }

  for (const n of iter) {
    acc = f(acc, n);
  }
  return acc;
};

const add = (a, b) => a + b;

console.log(reduce(add, nums));

// console.log(reduce((total, product) => total + product.price, 2000, products));

// console.log(
//   11,
//   reduce(
//     add,
//     filter(
//       n => n < 20000,
//       map(p => p.price, products)
//     )
//   )
// );

const go = (...args) => {
  // ...args = [0, f,f,f,f]
  // 첫번째 값으로 a에는 0, f에는 a=>a+1
  // 두번째 값으로 a=>a+1 리턴값이 a에, a=>a+10이 f에 들어간다.
  return reduce((a, f) => f(a), args);
};

const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

// 시작하는 인자가 2개일 때,
go(
  add(0, 1),
  a => a + 1,
  a => a + 10,
  a => a + 100,
  log
);

const tt = pipe(
  (a, b) => a + b,
  a => a + 10,
  a => a + 100
);

console.log(tt(0, 1));

go(
  products,
  products => filter(p => p.price < 20000, products),
  products => map(p => p.price, products),
  prices => reduce(add, prices),
  log
);

// 인자의 갯수가 있으면 받은 인수로 실행, 인자가 없다면, 미리 설정한 인자로 실행
// 함수를 받아 함수를 리턴, 함수를 실행할때, 인자가 2개이상이라면 받은 함수를 즉시실행, 인자가 2개 미만이면 함수를 리턴하고 이후에 받은 인자를 기반으로 실행

// curry함수에 인자가 2개이상 또는 실행 2번, 인자 1개이상 있으면 바로 실행, 없으면 다음 함수 실행될때까지 대기
const curry = f => (a, ..._) => {
  console.log(123, ..._); // null
  return _.length
    ? f(a, ..._)
    : (..._) => {
        console.log(433, ..._); // 1,2,3
        return f(a, ..._);
      };
};

const mult = curry((a, b) => {
  console.log(123123, a, b); // 3,1
  return a * b;
});

const mult3 = mult(3)(1, 2, 3); // 3, 첫번째 함수 실행 때, 인자가 1개이므로, 다음 함수 살행 대기 한후, 다음 함수 실행 첫번째 인자 받아 곱샘 리턴

const mult4 = mult(4, 5); // 20, 첫번째 함수 실행 때, 인자가 2개이상 들어갔기에 다음 함수 안기다리고 바로 완료
