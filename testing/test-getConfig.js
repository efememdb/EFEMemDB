const { efemem } = require("../efememdb");

console.log("\n\n***************************");
console.log("Testing command getConfig()");
console.log("***************************");

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

// Testing getConfig() without parameters (all)
result = efemem.getConfig();
evaluate(`getConfig()`, result, true);

// Testing getConfig() with parameter null (all)
result = efemem.getConfig(null);
evaluate(`getConfig(null)`, result, true);

console.log(`result: ${JSON.stringify(result, null, 2)}`);

// Testing if error. getConfig() with inexistent config parameter
result = efemem.getConfig("maximumMemory");
evaluate(`getConfig("maximumMemory")`, result, false);

// Testing getConfig a valid config parameter
result = efemem.getConfig("maxMemory");
evaluate(`getConfig("maxMemory")`, result, true);

console.log(`result: ${JSON.stringify(result, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
