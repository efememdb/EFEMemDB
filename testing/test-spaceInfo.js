const { efemem } = require("../efememdb");

console.log("\n\n***************************");
console.log("Testing command spaceInfo()");
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

// Testing if error. info() with non existing space
result = efemem.spaceInfo("test");
evaluate(`spaceInfo("test")`, result, false);

// Testing. info() with no parameters ('public' space by default)
result = efemem.spaceInfo();
evaluate(`spaceInfo()`, result, true);

// Testing. info() with an existing space
result = efemem.spaceInfo("qualifications");
evaluate(`qualifications()`, result, true);

console.log(`${JSON.stringify(result, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
