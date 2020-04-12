/*
/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
examples.js

EFEMem NoSQL DataBase examples
Version 1.0.4

Created by Rafael Hernamperez and released under the terms of the ISC License:
https://opensource.org/licenses/ISC

ISC License (ISC)
Copyright 2020 Rafael Hernamperez

\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
*/
const { efemem } = require("efememdb");

// EFEMem Database version
console.log(efemem.info());

// Environment
if (efemem.nodejsEnv) console.log(`EFEMem DB is running on NodeJS`);
else console.log(`EFEMem DB is running out of NodeJS`);

// Data assignation
// Integer value
let result = efemem.set("maxValue", 100, "config");
// Float value
result = efemem.set("salary", "1234.56", "employees");
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
result = efemem.values("", "emp");
console.log(`'*emp*' values: ${JSON.stringify(result, null, 2)}`);

// Move key 'salary' to 'public' space
result = efemem.move("salary", "employees");
console.log(`Move: ${JSON.stringify(result, null, 2)}`);
result = efemem.values("", "public");
console.log(`'public' values: ${JSON.stringify(result, null, 2)}`);

// Delete key 'job' from 'employees' space
result = efemem.delete("job", "employees");
console.log(`Delete: ${JSON.stringify(result, null, 2)}`);

// Statistics
result = efemem.stats();
console.log(`Statistics: ${JSON.stringify(result, null, 2)}`);

console.log(efemem.info());
