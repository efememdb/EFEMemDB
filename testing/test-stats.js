const { efemem } = require("../efememdb");

console.log("\n\n***********************");
console.log("Testing command stats()");
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

// Prepare data for statistics
efemem.set("student:001|class:Python", 9.7, "qualifications");
efemem.set("student:002|class:Python", 7.5, "qualifications");
efemem.set("student:003|class:Python", 6.7, "qualifications");
efemem.set("student:001|class:JavaScript", 8.7, "qualifications");
efemem.set("student:002|class:JavaScript", 6.6, "qualifications");
efemem.set("student:003|class:JavaScript", 8.3, "qualifications");
efemem.set("student:001|class:Java", "9.2", "qualifications");
efemem.set("student:002|class:Java", "9.5", "qualifications");
efemem.set("student:003|class:Java", "8.9", "qualifications");
efemem.set("student:005|class:Python", 5.8, "qualifications");

// Testing. stats () success. Statistics over key "Python" on any space
result = efemem.stats("Python");
evaluate(`stats("Python")`, result, true);

if (result.data.count != 4) {
  console.log(
    `> testing: stats("Python")\n   *** [ERROR] *** Expected 4 keys (${result.data.count} found)`
  );
  ko++;
} else {
  console.log(`> testing: stats("Python")\n   [OK] ${result.data.count} found`);
  ok++;
}

// Testing. stats () success. Statistics over key "Java" on space "qualifications"
result = efemem.stats("Java", "qualifications");
evaluate(`stats("Java", "qualifications")`, result, true);

if (result.data.count != 6) {
  console.log(
    `> testing: stats("Java", "qualifications")\n   *** [ERROR] *** Expected 6 keys (${result.data.count} found)`
  );
  ko++;
} else {
  console.log(
    `> testing: stats("Java", "qualifications")\n   [OK] ${result.data.count} found`
  );
  ok++;
}

// Testing. stats () success. Statistics over key "student:001" on space "qualifications"
result = efemem.stats("student:001", "qualifications");
evaluate(`stats("student:001", "qualifications")`, result, true);

if (result.data.count != 3) {
  console.log(
    `> testing: stats("student:001", "qualifications")\n   *** [ERROR] *** Expected 3 keys (${result.data.count} found)`
  );
  ko++;
} else {
  console.log(
    `> testing: stats("student:001", "qualifications")\n   [OK] ${result.data.count} found`
  );
  ok++;
}

console.log(`result: ${JSON.stringify(result, null, 2)}`);

console.log("\n-------------------------------------");
console.log(`OK: ${ok} vs KO: ${ko}`);

if (ko > 0) console.log(`\n\n****** THERE ARE ${ko} ERRORS ******`);
console.log("-------------------------------------");
