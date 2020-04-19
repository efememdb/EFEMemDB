# move() command

## **Syntax** 

`move(key, space, newSpace)`



## **Parameters**

| Parameter  | Type   | Mandatory | Description                                       |
| ---------- | ------ | --------- | ------------------------------------------------- |
| `key`      | string | Yes       | Key name                                          |
| `space`    | string | Yes       | Space name (origin)                               |
| `newSpace` | string | No        | New space name (destination). 'public' by default |



## **Description**

The `move()`  command moves a given key from an existing space name (origin) to another space name (destination). 

If space name is not provided, `'public'` space will be assumed by default.

If destination space name is non-existent, a new space name will be created.



## **Examples**

This example will create one key and its value:

```javascript
const { efemem } = require('./efememdb.js');

let result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")
```



The following command will try to move the key, but no space names were specified, assuming `'public'` as default space name:

```javascript
result = efemem.move("student:001");
```



This is the result:

```javascript
result: {
  "ok": false,
  "cmd": "move()",
  "data": {},
  "msg": "Error: key 'student:001' in space 'public' not found",
  "affected": 0,
  "time": "0s 0.276ms (276300 nanoseconds)"
}
```



The following command will move the student to a new space named `'approbed'`:

```javascript
result = efemem.move("student:001", "students", "approbed");
```



The result is the following one:

```javascript
result: {
  "ok": true,
  "cmd": "move()",
  "data": {
    "name": "James",
    "surname": "Gordon",
    "job": "Police inspector"
  },
  "msg": "Key 'student:001' at space 'students' was moved to space 'approbed'",
  "affected": 1,
  "time": "0s 0.330ms (330300 nanoseconds)"
}
```



## See also

- [Keys](keys.md)
- [Spaces](spaces.md)
- [copy() command](command-copy.md)
- [rename() command](command-rename.md)
- [delete() command](command-delete.md)



[Go to index](index.md)

