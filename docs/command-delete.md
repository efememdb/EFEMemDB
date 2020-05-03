# delete() command

## **Syntax** 

`delete(key, space)`



## **Parameters**

| Parameter | Type   | Mandatory | Description                             |
| --------- | ------ | --------- | --------------------------------------- |
| `key`     | string | Yes       | Key name pattern                        |
| `space`   | string | No        | Space name pattern. 'public' by default |



## **Description**

The `delete()` command removes the keys and their values from a given space name. according to a [pattern name](patterns.md).



## **Examples**

This example will create some keys and values:

```javascript
const { efemem } = require('efememdb');

let result = efemem.set("maxValue", 100, "config");
result = efemem.set("minValue", 1, "config");
result = efemem.set("maxValue", 3000, "sales");
result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")`
```



The following code shows you how `delete()` command works:

```javascript
// before
result = efemem.get("", "students");
// delete
result = efemem.delete("student:001", "students");
// after
result = efemem.get("", "students");
```



The first result shows you the existence of the student key at the `students` space. Then, this key and its value will be deleted and shows you the result of this command. At last, shows you how this key and its value were deleted trying to list the keys of the space.

```javascript
result before: {
  "ok": true,
  "cmd": "get(key[,space])",
  "data": [
    {
      "key": "student:001~students",
      "value": {
        "name": "James",
        "surname": "Gordon",
        "job": "Police inspector"
      }
    }
  ],
  "msg": "1 values found",
  "affected": 1,
  "time": "0s 0.504ms (503800 nanoseconds)"
}
```



```javascript
result delete: {
  "ok": true,
  "cmd": "delete(key[,space])",
  "data": {
    "key": "student:001",
    "space": "students"
  },
  "msg": "1 keys deleted",
  "affected": 1,
  "time": "0s 0.709ms (708599 nanoseconds)"
}
```



```javascript
result after: {
  "ok": true,
  "cmd": "get(key[,space])",
  "data": [],
  "msg": "0 values found",
  "affected": 0,
  "time": "0s 0.044ms (44500 nanoseconds)"
}
```



The following commands will delete all the keys from `'students'` space:

```javascript
result = efemem.delete("*", "students");
result = efemem.delete("", "students");
result = efemem.delete(null, "students");
```



The following command will delete all the keys from `'public'` space  (if no space provided, it will `'public'` by default):

```javascript
result = efemem.delete();
```





## **See also**

- [Keys](keys.md)
- [Spaces](spaces.md)
- [Pattern names](patterns.md)
- [copy() command](command-copy.md)
- [move() command](command-move.md)
- [rename() command](command-rename.md)



[Go to index](index.md)