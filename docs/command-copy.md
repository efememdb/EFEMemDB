# copy() command

## **Syntax** 

`move(key, space, newSpace)`



## **Parameters**

| Parameter  | Type   | Mandatory | Description                                         |
| ---------- | ------ | --------- | --------------------------------------------------- |
| `key`      | string | Yes       | Key name pattern                                    |
| `space`    | string | Yes       | Space name pattern (origin).                        |
| `newSpace` | string | No        | New space name (destination). `'public'` by default |



## **Description**

The `copy()`  command copies the keys found in the origin spaces according to a [pattern](patterns.md), to another space name (destination). 

If no *key* specified, all keys will be assumed (use pattern name).

If no (origin) *space* specified, all spaces will be assumed (use pattern name).

If no (destination) *newSpace* name is not provided, `'public'` space will be assumed by default.

If (destination) *newSpace* name is non-existent, a new space name will be created. 

If *key* exists and (destination) *newSpace* exists, the value will be overwritten with the same value as the origin *key* and *space*.



## **Examples**

This example will create one key and its value:

```javascript
const { efemem } = require('efememdb');

let result = efemem.set("salary", 1234.56, "employees");
```



The following command will copy the `'salary'` key from `'employees'` space to `'public'` space (keep attention to no *newSpace* was specified, and `'public'` will be assumed by default):

```javascript
result = efemem.copy("salary", "employees");
```



To check the result, the next command will get the keys with pattern `'salary'` from any space:

```javascript
result = efemem.get("salary");
```



This is the result:

```javascript
result: {
  "ok": true,
  "cmd": "get(key[,space])",
  "data": [
    {
      "key": "salary~public",
      "value": 1234.56,
    },
    {
      "key": "salary~employees",
      "value": 1234.56,
    }
  ],
  "msg": "2 values found",
  "affected": 2,
  "time": "< 1 ms"
}
```



The following commands will copy all the keys from `'config'` space to `'configBackup'` space:

```javascript
result = efemem.copy("*", "config", "configBackup");
result = efemem.copy("", "config", "configBackup");
result = efemem.copy(null, "config", "configBackup");
```



The following commands will copy all the keys from any space to `'backup'` space:

```javascript
result = efemem.copy("*", "*", "backup");
result = efemem.copy("", "", "backup");
result = efemem.copy(null, null, "backup");
```





## See also

- [Keys](keys.md)
- [Spaces](spaces.md)
- [Pattern names](patterns.md)
- [move() command](command-move.md)
- [rename() command](command-rename.md)
- [delete() command](command-delete.md)



[Go to index](index.md)