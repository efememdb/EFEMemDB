const { efemem } = require("../efememdb");

console.log("\n\n************************");
console.log("Testing command delete()");
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

// Testing if error. delete() without parameters
result = efemem.delete();
evaluate(`delete()`, result, false);

// Testing if error. delete() with incorrect key (null)
result = efemem.delete(null);
evaluate(`delete(null)`, result, false);

// Testing if error. delete() with incorrect key (no string name)
result = efemem.delete(123);
evaluate(`delete(123)`, result, false);

// Testing if error. delete() with incorrect key (first character not alphabetical)
result = efemem.delete("1abc");
evaluate(`delete("1abc")`, result, false);

// Testing if error. delete() with incorrect key (illegal character)
result = efemem.delete("maxValue!");
evaluate(`delete("maxValue!")`, result, false);

// Testing if error. delete() with incorrect key (More than 100 characters)
result = efemem.delete(
  "maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723"
);
evaluate(
  `delete("maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723")`,
  result,
  false
);

// Testing if error. delete() with incorrect space (first character not alphabetical)
result = efemem.delete("maxValue", "1abc");
evaluate(`delete("maxValue", "1abc")`, result, false);

// Testing if error. delete() with incorrect space (illegal character)
result = efemem.delete("maxValue", "config!");
evaluate(`delete("maxValue", "config!")`, result, false);

// Testing if error. delete() with incorrect space (more than 24 characters)
result = efemem.delete("maxValue", 100, "configiu09olki87ujhy65tgf");
evaluate(`delete("maxValue", 100, "configiu09olki87ujhy65tgf")`, result, false);

// Testing if error. delete() with an existing key, but not in the 'public' space
result = efemem.delete("maxValue");
evaluate(`delete("maxValue")`, result, false);

// Testing if error. delete() a non existing key
result = efemem.delete("employee:009", "employees");
evaluate(`delete("employee:009", "employees")`, result, false);

// Testing. delete() an existing key
result = efemem.delete("job", "employees");
evaluate(`delete("job", "employees")`, result, true);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
