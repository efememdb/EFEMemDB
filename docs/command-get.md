# get() command

## **Syntax** 

`get(key, space[,fullInfo])`



## **Parameters**

| Parameter  | Type    | Mandatory | Description                                                  |
| ---------- | ------- | --------- | ------------------------------------------------------------ |
| `key`      | string  | No        | Key name pattern                                             |
| `space`    | string  | No        | Space name pattern                                           |
| `fullInfo` | boolean | No        | If `false` (by default), it will return a minimal info overresult. If `true`,  it will return a complete information over result. |



## **Description**

The `get()` command retrieves the values associated to the keys from the spaces specified as [pattern](patterns.md) names. 



## **Examples**

This example will create and retrieve a valid key:

```javascript
const { efemem } = require('efememdb');

let result = efemem.set("maxValue", 100, "config");
result = efemem.get("maxValue", "config")
```



This result will be the next:

```javascript
result: {
  "ok": true,
  "cmd": "get(key[,space])",
  "data": [
    "key": "config~maxValue",
    "value": 100,
  ],
  "msg": "1 values found",
  "affected": 1,
  "time": "<1ms"
}
```



The following command will get the complete information about all the keys with pattern 'maxValue' on any space:

```javascript
result = efemem.get("maxValue", "config", true);
```



The result will be the following one:

```javascript
result: {
  "ok": true,
  "cmd": "get(key[,space])",
  "data": [
    "space": "config",
    "key": "maxValue",
    "data": {
       "value": 100,
       "due": "2020-05-03T20:05:46Z436"
     }
  ],
  "msg": "1 values found",
  "affected": 1,
  "time": "1ms"
}
```





## See also

- [Keys](keys.md)
- [Spaces](spaces.md)
- [Values](values.md)
- [Pattern names](patterns.md)



[Go to index](index.md)