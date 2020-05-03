# memory() command

## **Syntax** 

`memory()`



## **Parameters**

N/A



## **Description**

The  `memory()` command returns the memory used by **EFEMem DB**.



## **Examples**

The following code will create some keys:

```javascript
const { efemem } = require('./efememdb.js');


let result = efemem.set("maxValue", 100, "config");
result = efemem.set("minValue", 1, "config");
result = efemem.set("maxValue", 3000, "sales");
result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")
```



You can get the memory usage with the following command:

```javascript
result = efemem.memory();
```



The result will be following one:

```javascript
result: {
  "maxMemory": 1048576,
  "usedMemory": 602,
  "freeMemory": 1047974
}
```



## See also

- [info() command](command-info.md)
- [spaceInfo() command](command-spaceInfo.md)



[Go to index](index.md)