const { efemem } = require("../efememdb");

const NUM_KEYS = 8;

console.log("\n\n**********************");
console.log("Testing command keys()");
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
    console.log(`   [OK] ${result.msg}`);
  } else {
    ko++;
    console.log(`   *** [ERROR] *** ${result.msg}`);
  }
};

// Testing keys(). Get all keys
result = efemem.keys();
evaluate(`keys()`, result, true);

if (result.data.length != NUM_KEYS) {
  ko++;
  console.log(
    `   *** [ERROR] *** Expected ${NUM_KEYS} keys (${result.data.length} found)`
  );
} else ok++;

console.log(`result: ${JSON.stringify(result, null, 2)}`);

// Testing keys() with null value (all by default)
result = efemem.keys(null);
evaluate(`keys(null)`, result, true);

// Testing keys("", "config") . All keys on "config" space
result = efemem.keys("", "config");
evaluate(`keys("", "config")`, result, true);

// Testing keys("", "emp") . All keys on "*emp*" space
result = efemem.keys("", "emp");
evaluate(`keys("", "emp")`, result, true);

console.log(`result: ${JSON.stringify(result, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
