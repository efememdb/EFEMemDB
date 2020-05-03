const { efemem } = require("../efememdb");

console.log("\n\n**********************");
console.log("Testing command info()");
console.log("**********************");

let ok = 0;
let ko = 0;
let result = {};

/**
 * Evaluates a given result obtained from an executed command
 * @param {string} title => Text that describes the test
 * @param {JSON} result => Result to evaluate
 * @param {boolean} expected => Expected result (true | false)
 */
const evaluate = (title, result, expected) => {
  console.log(`> testing: ${title} - Expected: ${expected}`);

  if (result.ok == expected) {
    ok++;
    console.log(`   [OK] ${JSON.stringify(result, null, 2)}`);
  } else {
    ko++;
    console.log(`   *** [ERROR] *** ${JSON.stringify(result, null, 2)}`);
  }
};

// Testing info()
result = efemem.info();
evaluate(`info()`, result, undefined);

console.log(`${result}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
