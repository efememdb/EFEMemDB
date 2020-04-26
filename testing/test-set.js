const { efemem } = require("../efememdb");

console.log("\n\n*********************");
console.log("Testing command set()");
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

// Testing simple "hello" "world" in 'public' space
result = efemem.set("hello", "world");
evaluate(`set("hello", "world)`, result, true);

// Testing if error. set() without parameters (no value provided)
result = efemem.set();
evaluate(` efemem.set()`, result, false);

// Testing if error. set() without value
result = efemem.set("maxValue");
evaluate(`set("maxValue")`, result, false);

// Testing if error. set() with incorrect key (null). By default, key hash
result = efemem.set(null, 100);
evaluate(`set(null, 100)`, result, true);
console.log(`result: ${JSON.stringify(result, null, 2)}`);
// Testing if error. set() with incorrect key (no string name)
result = efemem.set(123, 100);
evaluate(`set(123, 100)`, result, false);

// Testing if error. set() with incorrect key (first character not alphabetical)
result = efemem.set("1abc", 100);
evaluate(`set("1abc", 100)`, result, false);

// Testing if error. set() with incorrect key (illegal character)
result = efemem.set("maxValue!", 100);
evaluate(`set("maxValue!", 100)`, result, false);

// Testing if error. set() with incorrect key (More than 100 characters)
result = efemem.set(
  "maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723",
  100
);
evaluate(
  `set("maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723", 100)`,
  result,
  false
);

// Testing if error. set with incorrect space (first character not alphabetical)
result = efemem.set("maxValue", 100, "1abc");
evaluate(`set("maxValue", 100, "1abc")`, result, false);

// Testing if error. set with incorrect space (illegal character)
result = efemem.set("maxValue", 100, "config!");
evaluate(`set("maxValue", 100, "config!")`, result, false);

// Testing if error. set with incorrect space (more than 24 characters)
result = efemem.set("maxValue", 100, "configiu09olki87ujhy65tgf");
evaluate(`set("maxValue", 100, "configiu09olki87ujhy65tgf")`, result, false);

// Testing set(). key="maxValue", value=100. space="config"  (integer value)
result = efemem.set("maxValue", 100, "config");
evaluate(`set("maxValue", 100, "config")`, result, true);

// Testing set(). key="salary", value=1234.56. space="employees"  (float value)
result = efemem.set("salary", 1234.56, "employees");
evaluate(`set("salary", 1234.56, "employees")`, result, true);

// Testing set(). key="job", value="IT Developer". space="employees"  (text value)
result = efemem.set("job", "IT Developer", "employees");
evaluate(`set("job", "IT Developer", "employees")`, result, true);

// Testing set(). key="cacheUsage", value=false, space="config"  (boolean value)
result = efemem.set("cacheUsage", false, "config");
evaluate(`set("cacheUsage", false, "config")`, result, true);

// Testing set() with an array value
result = efemem.set(
  "languages",
  ["NodeJS", "JavaScript", "Go", "Python", "C++"],
  "employees"
);
evaluate(`set() with array`, result, true);

// Testing set() with a JSON object
result = efemem.set(
  "employee:001",
  { name: "Rafael", surname: "Hernamperez", position: "CTO" },
  "employees"
);
evaluate(`set() with JSON object`, result, true);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
