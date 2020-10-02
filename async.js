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

// go, pipe, reduce에서 비동기 제어
// go(
//   Promise.resolve(1),
//   a => a + 10,
//   a => a + 1000,
//   a => a + 100000,
//   log
// ).catch(a => console.log(a)); // 101011

// go(
//   Promise.resolve(1),
//   a => a + 10,
//   a => Promise.reject("awd"),
//   a => a + 1000,
//   a => a + 100000,
//   log
// ).catch(a => console.log(a));

// map,filter,reduce가 비동기일때도 작동하게

// go(
//   [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
//   L.map(a => a + 10),
//   take(2),
//   log
// );

// filter promise 지원
// go(
//   [1, 2, 3, 4, 5, 6],
//   L.map(a => Promise.resolve(a * a)),
//   filter(a => {
//     log(a);
//     return a % 2;
//   }),
//   // take(2),x
//   log
// );

// reduce promise 지원
go(
  [1, 2, 3, 4, 5, 6],
  L.map(a => Promise.resolve(a * a)),
  L.filter(a => Promise.resolve(a % 2)),
  reduce((a, b) => a + b),
  // take(2),
  log
);
