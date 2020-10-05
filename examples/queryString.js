const { L, C, _, log } = require("../fx");
const obj1 = {
  a: 1,
  b: undefined,
  c: "CC",
  d: "DD"
};
// a=1&c=CC&d=DD

/** 명령형 */
function query1(obj) {
  let res = "";
  for (const k in obj) {
    const v = obj[k];
    if (v === undefined) continue;
    if (res != "") res += "&";
    res += k + "=" + v;
  }
  return res;
}
// console.log(query1(obj1));

/** 함수형 + reduce */
function query2(obj) {
  return Object.entries(obj).reduce((query, [k, v], i) => {
    if (v === undefined) return query;
    return `${query}${i > 0 ? "&" : ""}${k}=${v}`;
  }, "");
}
// console.log(query2(obj1));

/** 함수형 + reduce + map + filter */
const join = _.curry((sep, iter) => _.reduce((a, b) => `${a}${sep}${b}`, iter));

const query3 = obj =>
  join(
    "&",
    _.map(
      ([k, v]) => `${k}=${v}`,
      _.filter(([_, v]) => v !== undefined, Object.entries(obj))
    )
  );

// console.log(query3(obj1));

const query4 = _.pipe(
  Object.entries,
  L.filter(([_, v]) => v !== undefined),
  L.map(([k, v]) => `${k}=${v}`),
  _.reduce((a, b) => `${a}&${b}`)
);

// const query4 = obj => _.go(
//   obj
//   Object.entries,
//   L.filter(([_, v]) => v !== undefined),
//   L.map(([k, v]) => `${k}=${v}`),
//   _.reduce((a, b) => `${a}&${b}`)
// );

console.log(query4(obj1));

const query5 = _.pipe(
  Object.entries,
  L.filter(([_, v]) => v !== undefined),
  L.map(join("=")),
  join("&")
);

console.log(query5(obj1));

const split = _.curry((sep, str) => str.split(sep));
const queryToObject = _.pipe(
  split("&"),
  _.map(split("=")),
  _.map(([k, v]) => ({ [k]: v })),
  _.reduce((a, b) => Object.assign({ ...a, ...b }))
);

console.log(queryToObject("a=1&c=CC&d=DD"));
