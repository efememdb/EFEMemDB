const { efemem } = require("../efememdb");

console.log("\n\n************************");
console.log("Testing command rename()");
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

// Testing if error. rename() without parameters
result = efemem.rename();
evaluate(`rename()`, result, false);

// Testing if error. rename() with incorrect key (null)
result = efemem.rename(null);
evaluate(`rename(null)`, result, false);

// Testing if error. rename() with incorrect key (no string name)
result = efemem.rename(123);
evaluate(`rename(123)`, result, false);

// Testing if error. rename() with incorrect key (first character not alphabetical)
result = efemem.rename("1abc");
evaluate(`rename("1abc")`, result, false);

// Testing if error. rename() with incorrect key (illegal character)
result = efemem.rename("maxValue!");
evaluate(`rename("maxValue!")`, result, false);

// Testing if error. rename() with incorrect key (More than 100 characters)
result = efemem.rename(
  "maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723"
);
evaluate(
  `rename("maxValueqweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723")`,
  result,
  false
);

// Testing if error. rename a valid key with a null new name
result = efemem.rename("employee:001", null, "employees");
evaluate(`rename("employee:001", null, "employees")`, result, false);

// Testing if error. rename a valid key with a number as new name
result = efemem.rename("employee:001", 123, "employees");
evaluate(`rename("employee:001", 123, "employees")`, result, false);

// Testing if error. rename a valid key with a new name with a non first character as alphabetical
result = efemem.rename("employee:001", "1abc", "employees");
evaluate(`rename("employee:001", "1abc", "employees")`, result, false);

// Testing if error. rename a valid key with a new name illegal characters
result = efemem.rename("employee:001", "employee:007!", "employees");
evaluate(`rename("employee:001", "employee:007!", "employees")`, result, false);

// Testing if error. rename a valid key with a new name with more than 100 characters
result = efemem.rename(
  "employee:001",
  "employee:007qweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723",
  "employees"
);
evaluate(
  `rename("employee:001", "employee:007qweiutyqw573456y23478tyqweiutyqewi57832465897346tr87wqyetiuqweyt2347856234875yt6iequwyteiqwuty34896723", "employees")`,
  result,
  false
);

// Testing if error. rename a valid key and a valid new name, but not in the 'public' space
result = efemem.rename("employee:001", "employee:007");
evaluate(`rename("employee:001", "employee:007")`, result, false);

// Testing rename a valid key and a valid new name in a valid space
result = efemem.rename("employee:001", "employee:007", "employees");
evaluate(`rename("employee:001", "employee:007", "employees")`, result, true);

console.log(`result: ${JSON.stringify(result, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
