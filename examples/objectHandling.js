const { L, C, _, log } = require("../fx");

/**
 * 값을 바꿔야한다 map
 * 값을 걸러야한다 filter <- if
 * 상위에 변수를 놓고 값을 넣어야한다 reduce
 * 시간복잡도를 줄여야한다 take <- break
 */
function f1(limit, list) {
  const res = _.go(
    list,
    L.filter(a => a % 2),
    L.map(a => a * a),
    _.take(limit),
    a => _.reduce((a, b) => a + b, 0, a)
  );
  console.log(res);
}
// f1(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

/**
 * while문 -> range
 * 바꾸기 -> each
 */

/** 별그리기 */
/** 여러번의 표현을 반복할때 그 시작을 range라고 본다 */
const join = sep => _.reduce((a, b) => `${a}${sep}${b}`);

_.go(
  _.range(1, 6),
  _.map(a => _.range(a)), // [[0], [0, 1], [0, 1, 2] ...]
  // _.map(a => console.log(a)), // [0] [0, 1] [0, 1, 2]...
  _.map(_.map(a => "*")),
  _.map(join("")),
  join("\n"),
  console.log
);

/** 구구단 */
_.go(
  L.range(2, 10),
  L.map(a =>
    _.go(
      L.range(1, 10),
      L.map(b => a * b),
      join("\n")
    )
  ),
  join("\n"),
  console.log
);

/** reduce 보조함수 복잡하게 쓰지 말고, map으로 형태 바꾼 후, 재사용성 있게 사용
 * 보조함수에서 비교하는 값이 같은 형태의 값이 되도록 전달하자
 * (같은 형태면 재사용성이 증가한다)
 */
const users = [
  { name: "AA", age: 35 },
  { name: "BB", age: 26 },
  { name: "CC", age: 28 },
  { name: "CC", age: 34 },
  { name: "EE", age: 3 }
];

// 이것보다
// console.log(_.reduce((total, u) => total + u.age, 0, users));

// 아래처럼 쓴다
const mapUsers = (type, target) => L.map(u => u[type], target);
console.log(_.reduce(_.add, mapUsers("age", users)));

// reduce만 쓰면 아래와 같이 사용한다.
// 그러나 조건이 추가될 경우 보조함수가 복잡해진다.
console.log(
  _.reduce((total, u) => (u.age >= 30 ? total : total + u.age), 0, users)
);

// 아래처럼 보조함수에 map, filter를 추가하면 조건이 추가되도, filter 함수만 하나 더 추가하면 된다.
console.log(
  _.reduce(
    _.add,
    _.filter(
      n => n > 10,
      _.filter(
        n => n < 30,
        L.map(u => u.age, users)
      )
    )
  )
);
