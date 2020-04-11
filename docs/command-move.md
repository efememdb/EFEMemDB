# move() command

## **Syntax** 

`move(key, space, newSpace)`



## **Parameters**

| Parameter  | Type   | Mandatory | Description                                       |
| ---------- | ------ | --------- | ------------------------------------------------- |
| `key`      | string | Yes       | Key name                                          |
| `space`    | string | Yes       | Space name (origin)                               |
| `newSpace` | string | No        | New space name (destination). 'public' by default |



## **Description**

The `move()`  command moves a given key from an existing space name (origin) to another space name (destination). 

If space name is not provided, `'public'` space will be assumed by default.

If destination space name is non-existent, a new space name will be created.



## **Examples**

This example will create one key and its value:

`const { efemem } = require('./efememdb.js');`

`let result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")`



The following command will try to move the key, but no space names were specified, assuming `'public'` as default space name:

`result = efemem.move("student:001");`



This is the result:

`result: {`
  `"ok": false,`
  `"cmd": "move()",`
  `"data": {},`
  `"msg": "Error: key 'student:001' in space 'public' not found",`
  `"affected": 0,`
  `"time": "0s 0.276ms (276300 nanoseconds)"`
`}`



The following command will move the student to a new space named `'approbed'`:

`result = efemem.move("student:001", "students", "approbed");`



The result is the following one:

`result: {`
  `"ok": true,`
  `"cmd": "move()",`
  `"data": {`
    `"name": "James",`
    `"surname": "Gordon",`
    `"job": "Police inspector"`
  `},`
  `"msg": "Key 'student:001' at space 'students' was moved to space 'approbed'",`
  `"affected": 1,`
  `"time": "0s 0.330ms (330300 nanoseconds)"`
`}`





## **Key name rules**

The rules for a key name are the following:

- Maximum length of 100 characters.
- You can use  alphabetical and numeric characters.
- You can use special characters as separators. These special characters are: "|" (pipe), "#" (number), "_" (underscore), ":" (colon) and "." (period or point)
- The first character must be alphabetical.
- Lowercase and uppercase letters.
- Case sensitive. Lowercase and uppercase are different values.



Correct key names could be the following:

- **maximumValue**
- **course|English|2020**
- **student:001|city:020**



The key must be a set of relevant information, that helps you to find and identify the associated value. For example, the key **student:001|city:020** contains the student and city ids, and you will search the value using this information or part of this data.

Incorrect key names example are the following:

- **course English** (space is not allowed)
- **2020course** (first character cannot be numeric)
- **student:001@city:020** (character @ is not allowed)



## **Space name rules**

The rules for the space names are the following:

- Maximum length of 24 characters.
- Only alphabetical and numeric characters.
- The first character must be alphabetical.
- Lowercase and uppercase letters.
- Case sensitive. Lowercase and uppercase are considered as different values.



Correct space names could be the following:

- **config**
- **course2020**
- **salesAndRevenue**



Incorrect space names could be the following:

- **course 2020** (space is not allowed)
- **2020course** (first character cannot be numeric)
- **sales&revenue** (ampersand is not allowed)