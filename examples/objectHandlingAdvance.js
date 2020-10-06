/** 객체 이러터블로 변환 후 값 다루기 */
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
const a = [
  ["a", 1],
  ["b", 2],
  ["c", 3]
];
const b = { a: 1, b: 2, c: 3 };

const object = entries =>
  _.go(
    entries,
    L.map(([k, v]) => ({ [k]: v })),
    _.reduce(Object.assign)
  );

const object1 = entries =>
  _.reduce((obj, [k, v]) => ((obj[k] = v), obj), {}, entries);

console.log(object(a));
console.log(object1(a));

let m = new Map();
m.set("a", 10);
m.set("b", 20);
m.set("c", 30);

console.log(object1(m));
console.log([...m.values(m)]);

const mapObject = (f, obj) =>
  _.go(
    obj,
    L.entries,
    _.map(([k, v]) => [k, f(v)]),
    object
  );

// {a: 11, b: 12, c: 13}
console.log(mapObject(a => a + 10, { a: 1, b: 2, c: 3 }));

const obj2 = { a: 1, b: 2, c: 3, d: 4, e: 5 };

const pick = (ks, obj) =>
  _.go(
    ks,
    _.map(k => [k, obj[k]]),
    _.filter(([_, v]) => v !== undefined),
    object
  );

console.log(pick(["b", "c", "z"], obj2));

const omit = (ks, obj) =>
  _.go(
    obj,
    L.entries,
    _.filter(([k, _]) => !ks.includes(k)),
    object
  );

// console.log([...L.keys(obj2)].includes(k))

console.log(omit(["a", "c", "b"], obj2));

/**
 * indexby -> 배열을 객체로 만들고, key에 원하는 값을 id 형식으로 부여
 * 이후 배열에서 값을 찾을 때, 순회를 하지 않고, 바뀐 객체의 key값으로 찾게 되어 연산 값 줄인다
 * 여러번 값을 찾을 경우 한번 순회하여 id를 만들고 뽑아 쓰는 것이 유리
 * */

const users = [
  { id: 5, name: "AA", age: 35 },
  { id: 6, name: "BB", age: 36 },
  { id: 7, name: "CC", age: 40 },
  { id: 8, name: "DD", age: 37 },
  { id: 9, name: "EE", age: 38 }
];

_.indexBy = (f, iter) => _.reduce((obj, a) => ((obj[f(a)] = a), obj), {}, iter);

const users2 = _.indexBy(u => u.id, users);

/** indexBy 된 값 filter */
_.go(
  users2,
  L.entries,
  _.filter(([_, { age }]) => age < 38),
  L.take(2),
  object,
  log
);
