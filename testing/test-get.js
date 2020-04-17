const { efemem } = require("../efememdb");

console.log("\n\n*********************");
console.log("Testing command get()");
console.log("*********************");

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

// Testing if error. get() without parameters
result = efemem.get();
evaluate(`get()`, result, false);

// Testing if error. get() with incorrect key (null)
result = efemem.get(null);
evaluate(`get(null)`, result, false);

// Testing if error. get() with incorrect key (no string name)
result = efemem.get(123);
evaluate(`get(123)`, result, false);

// Testing if error. get() with incorrect key (first character not alphabetical)
result = efemem.get("1abc");
evaluate(`get("1abc")`, result, false);

// Testing if error. get() with incorrect key (illegal character)
result = efemem.get("maxValue!");
evaluate(`get("maxValue!")`, result, false);

// Testing if error. get() with incorrect key (More than 100 characters)
result = efemem.get(
  "maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723"
);
evaluate(
  `get("maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723")`,
  result,
  false
);

// Testing if error. get with incorrect space (first character not alphabetical)
result = efemem.get("maxValue", "1abc");
evaluate(`get("maxValue", "1abc")`, result, false);

// Testing if error. get with incorrect space (illegal character)
result = efemem.get("maxValue", "config!");
evaluate(`get("maxValue", "config!")`, result, false);

// Testing if error. get with incorrect space (more than 24 characters)
result = efemem.get("maxValue", 100, "configiu09olki87ujhy65tgf");
evaluate(`get("maxValue", 100, "configiu09olki87ujhy65tgf")`, result, false);

// Testing if error. get with an existing key, but not in the 'public' space
result = efemem.get("maxValue");
evaluate(`get("maxValue")`, result, false);

// Testing a non existing key
result = efemem.get("employee:007", "employees");
evaluate(`get("employee:007", "employees")`, result, false);

// Testing an existing key
result = efemem.get("employee:001", "employees");
evaluate(`get("employee:001", "employees")`, result, true);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
