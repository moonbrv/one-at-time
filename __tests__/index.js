import hash from "hash-sum";
import createOneAtTimeWork, { clearWorkers } from "./../src/index.js";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const WAIT_TIME = 50;

let count = 0;

beforeEach(() => {
  count = 0;
  clearWorkers();
});

const longAsyncTask = async (t) => {
  await wait(WAIT_TIME);
  count++;
  return t;
};

const veryLongAsyncTask = async (t) => {
  await wait(WAIT_TIME * 2);
  count++;
  return t;
};

test("function with parallel calls will be caled only once", async () => {
  const oneFunc = createOneAtTimeWork(longAsyncTask);
  await Promise.all([oneFunc(), oneFunc(), oneFunc()]);

  expect(count).toEqual(1);
});

test("different function will be called once", async () => {
  const oneFunc = createOneAtTimeWork(longAsyncTask);
  const secondFunc = createOneAtTimeWork(veryLongAsyncTask);

  await Promise.all([oneFunc(), oneFunc(), secondFunc(), secondFunc()]);

  expect(count).toEqual(2);
});

test("function will be called for each set arguments separately", async () => {
  const oneFunc = createOneAtTimeWork(longAsyncTask);
  await Promise.all([
    oneFunc(1),
    oneFunc(1),
    oneFunc(2),
    oneFunc(2),
    oneFunc(3),
    oneFunc(3),
  ]);

  expect(count).toEqual(3);
});

// test('adds 1 + 2 to equal 3', () => {
//   expect(1 + 2).toBe(3);
// });

// toEqual
// expect(a + b).not.toBe(0);

// test('the data is peanut butter', async () => {
//   const data = await fetchData();
//   expect(data).toBe('peanut butter');
// });

// test('the fetch fails with an error', async () => {
//   expect.assertions(1);
//   try {
//     await fetchData();
//   } catch (e) {
//     expect(e).toMatch('error');
//   }
// });

// test('two plus two', () => {
//   const value = 2 + 2;
//   expect(value).toBeGreaterThan(3);
//   expect(value).toBeGreaterThanOrEqual(3.5);
//   expect(value).toBeLessThan(5);
//   expect(value).toBeLessThanOrEqual(4.5);

//   // toBe and toEqual are equivalent for numbers
//   expect(value).toBe(4);
//   expect(value).toEqual(4);
// });
