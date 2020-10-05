const { L, C, _, log } = require("../fx");

const obj1 = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
};

// 즉시 obj를 모든 배열로 바꿔야함.
_.go(
  obj1,
  Object.values,
  _.map(a => a + 10),
  _.reduce((a, b) => a + b),
  log
);

/** values */
L.values = function* (obj) {
  // 호출되는 객체만 배열로 바꿈
  for (const k in obj) {
    yield obj[k];
  }
};

_.go(
  obj1,
  L.values,
  _.map(a => a + 10),
  _.take(2),
  _.reduce((a, b) => a + b),
  log
);

/** entries */
