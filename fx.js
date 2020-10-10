const log = console.log;
const curry = f => (a, ..._) => (_.length ? f(a, ..._) : (..._) => f(a, ..._));
const add = (a, b) => a + b;
const isIterable = a => a && a[Symbol.iterator];
const go = (...args) => reduce((a, f) => f(a), args);
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);
const sum = curry((fn, iter) => go(iter, map(fn), reduce(add)));
const goPromise = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
// "Symbol 값도 객체의 프로퍼티 키로 사용할 수 있다. Symbol 값은 유일한 값이므로 Symbol 값을 키로 갖는 프로퍼티는 다른 어떠한 프로퍼티와도 충돌하지 않는다."
const nop = Symbol("nop");
const L = {};
const C = {};
function noop() {}
function safety(a) {
  return a != null && !!a[Symbol.iterator] ? a : empty;
}
function toIter(iterable) {
  return iterable && iterable[Symbol.iterator]
    ? iterable[Symbol.iterator]()
    : empty;
}

const checkPromise = (acc, a, f) =>
  a instanceof Promise
    ? a.then(
        a => f(acc, a),
        e => (e === nop ? acc : Promise.reject(e))
      )
    : f(acc, a);

const head = iter => goPromise(take(1, iter), ([h]) => h);

const reduce = curry((f, acc, iter) => {
  if (!iter) return reduce(f, head((iter = acc[Symbol.iterator]())), iter);

  iter = iter[Symbol.iterator]();

  // 재귀를 이용해 promise 다음 함수가 promise가 아닐경우 하나의 콜스택에서 전부 실행되도록 한다.
  return goPromise(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = checkPromise(acc, cur.value, f);
      if (acc instanceof Promise) {
        return acc.then(recur);
      }
    }
    return acc;
  });
});

// const range = l => {
//   let i = -1;
//   let res = [];
//   while (++i < l) {
//     res.push(i);
//   }
//   return res;
// };

const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      // 들어오는 값이 promise면 then이후 값을 push, 다음 값이 promise가 아닐 수 있으니 재귀로 평가
      // promise에 들어온 값이 위에서 날린 nop면 recur 실행해서 값 무시
      if (a instanceof Promise)
        return a
          .then(a => ((res.push(a), res).length === l ? res : recur()))
          .catch(e => (e === nop ? recur() : Promise.reject(e)));
      if ((res.push(a), res).length === l) return res;
    }

    return res;
  })();
});

L.take = curry(function* takeLazy(l, iter) {
  if (l < 1) return;
  for (const a of safety(iter)) {
    if (a instanceof Promise) yield a.then(a => (--l, a));
    else yield (--l, a);
    if (!l) break;
  }
});

function* rangeLazy(start = 0, stop = start, step = 1) {
  if (arguments.length == 1) start = 0;
  while (start < stop) {
    yield start;
    start += step;
  }
}

L.range = rangeLazy;
const range = (..._) => takeAll(rangeLazy(..._));

L.map = curry(function* (f, iter) {
  for (const a of iter) {
    yield goPromise(a, f);
  }
});

L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    const b = goPromise(a, f);
    // b는 아직 promise그래서 분기처리, 다음 함수로 값을 보내지 않을땐 promise.reject
    // promise.reject값이 에러핸들링인지 무시인지 모르기때문에 nop을 정의하고, promise.reject 처리한다 (take에서)
    if (b instanceof Promise) yield b.then(b => (b ? a : Promise.reject(nop)));
    else {
      if (b) yield a;
    }
  }
});

L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) for (const b of a) yield b;
    else yield a;
  }
};

L.deepFlat = function* f(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* f(a);
    else yield a;
  }
};

L.flatMap = curry(pipe(L.map, L.flatten));

L.values = function* (obj) {
  // 호출되는 객체만 배열로 바꿈
  for (const k in obj) {
    yield obj[k];
  }
};

L.entries = function* (obj) {
  for (const k in obj) {
    yield [k, obj[k]];
  }
};

L.keys = function* (obj) {
  for (const k in obj) {
    yield k;
  }
};

L.takeUntil = curry(function* takeUntilLazy(f, iter) {
  let ok = false;
  for (const a of safety(iter)) {
    ok = goPromise(a, f);
    if (ok instanceof Promise) yield ok.then(_ok => ((ok = _ok), a));
    else yield a;
    if (ok) break;
  }
});

L.takeWhile = curry(function* takeWhileLazy(f, iter) {
  let ok = false;
  for (const a of safety(iter)) {
    ok = goPromise(a, f);
    if (ok instanceof Promise)
      yield ok.then(_ok => ((ok = _ok) ? a : Promise.reject(nop_0)));
    else if (ok) yield a;
    if (!ok) break;
  }
});

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

const takeAll = take(Infinity);

const map = curry(pipe(L.map, takeAll));

const filter = curry(pipe(L.filter, takeAll));

const each = curry((f, iter) =>
  goPromise(
    reduce((_, a) => f(a), null, iter),
    _ => iter
  )
);

const pick = (ks, obj) =>
  _.go(
    ks,
    _.map(k => [k, obj[k]]),
    _.filter(([_, v]) => v !== undefined),
    object
  );

const omit = (ks, obj) =>
  _.go(
    obj,
    L.entries,
    _.filter(([k, _]) => !ks.includes(k)),
    object
  );

// const obj2 = { a: 1, b: 2, c: 3, d: 4, e: 5 };
// console.log(pick(["b", "c", "z"], obj2));
// console.log(omit(["a", "c", "b"], obj2));

/** false일때 계속 담다가 처음으로 true를 만날 때까지 담는 함수 */
const takeUntil = curry(function takeUntil(f, iter) {
  let res = [];
  iter = toIter(iter);
  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      const b = goPromise(a, a => (res.push(a), f(a, res)));
      if (b instanceof Promise)
        return b
          .then(b => (b ? res : recur()))
          .catch(e => (e == nop_0 ? recur() : Promise.reject(e)));
      if (b) break;
    }
    return res;
  })();
});

/** takeUntil의 반대 - true일때만 계속 담음 false면 중지 */
const takeWhile = curry(function takeWhile(f, iter) {
  let res = [];
  iter = toIter(iter);
  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      const b = goPromise(a, a => f(a, res));
      if (!b) return res;
      if (b instanceof Promise) {
        return b
          .then(async b => (b ? (res.push(await a), recur()) : res))
          .catch(e => (e == nop_0 ? recur() : Promise.reject(e)));
      }
      res.push(a);
    }
    return res;
  })();
});

const _ = {
  map,
  filter,
  reduce,
  go,
  pipe,
  add,
  range,
  log,
  take,
  each,
  curry,
  pick,
  omit,
  takeAll,
  takeUntil,
  takeWhile
};

module.exports = {
  _,
  L,
  C,
  log
};
