const log = console.log;

const apply1 = f1 => f1(1);
const add = a => a + 1;
log(apply1(add));

const times = (f, n) => {
  let i = -1;
  while (++i < n) {
    f(i);
  }
};

times(a => log(a + 10), 3);

const addMaker = a => b => a + b;

const add10 = addMaker(10);
log(add10);

const add20 = addMaker(20);
// log(add10(10));
// log(add20(10));
// 함수가 함수를 리턴할때는 클로저를 생성하여 변수를 기억할때 사용한다.

// 고차함수
// 함수가 함수를 리턴하는 방식
// 함수를 인자로 받아서 실행하는 함수

// 리스트 순회
// es5 -> for문, es6 -> for of

// es6의 for of, set, map
// 의 경우
const test = [1, 2, 3, 4];
const testIter = test[Symbol.iterator]();
console.log(testIter);
for (const a of testIter) {
  console.log(a);
}

const Maps = [
  ["a", 1],
  ["b", 2],
  ["c", 3]
];
``;

const map = new Map(Maps);
const a = map.entries();
log(a.next());
const tt11 = map[Symbol.iterator]();
tt11.next();
for (const a of tt11) log(a);

// 이터러블/이터레이터 프로토콜
// 이터러블: 이러테이터를 리턴하는 [Symbol.iterator]()를 가진 값
// 이터레이터: {value, done} 객체를 리턴하는 next()를 가진 값 - 심볼 이터레이터를 실행하고 나온 값

// 이터레이터 직접 구현하기
const iterable = {
  [Symbol.iterator]() {
    let i = 3;
    return {
      next() {
        return i === 0 ? { done: true } : { value: i--, done: false };
      },
      // 이터레이터를 실행한 값은 이터레이터를 가져야한다.
      [Symbol.iterator]() {
        return this;
      }
    };
  }
};

let iterator = iterable[Symbol.iterator]();

// for (const a of iterator) log(a);


