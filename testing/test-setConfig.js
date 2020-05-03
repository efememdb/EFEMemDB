const { efemem } = require("../efememdb");

console.log("\n\n***************************");
console.log("Testing command setConfig()");
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

// Testing if error. setConfig() without parameters (all)
result = efemem.setConfig();
evaluate(`setConfig()`, result, false);

// Testing if error. setConfig() with parameter null (all)
result = efemem.setConfig(null);
evaluate(`setConfig(null)`, result, false);

// Testing if error. setConfig with incorrect name (first character not alphabetical)
result = efemem.setConfig("1abc");
evaluate(`setConfig("1abc")`, result, false);

// Testing if error. setConfig from an incorrectname (illegal character)
result = efemem.setConfig("config!");
evaluate(`setConfig("config!")`, result, false);

// Testing if error. setConfig from an incorrect name (more than 24 characters)
result = efemem.setConfig("configiu09olki87ujhy65tgf");
evaluate(`setConfig("configiu09olki87ujhy65tgf")`, result, false);

// Testing if error. setConfig() with a valid paremeter name but without value
result = efemem.setConfig("maxMemory");
evaluate(`setConfig("maxMemory")`, result, false);

// Testing if error. setConfig() with valid config parameter and value
result = efemem.setConfig("param", "value");
evaluate(`setConfig("param", "value)`, result, true);

console.log(`result: ${JSON.stringify(result, null, 2)}`);
console.log(`config: ${JSON.stringify(efemem.config, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
