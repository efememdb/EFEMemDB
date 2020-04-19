# delete() command

## **Syntax** 

`delete(key, space)`



## **Parameters**

| Parameter | Type   | Mandatory | Description                     |
| --------- | ------ | --------- | ------------------------------- |
| `key`     | string | Yes       | Key name                        |
| `space`   | string | No        | Space name. 'public' by default |



## **Description**

The `delete()` command removes a given key and its value from a given space name.



## **Examples**

This example will create some keys and values:

```javascript
const { efemem } = require('./efememdb.js');

let result = efemem.set("maxValue", 100, "config");
result = efemem.set("minValue", 1, "config");
result = efemem.set("maxValue", 3000, "sales");
result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")`
```



The following code shows you how `delete()` command works:

```javascript
// before
result = efemem.values("", "students");
// delete
result = efemem.delete("student:001", "students");
// after
result = efemem.values("", "students");
```



The first result shows you the existence of the student key at the `students` space. Then, this key and its value will be deleted and shows you the result of this command. At last, shows you how this key and its value were deleted trying to list the keys of the space.

```javascript
result before: {
  "ok": true,
  "cmd": "values()",
  "data": [
    {
      "key": "student:001",
      "space": "students",
      "value": {
        "name": "James",
        "surname": "Gordon",
        "job": "Police inspector"
      }
    }
  ],
  "msg": "1 values found and retrieved for Key '' in space 'students'",
  "affected": 1,
  "time": "0s 0.504ms (503800 nanoseconds)"
}
```



```javascript
result delete: {
  "ok": true,
  "cmd": "delete()",
  "key": "student:001",
  "space": "students",
  "value": {
    "name": "James",
    "surname": "Gordon",
    "job": "Police inspector"
  },
  "due": "9999-12-31T22:59:59.000Z",
  "created": "2020-04-10T14:24:22.584Z",
  "updated": "2020-04-10T14:24:22.584Z",
  "msg": "Key 'student:001' in space 'students' deleted successfully",
  "affected": 1,
  "time": "0s 0.709ms (708599 nanoseconds)"
}
```



```javascript
result after: {
  "ok": true,
  "cmd": "values()",
  "data": {},
  "msg": "No values found for key '' in space 'students'",
  "affected": 0,
  "time": "0s 0.044ms (44500 nanoseconds)"
}
```



## **See also**

- [Keys](keys.md)
- [Spaces](spaces.md)
- [copy() command](command-copy.md)
- [move() command](command-move.md)
- [rename() command](command-rename.md)



[Go to index](index.md)