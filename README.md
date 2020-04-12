# EFEMem DB

**Easy, Fast and Efficient MEMory NoSQL DataBase**

**version 1.0.4**

<img src="EFEMemDB-icon.png" alt="EFEMem NoSQL Database" style="zoom:50%;" />

*Created by Rafael Hernamperez and released under the terms of the ISC License:*

https://opensource.org/licenses/ISC



**ISC License (ISC)**
**Copyright 2020 Rafael Hernamperez**

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.



## Description

**EFEMem DB** is an ultra-light, fast and efficient NoSQL database, based on key-value pairs, running entirely on RAM memory.

With a few and very easy commands, you can take the control of your data.



`const { efemem } = require('efememdb');`

`let result = efemem.set("hello", "world");`

`result = efemem.get("hello");`





## Features

These are the main features of **EFEMem DB**:

- **Easy to install.** 
- **No third-party dependencies.** All the code is own.
- **Ultra-fast read and write access** (few nanoseconds).
- **Hot configuration.** You can change configuration while **EFEMem DB** is running.
- **Recycling mode data.** You can use this mode in order to contain a maximum number of keys. For example, you can store the 1000 last logs or requests or any other data. When the bucket is full, the next key will be added to the bottom after the first key (the oldest) is deleted.
- **Life time key.** You can define the life time of a given key. For example, you can create a key that expires in 30 seconds.
- **Powerful commands.** You can control the data with a few and easy commands.
- **Persistence.** The data can be saved into disk and restore it when you want.
- **NoSQL.** You don't need complex relationships between tables, or strict schemas. You use key-value pairs.
- **Space names.** You can organize your keys using space names. You can use keys with the same name, but unique in different spaces.
- **Rich data.** You can use different types of data:
  - integer numbers
  - float numbers
  - string text
  - boolean
  - arrays
  - JSON objects



### Best usage

You can use this amazing data base in your NodeJS, as a complementary database for highly and immediate availability of data, such as real-time monitoring, recycled logs, cache, configuration, master data, etc.

You also can use **EFEMem DB** in your web applications, without need to call remote, heavy and slow APIs, storing and retrieving data for local web purposes. It's ideally for PWAs.



## EFEMem DB in NodeJS

### Installation

The recommended installation of EFEMem DB is via `npm`:

`npm install efememdb -save`



After that, you can use **EFEMem DB** in your code importing the `efemem` object:

`const { efememdb } = require('efememdb');`



You can install manually **EFEMem DB** easily, copying the directory in your NodeJS project. Then, you can import the `efemem` object with this line:

`const { efemem } = require('install_path/efememdb.js');`





## Concepts

### Spaces

The spaces organize or group the keys under a single and common name, in order to facilitate the search and storage ot the values.



### Keys

One key identify in explicity way a given value.

The name of a key is unique in the space name in which is stored. You can define keys with the same name, but unique on its space name.

You will use the key in order to access to the values. For this reason, the name of the key must be powerfully significant and relevant. 

You can use simple names, or, depending on the number and complexity of data structure, you can use composed names, using special characters (like colon, pipe or number), in order to organize the parts of the key name.

For example, this key:

`student:001|city:002|course:012`

contains relevant informartion in order to associate and find the value:

- Student ID = 001
- City ID = 002
- Course ID = 012



### Values

Each value is associated to an unique key. You can use different types of values:

- numbers
- text
- boolean
- array
- JSON objects



### Define keys and values

You can define a key using this command:

`efemem.set("language:en", "English");`

`efemem.set("language:es", "Spanish");`



By default, **EFEMem DB** uses the space name `'public'` in order to store the keys.

A good practice is to organize the keys under an explicit space name:

`efemem.set("language:en", "English", "languages");`

`efemem.set("language:es", "Spanish", "languages");`



Now, the keys are more easily to remember for search them, because we know the space name in which they are stored.

Remember: you can use complex data as value:

`efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students");`

`efemem.set("califications", [4.5, 5.5, 6.2, 9, 7.3], "students");`



### Retrieve a key and value

You can retrieve a value through its key, using the following command:

`efemem.get("language:en", "languages");`

The space name is optional, but is highly recommend its usage. If you don't use a space name, **EFEMem DB** assumes the `'public'` space name by default.



### Delete a key and value

You can remove a value through its key, using the following command:

`efemem.delete("language:en", "languages");`

The space name is optional, but is highly recommend its usage. If you don't use a space name, **EFEMem DB** assumes the `'public'` space name by default.



### List of spaces

When you are using extensively the database, you will have many keys. Using space names will facilitate you the organization and the search of the keys.

If you want to remember the space names that you are using, simply execute the following command:

`efemem.spaces();`



### List of keys

You can list all the keys using any of the following command:

`efemem.keys();`

`efemem.keys("");`

`efemem.keys("*");`



If you have many keys, it will be more easily and efficient specifying the space name:

`efemem.keys("", "languages");`



The `keys()` command is very versatile, because the name of the key or the space is used as pattern. This pattern is, simply, a set of characters that are used as part of the complete name. You can use one or more characters.

Imagine you are using the following keys:

`student:001|city:002|course:012`

`student:002|city:002|course:012`

`student:001|city:001|course:007`

`student:010|city:003|course:012`

`student:011|city:003|course:007`



You can use patterns like these:

- `course:012` - Filter keys by course id 012
- `city:003` - Filter keys by city id 003



The same concept can be applied to the space names, or for both. 

For example: imagine you have space names that identify courses for each country (among many others). You will have the following space names: `"coursesUK"`, `"coursesGB"`, `"coursesIT"`, `"coursesFR"` and `"coursesES"`.

The following command will retrieve all the keys for the course ID 002 in all countries:

`efemem.keys("course:002", "courses");`



### List of values

You can retrieve the values filtering the keys in the same way you can do with the `keys()` command. 

The `keys()` command and the `values()` command works in the same way. The difference is the result. `keys()` command returns the list of keys and space names, meanwhile `values()` command returns the full data about the value, key and space.

**Examples:**

`result = efemem.keys("", "config");`

`console.log(result: ${JSON.stringify(result, null, 2)});`

`result: {`
  `"ok": true,`
  `"cmd": "keys()",`
  `"data": [`
    `{`
      `"space": "config",`
      `"key": "maxValue"`
    `},`
    `{`
      `"space": "config",`
      `"key": "minValue"`
    `}`
  `],`
  `"msg": "Keys for '' and space 'config' patterns retrieved successfully",`
  `"affected": 2,`
  `"time": "0s 0.071ms (71499 nanoseconds)"`
`}`





`result = efemem.values("", "config");`
`console.log(result: ${JSON.stringify(result, null, 2)});`

`result: {`
  `"ok": true,`
  `"cmd": "values()",`
  `"data": [`
    `{`
      `"key": "maxValue",`
      `"space": "config",`
      `"value": {`
        `"value": 100,`
        `"due": "9999-12-31T22:59:59.000Z",`
        `"updated": "2020-04-10T16:09:58.380Z",`
        `"created": "2020-04-10T16:09:58.380Z"`
      `}`
    `},`
    `{`
      `"key": "minValue",`
      `"space": "config",`
      `"value": {`
        `"value": 1,`
        `"due": "9999-12-31T22:59:59.000Z",`
        `"updated": "2020-04-10T16:09:58.381Z",`
        `"created": "2020-04-10T16:09:58.381Z"`
      `}`
    `}`
  `],`
  `"msg": "2 values found and retrieved for Key '' in space 'config'",`
  `"affected": 2,`
  `"time": "0s 0.713ms (713100 nanoseconds)"`
`}`