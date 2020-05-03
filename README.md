# EFEMem DB

**Easy, Fast and Efficient MEMory NoSQL DataBase**

**version 1.0.8**

<img src="EFEMemDB-icon.png" alt="EFEMem NoSQL Database" style="zoom:50%;" />

*Created by Rafael Hernamperez and released under the terms of the ISC License:*

https://opensource.org/licenses/ISC



**ISC License (ISC)**
**Copyright 2020 Rafael Hernamperez**

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.



## Description

**EFEMem DB** is an ultra-light, fast, easy and efficient NoSQL database, based on key-value pairs, running entirely on RAM memory. 

**EFEMem DB** is written in **JavaScript**, and you can run it directly on the front size, such us web browsers, through web applications (**web pages**. **PWA** (Progressive Web Applications), hybrid mobile applications (made with **Ionic**, **React Native**, **NativeScript**, **Xamarin**, etc.). You can control ad-hoc data without APIs, speeding up your applications. **EFEMem DB** is an ideal solution for your data when the connection is off, providing you a high availability for your users.

You can also run **EFEMem DB** on server side applications, using technologies based on JavaScript, such us **NodeJS**. You can achieve more performance managing master data, cache data, log or monitoring data, highly queried data... Avoid heavy, slow queries and repeated queries to remote databases, optimizing the time and efficiency of your most used data or managing data in real-time.

With a few and very easy commands, you can take the control of your data.

```html
// Web application example
<script src="uri/efememdb.js"></script>

<script>
   let result = efemem.set("hello", "world");
   result = efemem.get("hello");
</script>
```



```javascript
// NodeJS example
const { efemem } = require('efememdb');

let result = efemem.set("hello", "world");
result = efemem.get("hello");
```





## Features

These are the main features of **EFEMem DB**:

- **Easy to install.** 
- **No third-party dependencies.** All the code is own.
- **Ultra-fast read and write access** (few nanoseconds).
- **Direct usage on the scope of your web application**, without calls to APIs.
- **Performance improvement on your server applications,** accessing fastly to your most frequently data or managing data on real time.
- **Hot configuration.** You can change configuration while **EFEMem DB** is running.
- **Recycling mode data.** You can use this mode in order to contain a maximum number of keys. For example, you can store the 1000 last logs or requests or any other data. When the space is full, the next key will be added to the bottom after the first key (the oldest) is deleted.
- **Life time key.** You can define the life time of a given key. For example, you can create a key that expires in 30 seconds.
- **Powerful commands.** You can control the data with a few and easy commands.
- **Persistence.** The data can be permantely saved (into **files** disk on server side, or into **localStorage** browser), and restore it when you want.
- **NoSQL.** You don't need complex relationships between tables, or strict schemas. You use key-value pairs.
- **Space names.** You can organize your keys using space names. You can use keys with the same name, but unique in different spaces.
- **Pattern names.** You can access efficiently to many keys and spaces using pattern names, instead of accessing one by one.
- **Rich data.** You can use different types of data:
  - integer numbers
  - float numbers
  - string text
  - boolean
  - arrays
  - JSON objects



### Best usage

#### Server side

You can use this amazing data base in your **NodeJS**, as a complementary database for highly and immediate availability of data, such as real-time monitoring, recycled logs, cache, configuration, master data, etc. It's ideally for the following cases:

- Master data. Avoid constant queries to master data
- Data in real-time: Monitoring.
- Cycling logs.
- Frequently data accessed. Caches.
- IoT projects
- Temporary data



#### Front side

You can use **EFEMem DB** in your web applications, without need to call remote, heavy and slow APIs, storing and retrieving data for local web purposes. It's ideally for the following cases:

- Data management when the connection is off, assuring the high availability of your app until the connection is recovered. This feature is ideal for mobile applications, PWAs and web applications in general.
- Local configuration storage that can be changed.
- Sessions management.
- Local data managed exclusively by your web app.
- HTML games
- Temporary data





## Installation

### NodeJS

The recommended installation of **EFEMem DB** is via `npm` installation package:

```javascript
npm install efememdb -save
```



### Web applications

Copy the file `efememdb.js` on your project. This file contains itself all the functionalities that are required by **EFEMem DB**.





## First steps

Once you installed **EFEMem DB** in your project, the first step is import the `efemem` object.

If you are using **EFEMem DB** on NodeJS:

```javascript
const { efemem } = require('efememdb');
```



If you are using **EFEMem DB** on a web project:

<script src="path/efememdb.js"></script>



The `efemem` object allows you to execute directly the **EFEMem DB** commands, through which you can interact with the data.

```javascript
let result = efemem.command(<parameters>)
```



Each command returns a result, commonly with this format:

```json
{
  "ok": true|false,
  "cmd": "command",
  "data": data,
  "msg": "result_message",
  "affected": num_affected,
  "time": "execution_time"
}
```



Where:

- **`ok`**: Returns true if the command has been executed successfully. Returns false if any issue of error has been detected in the execution.
- **`cmd`**: Name of the executed command
- **`data`**: Data used or result data (depending on the command)
- **`msg`**: Message or description about the result.
- **`affected`**: Number of items affected by the command (0 if error or incident)
- **`time`**: Time used by the command in its execution



**Note:** *Depending of the command, this format can vary.* 





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



### Pattern names

Pattern name is a powerful feature of **EFEMem DB** than allows you to spread the scope of results of some commands. When you want to refer to a key or a space name, you can specify a part of the name, instead of the complete name. This part can be located at the begining, in the middle or at the end of the name (in any part of the name). If you don't specify any pattern (null or empty value), **EFEMem DB** will assume any name (all names).

For example, you can save the info of the courses on spaces with their corresponding year: `course2016`, `course2017`, `course2018`, `course2019` and `course2020`. You can execute a command than affect to all the courses of the 10's decade, using as pattern name `'course201'` (this excludes `course2020`).



### Define keys and values

You can define a key using this command:

```javascript
efemem.set("language:en", "English");
efemem.set("language:es", "Spanish");
```



By default, **EFEMem DB** uses the space name `'public'` in order to store the keys.

A good practice is to organize the keys under an explicit space name:

```javascript
efemem.set("language:en", "English", "languages");
efemem.set("language:es", "Spanish", "languages");
```



Now, the keys are more easily to remember for search them, because we know the space name in which they are stored.

Remember: you can use complex data as value:

```javascript
efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students");
efemem.set("califications", [4.5, 5.5, 6.2, 9, 7.3], "students");
```



If the space and key existis previously, it will be updated with the new value.



### Retrieve a key and value

You can retrieve a value through its key, using the following command:

```javascript
efemem.get("language:en", "languages");
```





### Delete a key and value

You can remove a value through its key, using the following command:

```javascript
efemem.delete("language:en", "languages");
```





### List of spaces

When you are using extensively the database, you will have many keys. Using space names will facilitate you the organization and the search of the keys.

If you want to remember the space names that you are using, simply execute the following command:

```javas
efemem.spaces();
```





### List of keys

You can list all the keys using any of the following command:

```javascript
efemem.keys();
efemem.keys("");
efemem.keys("*");
```



If you have many keys, it will be more easily and efficient specifying the space name:

```javascript
efemem.keys("", "languages");
```



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

```javascript
efemem.keys("course:002", "courses");
```



### List of values

You can retrieve the values filtering the keys in the same way you can do with the `keys()` command. 

The `get()` command returns the list of keys, values and space names.



**Examples:**

```javascript
result = efemem.get("", "config");
```



```json
result: {
  "ok": true,
  "cmd": "get(key[,space])",
  "data": [
    {
      "key": "config~maxValue",
      "value": 100
    },
    {
      "key": "config~minValue",
      "value": 1
    }
  ],
  "msg": "2 values found",
  "affected": 2,
  "time": "1ms"
}
```





## More information

**You can read the full documentation at:**

[https://github.com/efememdb/EFEMemDB/blob/master/docs/index.md](https://github.com/efememdb/EFEMemDB/blob/master/docs/index.md)



**History changes at:**

[https://github.com/efememdb/EFEMemDB/blob/master/docs/HISTORY.md](https://github.com/efememdb/EFEMemDB/blob/master/docs/HISTORY.md)