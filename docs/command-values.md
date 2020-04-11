# values() command

## **Syntax** 

`values(key, space)`



**Parameters**

| Parameter | Type   | Mandatory | Description        |
| --------- | ------ | --------- | ------------------ |
| `key`     | string | No        | Key name pattern   |
| `space`   | string | No        | Space name pattern |



## **Description**

The `values()` command retrieves a list of values corresponding to a pattern key or/and a pattern space. The pattern is, simply, a set of characters, which could be located on any position in the name of the key or the space.

If no pattern is passed as parameter, will assume all the keys or spaces. You can also use the asterisc character (*) as pattern for all keys or spaces.



**Note:** *`keys()` and `values()` commands are very similar. `keys()` command retrieves only the key and the space name. `values()` command retrieves the key, the space and the full detail data.*



## **Examples**

The following code will create some keys:

`const { efemem } = require('./efememdb.js');`



`let result = efemem.set("maxValue", 100, "config");`

`result = efemem.set("minValue", 1, "config");`

`result = efemem.set("maxValue", 3000, "sales");`

`result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")`



If you want to list all defined values, you can use any of these commands:

`result = efemem.values();`
`result = efemem.values("");`
`result = efemem.values("", "");`
`result = efemem.values("*");
result = efemem.values("*", "*");`



In any case, the result will be following one:

`result: {`
  `"ok": true,`
  `"cmd": "values()",`
  `"data": [`
    `{`
      `"key": "maxValue",`
      `"space": "config",`
      `"value": 100`
    `},`
    `{`
      `"key": "minValue",`
      `"space": "config",`
      `"value": 1`
    `},`
    `{`
      `"key": "maxValue",`
      `"space": "sales",`
      `"value": 3000`
    `},`
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
  `"msg": "4 values found and retrieved for Key '*' in space '*'",`
  `"affected": 4,`
  `"time": "0s 1.109ms (1109300 nanoseconds)"`
`}`



You can list all the values associated to the keys grouped on a given space name:

`result = efemem.values("*", "config");`



The result will be:

`result: {`
  `"ok": true,`
  `"cmd": "values()",`
  `"data": [`
    `{`
      `"key": "maxValue",`
      `"space": "config",`
      `"value": 100`
    `},`
    `{`
      `"key": "minValue",`
      `"space": "config",`
      `"value": 1`
    `}`
  `],`
  `"msg": "2 values found and retrieved for Key '*' in space 'config'",`
  `"affected": 2,`
  `"time": "0s 0.686ms (685699 nanoseconds)"`
`}`



If you want to get the values of a given key on any space, you can use any of these commands:

`result = efemem.values("maxValue");`
`result = efemem.values("maxValue", "");`
`result = efemem.values("maxValue", "*");`



The result will be the following one:

`result: {`
  `"ok": true,`
  `"cmd": "values()",`
  `"data": [`
    `{`
      `"key": "maxValue",`
      `"space": "config",`
      `"value": 100`
    `},`
    `{`
      `"key": "maxValue",`
      `"space": "sales",`
      `"value": 3000`
    `}`
  `],`
  `"msg": "2 values found and retrieved for Key 'maxValue' in space '*'",`
  `"affected": 2,`
  `"time": "0s 0.750ms (750500 nanoseconds)"`
`}`



The following command will get all values associated to the keys that contains the pattern 'lu' as part of the key name:

`result = efemem.values("lu");`



The result will be: 

`result: {`
  `"ok": true,`
  `"cmd": "values()",`
  `"data": [`
    `{`
      `"key": "maxValue",`
      `"space": "config",`
      `"value": 100`
    `},`
    `{`
      `"key": "minValue",`
      `"space": "config",`
      `"value": 1`
    `},`
    `{`
      `"key": "maxValue",`
      `"space": "sales",`
      `"value": 3000`
    `}`
  `],`
  `"msg": "3 values found and retrieved for Key 'lu' in space '*'",`
  `"affected": 3,`
  `"time": "0s 0.908ms (908201 nanoseconds)"`
`}`



The following commands will list all values of the keys located on a space that contains an `'e'` in its name:

`result = efemem.values("", "e");`

`result = efemem.values("*", "e");`



The result will be the following one:

`result: {`
  `"ok": true,`
  `"cmd": "values()",`
  `"data": [`
    `{`
      `"key": "maxValue",`
      `"space": "sales",`
      `"value": 3000`
    `},`
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
  `"msg": "2 values found and retrieved for Key '*' in space 'e'",`
  `"affected": 2,`
  `"time": "0s 0.683ms (682700 nanoseconds)"`
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