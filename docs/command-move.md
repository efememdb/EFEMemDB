# move() command

## **Syntax** 

`move(key, space, newSpace, overwrite)`



## **Parameters**

| Parameter   | Type    | Mandatory | Description                                                  |
| ----------- | ------- | --------- | ------------------------------------------------------------ |
| `key`       | string  | Yes       | Key name pattern                                             |
| `space`     | string  | Yes       | Space name pattern (origin)                                  |
| `newSpace`  | string  | No        | New space name (destination). 'public' by default            |
| `overwrite` | boolean | No        | If `true`, when the *key* in *newSpace* already exists, overwrite its value. If `false` (by default), the value won't be overwritten. |



## **Description**

The `move()`  command moves the keys found in the origin spaces according to a [pattern name](patterns.md), to another space name (destination). 

If no *key* specified, all keys will be assumed (use pattern name).

If no (origin) *space* specified, all spaces will be assumed (use pattern name).

If no (destination) *newSpace* name is not provided, `'public'` space will be assumed by default.

If (destination) *newSpace* name is non-existent, a new space name will be created. 

If *key* exists and (destination) *newSpace* exists, if `overwrite` parameter was specified as `true`, the value will be overwritten with the same value as the origin *key* and *space*. In `false`, the value in destination will be preserved.

**Remember:** With `move()` command, the *space/key/value* in origin will disappear after these were copied to destination.



## **Examples**

This example will create one key and its value:

```javascript
const { efemem } = require('efememdb');

let result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")
```



The following command will move all the keys with pattern `'student:001'` from all spaces (*space* parameter will assume all as pattern) to destination space `'public'` (*newSpace* parameter will assume 'public' by default):

```javascript
result = efemem.move("student:001");
```



This is the result:

```javascript
result: {
  "ok": true,
  "cmd": "move(key, space[,newSpace[,overwrite]])",
  "data": {key: "student:001", space: undefined, overwrite: false},
  "msg": "1 keys of 1 moved to 'public'",
  "affected": 0,
  "time": "<1ms"
}
```



The following command will move the student to a new space named `'approbed'`:

```javascript
result = efemem.move("student:001", "public", "approbed");
```



The result is the following one:

```javascript
result: {
  "ok": true,
  "cmd": "move(key, space[,newSpace[,overwrite]])",
  "data": {key: "student:001", space: 'public', overwrite: false},
  "msg": "1 keys of 1 moved to 'approbed'",
  "affected": 0,
  "time": "<1ms"
}
```



## See also

- [Keys](keys.md)
- [Spaces](spaces.md)
- [Pattern names](patterns.md)
- [copy() command](command-copy.md)
- [rename() command](command-rename.md)
- [delete() command](command-delete.md)



[Go to index](index.md)

