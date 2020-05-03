# keys() command

## **Syntax** 

`keys(key, space)`



## **Parameters**

| Parameter | Type   | Mandatory | Description        |
| --------- | ------ | --------- | ------------------ |
| `key`     | string | No        | Key name pattern   |
| `space`   | string | No        | Space name pattern |



## **Description**

The `keys()` command retrieves a list of key names, based on a pattern key name and a pattern space name. The pattern is, simply, a set of characters, which could be located on any position in the name of the key or the space.

If no pattern is passed as parameter, will assume all the keys or spaces. You can also use the asterisc character (*) as pattern for all keys or spaces.



## **Examples**

The following code will create some keys:

```javascript
const { efemem } = require('efememdb');

let result = efemem.set("maxValue", 100, "config");
result = efemem.set("minValue", 1, "config");
result = efemem.set("maxValue", 3000, "sales");
result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")
```



If you want to list all defined keys, you can use any of these commands:

```javascript
result = efemem.keys();
result = efemem.keys("");
result = efemem.keys("", "");
result = efemem.keys("*");
result = efemem.keys("*", "*");
```



In any case, the result will be the following one:

```javascript
result: {
  "ok": true,
  "cmd": "keys()",
  "data": [
    {
      "space": "config",
      "key": "maxValue"
    },
    {
      "space": "config",
      "key": "minValue"
    },
    {
      "space": "sales",
      "key": "maxValue"
    },
    {
      "space": "students",
      "key": "student:001"
    }
  ],
  "msg": "4 Keys retrieved",
  "affected": 4,
  "time": "0s 0.008ms (7600 nanoseconds)"
}
```



You can list all the keys associated to a given space name:

```javascript
result = efemem.keys("*", "config");
```

The result will be:

```javascript
result: {
  "ok": true,
  "cmd": "keys()",
  "data": [
    {
      "space": "config",
      "key": "maxValue"
    },
    {
      "space": "config",
      "key": "minValue"
    }
  ],
  "msg": "Keys for '' and space 'config' patterns retrieved successfully",
  "affected": 2,
  "time": "0s 0.083ms (82799 nanoseconds)"
}
```



If you want to get a given key on any space, you can use any of these commands:

```javascript
result = efemem.keys("maxValue");
result = efemem.keys("maxValue", "");
result = efemem.keys("maxValue", "*");
```



The result will be the following one:

```javascript
result: {
  "ok": true,
  "cmd": "keys()",
  "data": [
    {
      "space": "config",
      "key": "maxValue"
    },
    {
      "space": "sales",
      "key": "maxValue"
    }
  ],
  "msg": "Keys for 'maxValue' and space '' patterns retrieved successfully",
  "affected": 2,
  "time": "0s 0.024ms (23800 nanoseconds)"
}
```



The following command will get all keys that contains the pattern 'lu' as part of the key name:

```javascript
result = efemem.keys("lu");
```



The result will be: 

```javascript
result: {
  "ok": true,
  "cmd": "keys()",
  "data": [
    {
      "space": "config",
      "key": "maxValue"
    },
    {
      "space": "config",
      "key": "minValue"
    },
    {
      "space": "sales",
      "key": "maxValue"
    }
  ],
  "msg": "Keys for 'lu' and space '' patterns retrieved successfully",
  "affected": 3,
  "time": "0s 0.086ms (86200 nanoseconds)"
}
```



The following commands will list all the keys located on a space that contains an `'e'` inside its name:

```javascript
result = efemem.keys("", "e");
result = efemem.keys("*", "e");
```



The result will be the following one:

```javascript
result: {
  "ok": true,
  "cmd": "keys()",
  "data": [
    {
      "space": "sales",
      "key": "maxValue"
    },
    {
      "space": "students",
      "key": "student:001"
    }
  ],
  "msg": "Keys for '' and space 'e' patterns retrieved successfully",
  "affected": 2,
  "time": "0s 0.151ms (151200 nanoseconds)"
}
```



## **See also**

- [Keys](keys.md)
- [Spaces](spaces.md)
- [Values](values.md)
- [Pattern names](patterns.md)



[Go to index](index.md)