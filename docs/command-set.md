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

```javascript
set("maxValue", 100);
```



The key name must unique in a given space name. You can define keys with the same name, but unique into a given space name.

```javascript
set("maxValue", 100, "config");
set("maxValue", 10, "qualifies");
```



If the key has not been previously defined, it will be created. If the key has been previously defined, it will replaced with the new/last value (update).

```javascript
set("maxValue", 100, "config"); // First time: creation
set("maxValue", 120, "config"); // Updates and replaces previous value
```



If you pass the `due` parameter, you will specify the number of seconds of expiration for the key, since this moment. It means, the key will be deleted automatically when the seconds specified has passed.

```javascript
set("maxValue", 100, "config", 30);  // 30 seconds key life
```



## **Examples**

This example will create a valid key into the `config` space name, with a time expiration of 30 seconds:

```javascript
const { efemem } = require('./efememdb.js');

let result = efemem.set("maxValue", 100, "config", 30);
```



This code will print the following result:

```javascript
result: {  
   "ok": true,  
   "cmd": "set()",  
   "data": {    
      "value": 100,    
      "due": "2020-04-10T11:44:00.896Z",    
      "updated": "2020-04-10T11:43:30.896Z",    
      "created": "2020-04-10T11:43:30.896Z"  
   },  
   "msg": "Key 'maxValue' saved successfully in space 'config'",  
   "affected": 1,  
   "time": "0s 1.098ms (1098099 nanoseconds)" 
} 
```



The following example will provoke an error:

```javascript
const { efemem } = require('./efememdb.js');

let result = efemem.set("7maxValue", 100, "config", 30);
```



This code will print the following result:

```javascript
result: {
  "ok": false,
  "cmd": "set()",
  "data": 100,
  "msg": "Error on key: '7maxValue' name is incorrect. First character must be alphabetical",
  "affected": 0
}
```





## **See also**

- [get() command](command-get.md)
- [Keys](keys.md)
- [Spaces](spaces.md)
- [Values](values.md)



[Go to index](index.md)