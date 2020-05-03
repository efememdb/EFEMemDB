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

// Testing get() without parameters. All keys at 'public' space (2 keys)
result = efemem.get();
evaluate(`get()`, result, true);
console.log(`result: ${JSON.stringify(result, null, 2)}`);

// Testing get() with key null. All keys at 'public' space (2 keys)
result = efemem.get(null);
evaluate(`get(null)`, result, true);

// Testing get(). key 123 at 'public' space not found
result = efemem.get(123);
evaluate(`get(123)`, result, true);

// Testing get() key '1abc' at 'public' space not found
result = efemem.get("1abc");
evaluate(`get("1abc")`, result, true);

// Testing get() key 'maxValue!' at 'public' space not found
result = efemem.get("maxValue!");
evaluate(`get("maxValue!")`, result, true);

// Testing get() a key not found
result = efemem.get(
  "maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723"
);
evaluate(
  `get("maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723")`,
  result,
  true
);

// Testing get() a key not found
result = efemem.get("maxValue", "1abc");
evaluate(`get("maxValue", "1abc")`, result, true);

// Testing get() a key not found
result = efemem.get("maxValue", "config!");
evaluate(`get("maxValue", "config!")`, result, true);

// Testing get() a key not found
result = efemem.get("maxValue", 100, "configiu09olki87ujhy65tgf");
evaluate(`get("maxValue", 100, "configiu09olki87ujhy65tgf")`, result, true);

// Testing if error. get with an existing key, but not in the 'public' space
result = efemem.get("maxValue");
evaluate(`get("maxValue")`, result, true);

// Testing a non existing key
result = efemem.get("employee:007", "employees");
evaluate(`get("employee:007", "employees")`, result, true);

// Testing an existing key
result = efemem.get("employee:001", "employees");
evaluate(`get("employee:001", "employees")`, result, true);

// Testing an existing key with full info
result = efemem.get("employee:001", "employees", true);
evaluate(`get("employee:001", "employees", true)`, result, true);
console.log(`result: ${JSON.stringify(result, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
