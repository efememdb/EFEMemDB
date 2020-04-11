# delete() command

## **Syntax** 

`delete(key, space)`



## **Parameters**

| Parameter | Type   | Mandatory | Description                     |
| --------- | ------ | --------- | ------------------------------- |
| `key`     | string | Yes       | Key name                        |
| `space`   | string | No        | Space name. 'public' by default |



## **Description**

The `delete()` command removes a given key and its value from a given space name.



## **Examples**

This example will create some keys and values:

`const { efemem } = require('./efememdb.js');`

`let result = efemem.set("maxValue", 100, "config");`
`result = efemem.set("minValue", 1, "config");`
`result = efemem.set("maxValue", 3000, "sales");`
`result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")`



The following code shows you how `delete()` command works:

`result = efemem.values("", "students");`
`console.log(result before: ${JSON.stringify(result, null, 2)});`
`result = efemem.delete("student:001", "students");`
`console.log(result delete: ${JSON.stringify(result, null, 2)});`
`result = efemem.values("", "students");`
`console.log(result after: ${JSON.stringify(result, null, 2)});`



The first result shows you the existence of the student key at the `students` space. Then, this key and its value will be deleted and shows you the result of this command. At last, shows you how this key and its value were deleted trying to list the keys of the space.

`result before: {`
  `"ok": true,`
  `"cmd": "values()",`
  `"data": [`
    `{`
      `"key": "student:001",`
      `"space": "students",`
      `"value": {`
        `"name": "James",`
        `"surname": "Gordon",`
        `"job": "Police inspector"`
      `}`
    `}`
  `],`
  `"msg": "1 values found and retrieved for Key '' in space 'students'",`
  `"affected": 1,`
  `"time": "0s 0.504ms (503800 nanoseconds)"`
`}`

`result delete: {`
  `"ok": true,`
  `"cmd": "delete()",`
  `"key": "student:001",`
  `"space": "students",`
  `"value": {`
    `"name": "James",`
    `"surname": "Gordon",`
    `"job": "Police inspector"`
  `},`
  `"due": "9999-12-31T22:59:59.000Z",`
  `"created": "2020-04-10T14:24:22.584Z",`
  `"updated": "2020-04-10T14:24:22.584Z",`
  `"msg": "Key 'student:001' in space 'students' deleted successfully",`
  `"affected": 1,`
  `"time": "0s 0.709ms (708599 nanoseconds)"`
`}`

`result after: {`
  `"ok": true,`
  `"cmd": "values()",`
  `"data": {},`
  `"msg": "No values found for key '' in space 'students'",`
  `"affected": 0,`
  `"time": "0s 0.044ms (44500 nanoseconds)"`
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