const {
  L,
  take,
  takeAll,
  log,
  range,
  curry,
  reduce,
  go,
  pipe,
  add,
  map,
  filter
} = require("./fx");

console.clear();

let list = range(50000);
log(reduce(add, list));

// lazy function
// const L = {};

// L.range = function* (l) {
//   let i = -1;
//   while (++i < l) {
//     yield i;
//   }
// };

// const lists = L.range(50000);
// log(312, reduce(add, lists));

// go(L.range(10000), take(5), reduce(add), log);

// go(range(10000), take(5), reduce(add), log);

// L.map = function* (f, iter) {
//   for (const a of iter) yield f(a);
// };

// var it = L.map(a => a * 10, [1, 2, 3]);
// log(it.next());

// L.filter = function* (f, iter) {
//   for (const a of iter) if (f(a)) yield a;
// };

// var its = L.filter(a => a > 2, [1, 2, 3, 4]);
// log(its.next()); // 1번 할때, 걸러지는 것이 나옴 { value: 3, done: false }
// log(its.next()); // { value: 4, done: false }
// log(its.next()); // { value: undefined, done: true }

// L.map = curry(function* (f, iter) {
//   for (const a of iter) {
//     yield f(a);
//   }
// });

// const takeAll = take(Infinity);

// const map = curry(pipe(L.map, takeAll));
// const map = curry((f, iter) => go(L.map(f, iter), takeAll));

log(map(a => a + 10, L.range(4)));

// ## L.filter + take로 filter 만들기

// L.filter = curry(function* (f, iter) {
//   for (const a of iter) {
//     if (f(a)) yield a;
//   }
// });

// const filter = curry(pipe(L.filter, takeAll));

// log(filter(a => a % 2, range(4)));

// const isIterable = a => a && a[Symbol.iterator];

// L.flatten = function* (iter) {
//   for (const a of iter) {
//     if (isIterable(a)) for (const b of a) yield b;
//     else yield a;
//   }
// };

var its = L.flatten([[1, 2, 3], 4, 5, [6, 7, 8]]);
// log([...its]);

// L.deepFlat = function* f(iter) {
//   for (const a of iter) {
//     if (isIterable(a)) yield* f(a);
//     else yield a;
//   }
// };
// log([...L.deepFlat([1, [2, [3, [4, 5]]]])]);

// L.flatMap
// 다형성있는 flatMap - array아닌것도 가능
// L.flatMap = curry(pipe(L.map, L.flatten));
// pipe(L.map, L.flatten)

var its = go(
  [
    [1, 2],
    [3, 4],
    [5, 6]
  ],
  L.flatMap(L.map(a => a * a)),
  takeAll
);

// console.log(123, its);

var it = L.flatMap(
  L.map(a => a * a),
  [
    [1, 2],
    [3, 4],
    [5, 6]
  ]
);

// console.log([...its]);

// 2차원 배열 예제
const arr = [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8]
];

var its = go(
  arr,
  L.flatten,
  L.filter(a => a % 2),
  L.map(a => a * a),
  takeAll,
  reduce(add)
);
console.log(its);

var users = [
  {
    name: "a",
    age: 21,
    family: [
      { name: "a1", age: 53 },
      { name: "a2", age: 47 },
      { name: "a3", age: 16 },
      { name: "a4", age: 15 }
    ]
  },
  {
    name: "b",
    age: 24,
    family: [
      { name: "b1", age: 58 },
      { name: "b2", age: 51 },
      { name: "b3", age: 19 },
      { name: "b4", age: 22 }
    ]
  },
  {
    name: "c",
    age: 31,
    family: [
      { name: "c1", age: 64 },
      { name: "c2", age: 62 }
    ]
  },
  {
    name: "d",
    age: 20,
    family: [
      { name: "d1", age: 42 },
      { name: "d2", age: 42 },
      { name: "d3", age: 11 },
      { name: "d4", age: 7 }
    ]
  }
];

// go(
//   users,
//   L.flatMap(u => u.family),
//   L.filter(u => u.age > 20),
//   L.map(u => u.age),
//   take(2),
//   reduce(add),
//   log
// );

// go(
//   users,
//   L.map(u => u.family),
//   L.flatten,
//   L.filter(u => u.age > 20),
//   L.map(u => u.age),
//   reduce(add),
//   takeAll,
//   log
// );
