# rename() command

## **Syntax** 

`rename(key, newKey, space)`



**Parameters**

| Parameter | Type   | Mandatory | Description                       |
| --------- | ------ | --------- | --------------------------------- |
| `key`     | string | Yes       | Key name                          |
| `newKey`  | string | Yes       | New key name. 'public' by default |
| space     | string | No        | Space name. 'public' by default   |



## **Description**

The `rename()` command changes the name of an existing key on a given space name. 

If space name is not provided, `'public'` space will be assumed by default.



## **Examples**

This example will create one key and its value:

```javascript
const { efemem } = require('./efememdb.js');

let result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students");
```



The following commands changes the name of the key with a new student:

```javascript
result = efemem.rename("student:001", "student:007", "students");
result = efemem.values("", "students");
```



Here are the results: 

```javascript
rename result: 
{
  "ok": true,
  "cmd": "rename()",
  "data": {
    "name": "James",
    "surname": "Gordon",
    "job": "Police inspector"
  },
  "msg": "Key 'student:001' at space 'students' was renamed as 'student:007'",
  "affected": 1,
  "time": "0s 0.291ms (291500 nanoseconds)"
}
```



```javascript
values result: 
{
  "ok": true,
  "cmd": "values()",
  "data": [
    {
      "key": "student:007",
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
  "time": "0s 0.728ms (727800 nanoseconds)"
}
```





## **See also**

- [Keys](keys.md)
- [Spaces](spaces.md)
- [copy() command](command-copy.md)
- [move() command](command-move.md)
- [delete() command](command-delete.md)



[Go to index](index.md)