# get() command

## **Syntax** 

`get(key, space)`



## **Parameters**

| Parameter | Type   | Mandatory | Description                     |
| --------- | ------ | --------- | ------------------------------- |
| `key`     | string | Yes       | Key name                        |
| `space`   | string | No        | Space name. 'public' by default |



## **Description**

The `get()` command retrieves a value from a given key name from a given space name. 



## **Examples**

This example will create and retrieve a valid key:

`const { efemem } = require('./efememdb.js');`

`let result = efemem.set("maxValue", 100, "config");`
`result = efemem.get("maxValue", "config")`
`console.log(result: ${JSON.stringify(result, null, 2)});`



This code will print the following result:

`result: {`
  `"ok": true,`
  `"cmd": "get()",`
  `"data": {`
    `"value": 100,`
    `"due": "9999-12-31T23:59:59.000Z",`
    `"updated": "2020-04-10T12:18:55.509Z",`
    `"created": "2020-04-10T12:18:55.509Z"`
  `},`
  `"msg": "Key 'maxValue' in space 'config' found and retrieved successfully",`
  `"affected": 1,`
  `"time": "0s 0.352ms (351799 nanoseconds)"`
`}`



This example will provoke an error, because you are creating the key in the `'config'` space name, and you are trying to get the key from the `'public'` space name (by default):

`const { efemem } = require('./efememdb.js');`

`let result = efemem.set("maxValue", 100, "config");`
`result = efemem.get("maxValue")`
`console.log(result: ${JSON.stringify(result, null, 2)});`



The previous code will print the following result:

`result: {`  

   `"ok": false,`  

   `"cmd": "get()",`  

   `"data": {},`  

   `"msg": "Error: key 'maxValue' in space 'public' not found",`  

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