# copy() command

## **Syntax** 

`move(key, space, newKey, newSpace)`



## **Parameters**

| Parameter  | Type   | Mandatory | Description                                         |
| ---------- | ------ | --------- | --------------------------------------------------- |
| `key`      | string | Yes       | Key name                                            |
| `space`    | string | Yes       | Space name (origin)                                 |
| `newKey`   | string | No        | New key name (destination). `key`  param by default |
| `newSpace` | string | No        | New space name (destination). `'public'` by default |



## **Description**

The `copy()`  command copies a given key from an existing space name (origin) to another key and/or space name (destination). 

If destination key name is not provided, origin key value will be assumed.

If destination space name is not provided, `'public'` space will be assumed by default.

If destination space name is non-existent, a new space name will be created.



## **Examples**

This example will create one key and its value:

```javascript
const { efemem } = require('./efememdb.js');

let result = efemem.set("salary", 1234.56, "employees");
```



The following command will copy this key from `'employees'` space to `'public'` space (it will be assumed by default):

```javascript
result = efemem.copy("salary", "employees");
```



To check the result, the next command will get the keys with pattern `'salary'` from any space:

```javascript
result = efemem.values("salary");
```



This is the result:

```javascript
'keys "salary"' values: {
  "ok": true,
  "cmd": "values()",
  "data": [
    {
      "key": "salary",
      "space": "public",
      "value": 1234.56,
      "created": "2020-04-19T16:21:11.789Z",
      "updated": "2020-04-19T16:21:11.789Z",
      "due": "9999-12-31T22:59:59.000Z"
    },
    {
      "key": "salary",
      "space": "employees",
      "value": 1234.56,
      "created": "2020-04-19T16:21:11.789Z",
      "updated": "2020-04-19T16:21:11.789Z",
      "due": "9999-12-31T22:59:59.000Z"
    }
  ],
  "msg": "2 values found and retrieved for Key 'salary' in space '*'",
  "affected": 2,
  "time": "< 1 ms"
}
```





## See also

- [Keys](keys.md)
- [Spaces](spaces.md)
- [move() command](command-move.md)
- [rename() command](command-rename.md)
- [delete() command](command-delete.md)



[Go to index](index.md)

