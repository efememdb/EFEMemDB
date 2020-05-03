const { efemem } = require("../efememdb");

const NUM_SPACES = 3;

console.log("\n\n************************");
console.log("Testing command spaces()");
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

// Testing spaces()
result = efemem.spaces();
evaluate(`spaces()`, result, true);

if (result.data.length != NUM_SPACES) {
  ko++;
  console.log(
    `   *** [ERROR] *** Expected ${NUM_SPACES} spaces (${result.data.length} found)`
  );
} else ok++;

console.log(`result: ${JSON.stringify(result, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
