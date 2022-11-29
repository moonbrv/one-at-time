/**
 *
 * TODO:
 * [x] implement hash function
 * [x] add babel
 * [x] add tests
 * [x] add release dist
 * [ ] add automation on github
 * [ ] create npm package on release
 * [ ] create release task
 * [ ] terminology + naming convention <--
 * [ ] naming in tests
 *
 */

import hash from "hash-sum";

let results = {};

let oneAtTimeFunctions = {};

/**
 * Higher order function which create function that could be executed only
 * once at the time with same set of arguments
 *
 * @param {function} f - any function
 * @returns {function} A function that will be executed only once
 * at the same time, per each set of arguments
 */
function createOneAtTimeWork(f) {
  const fhash = hash(f);

  if (oneAtTimeFunctions[fhash]) {
    return oneAtTimeFunctions[fhash];
  }

  results[fhash] = {};

  const ronedFunction = async function ronedFunction(...args) {
    const ahash = hash(args);

    if (results[fhash][ahash]) {
      return results[fhash][ahash];
    }

    const currentWork = (async () => f.apply(this, args))();
    results[fhash][ahash] = currentWork;
    const workResult = await currentWork;
    results[fhash][ahash] = null;
    return workResult;
  };

  oneAtTimeFunctions[fhash] = ronedFunction;

  return ronedFunction;
}

export const clearWorker = function clearWorker(f) {
  const fhash = hash(f);
  if (oneAtTimeFunctions[fhash]) {
    oneAtTimeFunctions[fhash] = null;
  }

  if (results[fhash]) {
    results[fhash] = null;
  }
};

export const clearWorkers = function clearWorkers() {
  oneAtTimeFunctions = {};
  results = {};
};

export default createOneAtTimeWork;
