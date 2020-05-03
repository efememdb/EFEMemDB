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
result = efemem.get("", "students");
```



Here are the results: 

```javascript
rename result: 
{
  "ok": true,
  "cmd": "rename(key, newKey[, space])",
  "data": {
    "name": "James",
    "surname": "Gordon",
    "job": "Police inspector"
  },
  "msg": "Key 'student:001' at space 'students' was renamed as 'student:007'",
  "affected": 1,
  "time": "<1ms"
}
```



```javascript
result: 
{
  "ok": true,
  "cmd": "get(key[,space])",
  "data": [
    {
      "key": "students~student:007",
      "value": {
        "name": "James",
        "surname": "Gordon",
        "job": "Police inspector"
      }
    }
  ],
  "msg": "1 values found",
  "affected": 1,
  "time": "<1ms"
}
```





## **See also**

- [Keys](keys.md)
- [Spaces](spaces.md)
- [copy() command](command-copy.md)
- [move() command](command-move.md)
- [delete() command](command-delete.md)



[Go to index](index.md)