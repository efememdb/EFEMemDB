const { efemem } = require("../efememdb");

console.log("\n\n**********************");
console.log("Testing command copy()");
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

// Testing if error. copy() without parameters
result = efemem.copy();
evaluate(`copy()`, result, false);

// Testing if error. copy() with incorrect key (null)
result = efemem.copy(null);
evaluate(`copy(null)`, result, false);

// Testing if error. copy() with incorrect key (no string name)
result = efemem.copy(123);
evaluate(`copy(123)`, result, false);

// Testing if error. copy() with incorrect key (first character not alphabetical)
result = efemem.copy("1abc");
evaluate(`copy("1abc")`, result, false);

// Testing if error. copy() with incorrect key (illegal character)
result = efemem.copy("maxValue!");
evaluate(`copy("maxValue!")`, result, false);

// Testing if error. copy() with incorrect key (More than 100 characters)
result = efemem.copy(
  "maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723"
);
evaluate(
  `copy("maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723")`,
  result,
  false
);

// Testing if error. move from an incorrect space (first character not alphabetical)
result = efemem.copy("maxValue", "1abc");
evaluate(`copy("maxValue", "1abc")`, result, false);

// Testing if error. move from an incorrect space (illegal character)
result = efemem.copy("maxValue", "config!");
evaluate(`copy("maxValue", "config!")`, result, false);

// Testing if error. move from an incorrect space (more than 24 characters)
result = efemem.copy("maxValue", "configiu09olki87ujhy65tgf");
evaluate(`copy("maxValue", "configiu09olki87ujhy65tgf")`, result, false);

// Testing if error. copy() with incorrect destination key (no string name)
result = efemem.copy("salary", "public", 123);
evaluate(`copy("salary", "public", 123")`, result, false);

// Testing if error. copy() with incorrect destination key (first character not alphabetical)
result = efemem.copy("salary", "public", "1abc");
evaluate(`copy("salary", "public", "1abc")`, result, false);

// Testing if error. copy() with incorrect destination key (illegal character)
result = efemem.copy("salary", "public", "maxValue!");
evaluate(`copy("salary", "public", "maxValue!")`, result, false);

// Testing if error. copy() with incorrect destination key (More than 100 characters)
result = efemem.copy(
  "salary",
  "public",
  "maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723"
);
evaluate(
  `copy("salary, "public", "maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723")`,
  result,
  false
);

// Testing if error. copy() with incorrect destination space (no string name)
result = efemem.copy("salary", "public", "payment", 123);
evaluate(`copy("salary", "public", "payment", 123)`, result, false);

// Testing if error. copy() with incorrect destination space (first character not alphabetical)
result = efemem.copy("salary", "public", "payment", "1abc");
evaluate(`copy("salary", "public", "payment", "1abc")`, result, false);

// Testing if error. copy() with incorrect destination space (illegal character)
result = efemem.copy("salary", "public", "payment", "maxValue!");
evaluate(`copy("salary", "public", "payment", "maxValue!")`, result, false);

// Testing if error. copy() with incorrect destination key (More than 100 characters)
result = efemem.copy(
  "salary",
  "public",
  "payment",
  "configiu09olki87ujhy65tgf"
);
evaluate(
  `copy("salary, "public", "payment", "configiu09olki87ujhy65tgf")`,
  result,
  false
);

// Testing if error. copy() with same origin and destination keys
result = efemem.copy("salary", "public", "salary", "public");
evaluate(`copy("salary", "public", "salary", "public")`, result, false);

// Testing if error. copy() with same origin and destination keys ('public' by default)
result = efemem.copy("salary", "public", "salary");
evaluate(`copy("salary", "public", "salary")`, result, false);

// Testing if error. copy() with same origin and destination keys ('public' by default)
result = efemem.copy("salary", "public");
evaluate(`copy("salary", "public")`, result, false);

// Testing. copy () success. Copy with same key into other space
result = efemem.copy("salary", "public", "", "employees");
evaluate(`copy("salary", "public", "", "employees")`, result, true);

result = efemem.values("salary");
console.log(`result: ${JSON.stringify(result, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
