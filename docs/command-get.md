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

```javascript
const { efemem } = require('./efememdb.js');

let result = efemem.set("maxValue", 100, "config");
result = efemem.get("maxValue", "config")
```



This result will be the next:

```javascript
result: {
  "ok": true,
  "cmd": "get()",
  "data": {
    "value": 100,
    "due": "9999-12-31T23:59:59.000Z",
    "updated": "2020-04-10T12:18:55.509Z",
    "created": "2020-04-10T12:18:55.509Z"
  },
  "msg": "Key 'maxValue' in space 'config' found and retrieved successfully",
  "affected": 1,
  "time": "0s 0.352ms (351799 nanoseconds)"
}
```



This example will provoke an error, because you are creating the key in the `'config'` space name, and you are trying to get the key from the `'public'` space name (by default):

```javascript
const { efemem } = require('./efememdb.js');

let result = efemem.set("maxValue", 100, "config");
result = efemem.get("maxValue")
```



The previous code will generate the following result:

```javascript
result: {  
   "ok": false,  
   "cmd": "get(key[,space])",  
   "msg": "Error: key 'maxValue' in space 'public' not found",  
} 
```



## See also

- [check() command](command-check.md)
- [values() command](command-values.md)
- [Keys](keys.md)
- [Spaces](spaces.md)
- [Values](values.md)



[Go to index](index.md)