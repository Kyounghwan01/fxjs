const { L, go, take, reduce } = require("../fx");

/**
 * 값을 바꿔야한다 map
 * 값을 걸러야한다 filter <- if
 * 상위에 변수를 놓고 값을 넣어야한다 reduce
 * 시간복잡도를 줄여야한다 take <- break
 */
function f1(limit, list) {
  const res = go(
    list,
    L.filter(a => a % 2),
    L.map(a => a * a),
    take(limit),
    a => reduce((a, b) => a + b, 0, a)
  );
  console.log(res);
}
// f1(3, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

/**
 * while문 -> range
 */
