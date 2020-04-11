# set() command

## **Syntax** 

`set(key, value, space, due)`



## **Parameters**

| Parameter | Type                                  | Mandatory | Description                                              |
| --------- | ------------------------------------- | --------- | -------------------------------------------------------- |
| `key`     | string                                | Yes       | Key name                                                 |
| `value`   | number, string, boolean, array object | Yes       | Value                                                    |
| `space`   | string                                | No        | Space name. 'public' by default                          |
| `due`     | number                                | No        | Due time seconds. By default, the key will never expire. |



## **Description**

The `set()` command defines a value and associates it to a key name in a give space name. 

The key is grouped into a space name. If the space name is not provided, the key will be grouped into the `'public'` space name by default.

`set("maxValue", 100);`



The key name must unique in a given space name. You can define keys with the same name, but unique into a given space name.

`set("maxValue", 100, "config");`

`set("maxValue", 10, "qualifies");`



If the key had not previously defined, it will be created. If the key had previously defined, it will replaced with the new/last value (update).

`set("maxValue", 100, "config"); // First time: creation`

`set("maxValue", 120, "config"); // Updates and replaces previous value`



If you pass the `due` parameter, you will specify the number of seconds of expiration for the key, since this moment. It means, the key will be deleted automatically when the seconds specified has passed.

`set("maxValue", 100, "config", 30);  // 30 seconds key life`



## **Examples**

This example will create a valid key into the `config` space name, with a time expiration of 30 seconds:

`const { efemem } = require('./efememdb.js');`

`let result = efemem.set("maxValue", 100, "config", 30);`

`console.log(result: ${JSON.stringify(result, null, 2)});`



This code will print the following result:

`result: {`  

   `"ok": true,`  

   `"cmd": "set()",`  

   `"data": {`    

​      `"value": 100,`    

​      `"due": "2020-04-10T11:44:00.896Z",`    

​      `"updated": "2020-04-10T11:43:30.896Z",`    

​      `"created": "2020-04-10T11:43:30.896Z"`  

   `},`  

   `"msg": "Key 'maxValue' saved successfully in space 'config'",`  

   `"affected": 1,`  

   `"time": "0s 1.098ms (1098099 nanoseconds)"` 

`}` 



This example will provoke an error:

`const { efemem } = require('./efememdb.js');`

`let result = efemem.set("7maxValue", 100, "config", 30);`

`console.log(result: ${JSON.stringify(result, null, 2)});`



This code will print the following result:

`result: {`
  `"ok": false,`
  `"cmd": "set()",`
  `"data": 100,`
  `"msg": "Error on key: '7maxValue' name is incorrect. First character must be alphabetical",`
  `"affected": 0`
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