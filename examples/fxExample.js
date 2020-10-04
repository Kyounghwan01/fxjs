const { log, L, _, C } = require("../fx");

const products = [
  { name: "반팔티", price: 15000, quantity: 1, is_selected: true },
  { name: "긴팔티", price: 20000, quantity: 2, is_selected: false },
  { name: "핸드폰케이스", price: 15000, quantity: 3, is_selected: true },
  { name: "후드티", price: 30000, quantity: 4, is_selected: false },
  { name: "바지", price: 25000, quantity: 5, is_selected: false }
];
const add = (a, b) => a + b;

const total_price = _.pipe(
  _.map(p => p.price),
  _.reduce(add)
);

// go(
//   products,
//   filter(p => p.price < 20000),
//   map(p => p.price),
//   reduce(add),
//   log
// );

const base_total_price = predi => _.pipe(_.filter(predi), total_price);

// go(
//   products,
//   base_total_price(p => p.price < 20000),
//   log
// );

const a = _.go(
  products,
  base_total_price(p => p.price >= 20000)
);

// console.log(1, a);

const totalQuantity = products =>
  _.go(
    products,
    _.map(products => products.quantity),
    _.reduce(add)
  );

const total = products =>
  _.go(
    products,
    _.map(products => products.quantity * products.price),
    _.reduce(add)
  );

// console.log(333, totalQuantity(products));
// console.log(444, total(products));

const totalQuantityPipe = _.pipe(
  _.map(products => products.quantity),
  _.reduce(add)
);
const totalPipe = _.pipe(
  _.map(products => products.quantity * products.price),
  _.reduce(add)
);

// const totalSum = sum(p => p.quantity);

// console.log(123123, totalSum(products));

// log(
//   sum(p => p.usage, [
//     { id: 1, usage: 100 },
//     { id: 3, usage: 11 }
//   ])
// );

// promise값 지원
// go(
//   [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
//   L.map(a => Promise.resolve(a * a)),
//   L.filter(a => Promise.resolve(a % 2)),
//   reduce((a, b) => a + b),
//   take(2),
//   log
// );

// log(L.flatten([[1, 2, 3], 4, 5, [6, 7, 8]]));
// log([...L.deepFlat([1, [2, [3, [4, 5]]]])]);

/** each, L.range */
// function f4(end) {
//   go(L.range(1, end, 2), each(console.log));
// }
// f4(10);

/**
 * 비동기 async로 되는데 왜 파이프라인?
 * pipeline chain과 async과 해결하고자 하는게 다르다
 * promise thenthen 체인형을 문장형으로 다루기위함
 * map filter reduce로 이터러블식은 비동기 x 안전하게 함수 합성하고자함
 * async는 비동기를 변수화시켜 동기화 같이 보이게하기위함
 * pipe line은 연속적 함성 합성을 하여 유지보수 위함 (비동기 관련없음)
 *
 * 함수형 장점
 * 명령형의 경우 비동기 로직이 사라질경우 async await을 모두 삭제해야하나 함수형의 경우 두가지 경우 모두 처리되어 코드를 안바꿔도됨
 * C, L같은 효율성/시간을 자유롭게 바꿀수있다.
 */

/** 함수형 */
const delay500 = a =>
  new Promise(res => {
    setTimeout(() => res(a), 500);
  });

function f5(list) {
  return _.go(
    list,
    L.map(a => delay500(a * a)),
    L.filter(a => delay500(a % 2)),
    L.map(a => delay500(a + 1)),
    _.take(2),
    _.reduce((a, b) => a + b),
    log
  );
}
// f5([1, 2, 3, 4, 5, 6, 7]);

/** 명령형 */
async function f6(list) {
  let temp = [];
  for (const a of list) {
    const b = await delay500(a * a);
    if (await delay500(b % 2)) {
      const c = await delay500(b + 1);
      temp.push(c);
      if (temp.length === 2) break;
    }
  }
  let res = temp[0],
    i = 0;
  while (++i < temp.length) {
    res = await delay500(res + temp[i]);
  }
  log(res);
  return res;
}
// f6([1, 2, 3, 4, 5, 6, 7, 8]);

/** 파이프라인 + async await */

async function f52(list) {
  const r1 = await _.go(
    list,
    L.map(a => delay500(a * a)),
    L.filter(a => delay500(a % 2)),
    L.map(a => delay500(a + 1)),
    _.take(2),
    _.reduce((a, b) => a + b)
  );

  const r2 = await _.go(
    list,
    L.map(a => delay500(a * a)),
    _.take(2),
    _.reduce((a, b) => a + b)
  );
  return r1 + r2;
}
// go(f52([1, 2, 3, 4, 5, 6, 7]), a => log(a, "f52"));

/** 동기상황 에러핸들링 */
function f7(list) {
  try {
    return _.go(
      list,
      L.map(a => delay500(a * a)),
      L.filter(a => delay500(a % 2)),
      L.map(a => delay500(a + 1)),
      _.take(2),
      _.reduce((a, b) => a + b),
      log
    );
  } catch (e) {
    log(e);
    return [];
  }
}
// log(f7());

/**
 * 비동기상황 에러핸들링
 * 파이프라인이 promise를 리턴하기 때문에 await을 걸어주면 try, catch로 내부 함수 에러 감지 가능
 * L로 인자씩 함수가 실행 될 경우 에러가 발생되는 인자까지 읽지 않으면 에러 스킵
 */
async function f8(list) {
  try {
    const res = await _.go(
      list,
      C.map(a => new Promise(resolve => resolve(JSON.parse(a)))),
      L.filter(a => a % 2),
      _.take(3)
    );
    return res;
  } catch (e) {
    log(e, "------");
    return [];
  }
}

f8(["1", "2", "3", "["])
  .then(log)
  .catch(e => {
    // 파이프라인에서 에러를 걸러주기 때문에 이 catch문은 사용되지 않음
    log(e, "에러");
  });
