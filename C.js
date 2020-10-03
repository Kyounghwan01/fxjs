// 병렬
// 비동기.io
// 지연된 함수열을 병렬적으로 실행

const {
  reduce,
  curry,
  L,
  add,
  go,
  log,
  take,
  pipe,
  map,
  filter,
  each
} = require("./fx");

/**
 * L의 경우 새로로 함수가 실행됨, 1개의 인자가 받아지면, 모든함수를 겪은후, 2번째인자로 들어간다
 * 이것이 비동기일경우, 1번인자가 비동기가 다 종료되어야 2번인자 비동기가 실행되는 상황이다
 * 시스템의 부하는 줄이지만, 확실히 속도가 느리다
 * 그에 따라 시스템의 부하는 걸리지만, 속도를 빠르게 하여 한번에 비동기 처리할 인자들을 모아 놓고 콜스택을 한번에 처리하는 C 방식이 있다.
 */

const C = {};
function noop() {}

const catchNoop = ([...arr]) => (
  arr.forEach(a => (a instanceof Promise ? a.catch(noop) : a)), arr
);

C.reduce = curry((f, acc, iter) =>
  iter ? reduce(f, acc, catchNoop(iter)) : reduce(f, catchNoop(acc))
);

C.take = curry((l, iter) => take(l, catchNoop([...iter])));

C.takeAll = C.take(Infinity);

C.map = curry(pipe(L.map, C.takeAll));

C.filter = curry(pipe(L.filter, C.takeAll));

/**
 * 마지막 평가가 동기적으로 했다면
 * 특정 함수라인만 병렬적으로 그다음은 동기적으로
 * C.map, C.filter
 */

const delay1000 = (a, func) =>
  new Promise(res => {
    console.log(`${func}: ${a}`);
    setTimeout(() => res(a), 100);
  });

// go(
//   [1, 2, 3, 4, 5, 6],
//   L.map(a => delay1000(a * a)),
//   L.filter(a => a % 2),
//   take(2),
//   reduce(add),
//   log
// );

// 위와 같은 경우 비동기적으로 딜레이함수를 총 6번 실행하여 6초가 걸린다.
// 그러나 take를 쓸경우 함수 호출 횟수를 줄일 수 있으므로 효율성은 높다.

// go(
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   L.map(a => delay1000(a * a)),
//   L.filter(a => delay1000(a % 2)),
//   L.map(a => delay1000(a * a)),
//   C.take(2),
//   C.reduce(add),
//   log
// );

// 위 C 함수는 한번에 1~6까지 인자를 받아오므로 delay1000함수가 한번에 6번이 실행되고 즉 1초 가까운 시간에 reduce까지 실행된다
// 그러나 함수는 6번 무조건 실행되므로 효율성은 적다.

// 기본, L, C, promise 종합예제
/**
 * 기본함수이면 1~5번 전체가 1번 함수를 거치고 2번함수로 들어간다.
 * L은 1번인자에 대한 평가가 모든 함수에 대해 끝나면 2번 인자 평가가 시작되어 평가가 최소화됨
 * C는 병렬로 빠르게 실행
 * 위 3조합을 적절히 섞어서 상황에 맞게 빠르게 또는 정확하게의 정도를 조절한다
 */
// console.time("");
// go(
//   [1, 2, 3, 4, 5, 6, 7, 8],
//   map(a => delay1000(a * a, "map, 1")),
//   filter(a => delay1000(a % 2, "filter 2")),
//   map(a => delay1000(a + 2, "map 3")),
//   C.reduce((a, b) => a + b),
//   log,
//   _ => console.timeEnd("")
// );

// 하나라도 C를 쓰는 순간 무조건 loop을 최대로 돌아야한다.
// 하지만 loop을 다도는 순간에 L을 쓰면 한번에 비동기를 실행하고, 기본을 쓰면 1번 기다리고 2번 실행

module.exports = {
  C
};
