# spaces() command

## **Syntax** 

`spaces()`



## **Parameters**

N/A



## **Description**

The `spaces()` command retrieves the list of current space names.



## **Examples**

The following code will create some keys:

```javascript
const { efemem } = require('efememdb');

let result = efemem.set("maxValue", 100, "config");
result = efemem.set("minValue", 1, "config");
result = efemem.set("maxValue", 3000, "sales");
result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students");
```



You can get the list of spaces with the following command:

```javascript
result = efemem.spaces();
```



The result will be following one:

```javascript
result: {
  "ok": true,
  "cmd": "spaces()",
  "data": [
    "config",
    "sales",
    "students"
  ],
  "msg": "3 spaces used",
  "affected": 3,
  "time": "0s 0.032ms (31600 nanoseconds)"
}
```



## See also

- [Spaces](spaces.md)
- [spaceInfo() command](command-spaceInfo.md)



[Go to index](index.md)