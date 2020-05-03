const { efemem } = require("../efememdb");

console.log("\n\n**********************");
console.log("Testing command move()");
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

// Testing if error. move() with incorrect key (no string name)
result = efemem.move(123);
evaluate(`move(123)`, result, false);

// Testing if error. move() with incorrect key (first character not alphabetical)
result = efemem.move("1abc");
evaluate(`move("1abc")`, result, false);

// Testing if error. move() with incorrect key (illegal character)
result = efemem.move("maxValue!");
evaluate(`move("maxValue!")`, result, false);

// Testing if error. move() with incorrect key (More than 100 characters)
result = efemem.move(
  "maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723"
);
evaluate(
  `move("maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723")`,
  result,
  false
);

// Testing if error. move from an incorrect space (first character not alphabetical)
result = efemem.move("maxValue", "1abc");
evaluate(`move("maxValue", "1abc")`, result, false);

// Testing if error. move from an incorrect space (illegal character)
result = efemem.move("maxValue", "config!");
evaluate(`move("maxValue", "config!")`, result, false);

// Testing if error. move from an incorrect space (more than 24 characters)
result = efemem.move("maxValue", "configiu09olki87ujhy65tgf");
evaluate(`move("maxValue", "configiu09olki87ujhy65tgf")`, result, false);

// Testing if error. move to an incorrect new space (first character not alphabetical)
result = efemem.move("salary", "employees", "1abc");
evaluate(`move("salary", "employees", "1abc")`, result, false);

// Testing if error. move to an incorrect new space (illegal character)
result = efemem.move("salary", "employees", "config!");
evaluate(`move("salary", "employees", "config!")`, result, false);

// Testing if error. move to an incorrect new space (more than 24 characters)
result = efemem.move("salary", "employees", "configiu09olki87ujhy65tgf");
evaluate(
  `move("salary", "employees", "configiu09olki87ujhy65tgf")`,
  result,
  false
);

// If null origin space, assumes 'all' as default
//result = efemem.move("salary", null, "employees");
//evaluate(`move("salary", null, "employees")`, result, false);

// Testing if error. move a valid key from an invalid space name to a new valid space
result = efemem.move("salary", "config", "employees");
evaluate(`move("salary", "config", "employees")`, result, false);

// Testing move a valid key from a valid space name to a new valid space (public by default)
result = efemem.move("salary", "employees");
evaluate(`move("salary", "employees")`, result, true);
console.log(`result: ${JSON.stringify(result, null, 2)}`);

// Checks move without overwrite
efemem.set("maxValue", 200);
// Try to move maxValue key from config to public space (existing) without overwriting
result = efemem.move("maxValue", "config");
evaluate(`move("maxValue", "config")`, result, true);
console.log(`result: ${JSON.stringify(result, null, 2)}`);

// Try to move maxValue key from config to public space (existing) overwriting
result = efemem.move("maxValue", "config", null, true);
evaluate(`move("maxValue", "config", null)`, result, true);
console.log(`result: ${JSON.stringify(result, null, 2)}`);

// ONLY FOR EXPLICITY TESTING
// Moves all key to 'public' space
//result = efemem.move();
//evaluate(`move()`, result, true);
//console.log(`result: ${JSON.stringify(result, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
