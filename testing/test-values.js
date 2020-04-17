const { efemem } = require("../efememdb");

const NUM_KEYS = 7;

console.log("\n\n************************");
console.log("Testing command values()");
console.log("************************");

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

// Testing values(). Get all keys
result = efemem.values();
evaluate(`values()`, result, true);

if (result.data.length != NUM_KEYS) {
  ko++;
  console.log(
    `   *** [ERROR] *** Expected ${NUM_KEYS} keys (${result.data.length} found)`
  );
} else ok++;

console.log(`result: ${JSON.stringify(result, null, 2)}`);

// Testing values() with null value (all by default)
result = efemem.values(null);
evaluate(`values(null)`, result, true);

// Testing values("", "config") . All keys on "config" space
result = efemem.values("", "config");
evaluate(`values("", "config")`, result, true);

// Testing values("", "emp") . All keys on "*emp*" space
result = efemem.values("", "emp");
evaluate(`values("", "emp")`, result, true);

console.log(`result: ${JSON.stringify(result, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
