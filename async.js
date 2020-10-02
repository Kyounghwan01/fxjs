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

go(range(10000), take(5), reduce(add), log);
// go(L.range(10000), take(5), reduce(add), log);
