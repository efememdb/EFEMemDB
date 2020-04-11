/*
/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
efememutils.js

Set of usefull functions used for diverse purposes on Efemem NoSQL Database
Version 1.0.0

Created by Rafael Hernamperez and released under the terms of the ISC License:
https://opensource.org/licenses/ISC



ISC License (ISC)
Copyright 2020 Rafael Hernamperez

Permission to use, copy, modify, and/or distribute this software for any 
purpose with or without fee is hereby granted, provided that the above 
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY 
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, 
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM 
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR 
OTHER TORTIOUS ACTION, ARISING OUT O
\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
*/

/* Returns the approximate memory usage, in bytes, of the specified object. The
 * parameter is:
 *
 * object - the object whose size should be determined
 */

/**
 * Validates the name of an entity (space, key, etc.)
 * @param {string} entity => Entity name to validate
 * @param {int} length => Maximum length
 * @param {regexp} regexp => Regular expression
 * @returns {JSON} => {ok: true|false, msg='message'}
 */
const validateEntity = (entity, length, regexp) => {
  // Check if the entity is a string
  if (typeof entity != "string")
    return {
      ok: false,
      msg: `'${entity}' name must be a string`,
    };

  // Check if the entity length is correct
  if (entity.length > length)
    return {
      ok: false,
      msg: `'${entity}' name is longer than ${length} characters`,
    };

  // Chek if the first character is alphapbetical
  let regex = new RegExp(/^[a-zA-Z]/);

  if (!regex.test(entity))
    return {
      ok: false,
      msg: `'${entity}' name is incorrect. First character must be alphabetical`,
    };

  // Check regular expression validation
  if (regexp.test(entity))
    return {
      ok: false,
      msg: `'${entity}' name is incorrect. Please check the use of possible ilegal special characters`,
    };

  // Validation is ok
  return {
    ok: true,
    msg: `'${entity}' name is correct`,
  };
}; // validateEntity() function

/**
 * Converts an UTC Date to Local Timezone Date
 * @param {date} UTCDate => Date
 * @returns {Date} => Date passed as parameter converted to UTC local time
 */
function UTCToLocalDate(UTCDate) {
  var newDate = new Date(
    UTCDate.getTime() + UTCDate.getTimezoneOffset() * 60 * 1000
  );

  var offset = UTCDate.getTimezoneOffset() / 60;
  var hours = UTCDate.getHours();

  newDate.setHours(hours - offset);

  return newDate;
} // UTCToLocalDate() function

/**
 * Gets the current time in local time zone
 * @returns {Date} => Current local time
 */
const getLocalNow = () => {
  return UTCToLocalDate(new Date());
};

/**
 * Gets the current time plus a given seconds
 * @param {int} seconds => Number of seconds to add to current time
 * @returns {Date} => Current time increased by seconds parameter
 */
const getDueTime = (seconds) => {
  if (seconds > 0)
    //return new Date(new Date().getTime() + (seconds * 1000)).toISOString();
    return new Date(getLocalNow().getTime() + seconds * 1000).toISOString();
  else return new Date("9999-12-31T23:59:59").toISOString();
}; // getDue() function

/**
 * Gets the difference between the moment passed as argument and current moment
 * @param {hrtime} startTime => Previous moment using process.hrtime
 * @returns {string} => Difference between startTime and current time (9s 9.999ms 9 nanosecons)
 */
const finishTime = (startTime) => {
  const diff = process.hrtime(startTime);
  const seconds = diff[0];
  const nano = diff[1];
  const micro = nano / 1000000;

  return `${seconds}s ${micro.toFixed(3)}ms (${nano} nanoseconds)`;
}; // finishTime() function

/**
 * Gets the size of a value as native type (string, number or boolean)
 * @param {any} value => Value to be calculated
 * @returns {number} => Size of value. -1 if its type is not native
 */
const getNativeSize = (value) => {
  const valueType = typeof value;

  if (valueType == "string") return value.length * 2;

  if (valueType == "number") return 8;

  if (valueType == "boolean") return 4;

  return -1; // No native type
}; // getNativeSize() function

/**
 * Gets the size of any value
 * @param {any} value => Value to be measured
 * @returns {number} => Size of value in bytes
 */
const getValueSize = (value) => {
  let items = [value]; // decomponse the value
  let size = 0;

  // Iterate over the items of the value
  for (item of items) {
    // if item is string, number or boolean
    if (typeof item != "object") size += getNativeSize(item);
    else {
      // if item is an array or object

      // If item is an array, sums the length of the name of each one
      if (Object.prototype.toString.call(item) != "[object Array]")
        for (const key in item) size += key.length * 2;

      // process each item of the array or object
      for (const key in item) {
        let found = false;

        // Look for previous processed key
        for (element of items) {
          if (element === item[key]) {
            found = true;
            break;
          }
        } // element loop

        if (!found) items.push(item[key]);
      } // key loop
    } // else type object
  } // item loop

  return size;
}; // getValueSize() function

/**
 * Gets a random Key with a give size
 * @param {int} size => Size between 16 and 1000 characters
 * @returns {string} => Random key
 */
const getRandomKey = (size = 16) => {
  let result = "";

  if (size < 1 || size > 1000) size = 16; // minimum size

  for (let i = 0; i < size; i++) {
    let ascii = 31 + Math.floor(1 + Math.random() * 95);

    if (ascii == 34 || ascii == 92) ascii = 45;

    result += String.fromCharCode(ascii);
  }

  console.log(result);
  return result;
}; // getRandomKey() function

module.exports = {
  validateEntity,
  getLocalNow,
  UTCToLocalDate,
  getDueTime,
  finishTime,
  getNativeSize,
  getValueSize,
  getRandomKey,
};
