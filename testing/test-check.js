const { efemem } = require("../efememdb");

console.log("\n\n***********************");
console.log("Testing command check()");
console.log("***********************");

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

// Testing if error. check() without parameters
result = efemem.check();
evaluate(`check()`, result, false);

// Testing if error. rename() with incorrect key (null)
result = efemem.check(null);
evaluate(`check(null)`, result, false);

// Testing if error. check() with incorrect key (no string name)
result = efemem.check(123);
evaluate(`check(123)`, result, false);

// Testing if error. check() with incorrect key (first character not alphabetical)
result = efemem.check("1abc");
evaluate(`check("1abc")`, result, false);

// Testing if error. check() with incorrect key (illegal character)
result = efemem.check("maxValue!");
evaluate(`check("maxValue!")`, result, false);

// Testing if error. check() with incorrect key (More than 100 characters)
result = efemem.check(
  "maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723"
);
evaluate(
  `check("maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723")`,
  result,
  false
);

// Testing if error. get with incorrect space (first character not alphabetical)
result = efemem.check("maxValue", "1abc");
evaluate(`check("maxValue", "1abc")`, result, false);

// Testing if error. get with incorrect space (illegal character)
result = efemem.check("maxValue", "config!");
evaluate(`check("maxValue", "config!")`, result, false);

// Testing if error. check with incorrect space (more than 24 characters)
result = efemem.check("maxValue", 100, "configiu09olki87ujhy65tgf");
evaluate(`check("maxValue", 100, "configiu09olki87ujhy65tgf")`, result, false);

// Testing if error. get with an existing key, but not in the 'public' space
result = efemem.check("maxValue");
evaluate(`check("maxValue")`, result, false);

// Testing a non existing key
result = efemem.check("employee:007", "employees");
evaluate(`check("employee:007", "employees")`, result, false);

// Testing an existing key
result = efemem.check("employee:001", "employees");
evaluate(`check("employee:001", "employees")`, result, true);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
