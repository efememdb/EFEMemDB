# rename() command

## **Syntax** 

`rename(key, newKey, space)`



**Parameters**

| Parameter | Type   | Mandatory | Description                       |
| --------- | ------ | --------- | --------------------------------- |
| `key`     | string | Yes       | Key name                          |
| `newKey`  | string | Yes       | New key name. 'public' by default |
| space     | string | No        | Space name. 'public' by default   |



## **Description**

The `rename()` command changes the name of an existing key on a given space name. 

If space name is not provided, `'public'` space will be assumed by default.



## **Examples**

This example will create one key and its value:

`const { efemem } = require('./efememdb.js');`

`let result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")`



The following commands changes the name of the key with a new student id and shows you the result:

`result = efemem.rename("student:001", "student:007", "students");`
`console.log(result rename: ${JSON.stringify(result, null, 2)});`
`result = efemem.values("", "students");`
`console.log(result after: ${JSON.stringify(result, null, 2)});`



Here is the result: 

`result rename: {`
  `"ok": true,`
  `"cmd": "rename()",`
  `"data": {`
    `"name": "James",`
    `"surname": "Gordon",`
    `"job": "Police inspector"`
  `},`
  `"msg": "Key 'student:001' at space 'students' was renamed as 'student:007'",`
  `"affected": 1,`
  `"time": "0s 0.291ms (291500 nanoseconds)"`
`}`

`result after: {`
  `"ok": true,`
  `"cmd": "values()",`
  `"data": [`
    `{`
      `"key": "student:007",`
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
  `"time": "0s 0.728ms (727800 nanoseconds)"`
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