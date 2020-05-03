/*
/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
examples.js

EFEMem NoSQL DataBase example for NodeJS
Version 1.0.7

Created by Rafael Hernamperez and released under the terms of the ISC License:
https://opensource.org/licenses/ISC

ISC License (ISC)
Copyright 2020 Rafael Hernamperez

\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
*/
const { efemem } = require("../efememdb");

// EFEMem Database version
console.log(efemem.info());

// Environment
if (!efemem.webEnv) console.log(`EFEMem DB is running on NodeJS`);
else console.log(`EFEMem DB is running out of NodeJS`);

// Data assignation
// Integer value
let result = efemem.set("maxValue", 100, "config");
// Float value
result = efemem.set("salary", 1234.56, "employees");
// Text value
result = efemem.set("job", "IT Developer", "employees");
// Boolean value
result = efemem.set("cacheUsage", false, "config");
// Array value
result = efemem.set(
  "languages",
  ["NodeJS", "JavaScript", "Go", "Python", "C++"],
  "employees"
);
// JSON object value
result = efemem.set(
  "employee:001",
  { name: "Rafael", surname: "Hernamperez", position: "CTO" },
  "employees"
);

// Get data
result = efemem.get("employee:001", "employees");
console.log(`Employee: ${JSON.stringify(result, null, 2)}`);

// Spaces list
result = efemem.spaces();
console.log(`Spaces: ${JSON.stringify(result, null, 2)}`);

// Keys list
result = efemem.keys(); // All the keys
console.log(`Keys: ${JSON.stringify(result, null, 2)}`);
result = efemem.keys("", "config"); // All the keys from 'config' space
console.log(`'config' keys: ${JSON.stringify(result, null, 2)}`);

// Get values of the keys from '*emp*' space (employees)
result = efemem.get("", "emp");
console.log(`'*emp*' values: ${JSON.stringify(result, null, 2)}`);

// rename 'employee:001' to 'employee:007'
result = efemem.rename("employee:001", "employee:007", "employees");
console.log(`'Rename:' values: ${JSON.stringify(result, null, 2)}`);

// Move key 'salary' to 'public' space
result = efemem.move("salary", "employees");
console.log(`Move: ${JSON.stringify(result, null, 2)}`);
result = efemem.get("", "public");
console.log(`values: ${JSON.stringify(result, null, 2)}`);

// Copy key 'salary' from 'public' space to 'employees' space
result = efemem.copy("salary", "public", "salary", "employees");
console.log(`copy: ${JSON.stringify(result, null, 2)}`);
result = efemem.get("salary");
console.log(`'keys "salary"' values: ${JSON.stringify(result, null, 2)}`);

// Delete key 'job' from 'employees' space
result = efemem.delete("job", "employees");
console.log(`Delete: ${JSON.stringify(result, null, 2)}`);

// Final Data
console.log("----------");
console.log("FINAL DATA");
console.log("----------");
result = efemem.spaces();
console.log(`Spaces: ${JSON.stringify(result, null, 2)}`);
result = efemem.keys(); // All the keys
console.log(`Keys: ${JSON.stringify(result, null, 2)}`);
result = efemem.get();
console.log(`values: ${JSON.stringify(result, null, 2)}`);
console.log(`info: ${JSON.stringify(efemem.info(), null, 2)}`);

// Delete key 'job' from 'employees' space
result = efemem.memory();
console.log(`Memory: ${JSON.stringify(result, null, 2)}`);

// Persist data
result = efemem.persist();
console.log(`persist: ${JSON.stringify(result, null, 2)}`);

// Restore data
result = efemem.restore();
console.log(`restore: ${JSON.stringify(result, null, 2)}`);

// Values
result = efemem.get();
console.log(`values: ${JSON.stringify(result, null, 2)}`);

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

// Statistics for Python
result = efemem.stats("Python");
console.log(`Python Statistics: ${JSON.stringify(result, null, 2)}`);

// Statistics for class Java and JavaScript
result = efemem.stats("Java", "qualifications");
console.log(`Java Statistics: ${JSON.stringify(result, null, 2)}`);

// Statistics for student 001
result = efemem.stats("student:001", "qualifications");
console.log(`Student 001 Statistics: ${JSON.stringify(result, null, 2)}`);

// Space information
result = efemem.spaceInfo("qualifications");
console.log(`space 'qualifications' info: ${JSON.stringify(result, null, 2)}`);

// Persist data
result = efemem.persist();
console.log(`persist: ${JSON.stringify(result, null, 2)}`);
