const log = console.log;

// 무한 수열
function* infinity(i = 0) {
  while (true) yield i++;
}

function* limit(l, iter) {
  for (const a of iter) {
    yield a;
    if (a === l) return;
  }
}

function* odd(l) {
  for (const a of limit(l, infinity(1))) {
    if (a % 2) yield a;
  }
}

for (const a of odd(40)) {
  console.log(a);
}
log([...odd(10), ...odd(20)]);
const [head, ...tail] = odd(5);
log(head);
log(tail);
// let iter2 = odd(10);

// log(iter2.next());
// log(iter2.next());
// log(iter2.next());
// log(iter2.next());
// log(iter2.next());
// log(iter2.next());
// log(iter2.next());
