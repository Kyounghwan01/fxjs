const { sum, curry, reduce, go, pipe, log, add, filter, map } = require("./fx");

const products = [
  { name: "반팔티", price: 15000, quantity: 1, is_selected: true },
  { name: "긴팔티", price: 20000, quantity: 2, is_selected: false },
  { name: "핸드폰케이스", price: 15000, quantity: 3, is_selected: true },
  { name: "후드티", price: 30000, quantity: 4, is_selected: false },
  { name: "바지", price: 25000, quantity: 5, is_selected: false }
];

go(
  products,
  filter(p => p.price < 20000),
  map(p => p.price),
  reduce(add),
  log
);

const base_total_price = predi => pipe(filter(predi), total_price);

go(
  products,
  base_total_price(p => p.price < 20000),
  log
);

const a = go(
  products,
  base_total_price(p => p.price >= 20000)
);

// console.log(1, a);

const total_price = pipe(
  map(p => p.price),
  reduce(add)
);

const totalQuantity = products =>
  go(
    products,
    map(products => products.quantity),
    reduce(add)
  );

const total = products =>
  go(
    products,
    map(products => products.quantity * products.price),
    reduce(add)
  );

// console.log(333, totalQuantity(products));
// console.log(444, total(products));

const totalQuantityPipe = pipe(
  map(products => products.quantity),
  reduce(add)
);
const totalPipe = pipe(
  map(products => products.quantity * products.price),
  reduce(add)
);

const totalSum = sum(p => p.quantity);

console.log(123123, totalSum(products));

log(
  sum(p => p.usage, [
    { id: 1, usage: 100 },
    { id: 3, usage: 11 }
  ])
);
