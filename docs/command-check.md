# check() command

## **Syntax** 

`check(key, space)`



## **Parameters**

| Parameter | Type   | Mandatory | Description                     |
| --------- | ------ | --------- | ------------------------------- |
| `key`     | string | Yes       | Key name                        |
| `space`   | string | No        | Space name. 'public' by default |



## **Description**

The `check()` command verifies if a given key name and a given space name is defined, returning true if the key is present of false in other case.



## **Examples**

This example will create and retrieve a valid key:

```javascript
const { efemem } = require('./efememdb.js');

let result = efemem.set("maxValue", 100, "config");
result = efemem.check("maxValue", "config")`
```



This code will generate the following result:

```javascript
result: {
  "ok": true,
  "msg": "Key 'maxValue' in space 'config' found",
  "pos": 0
}
```



The following command will return `false`, because **EFEMem DB** assumes the `'public'` space name by default:

```javascript
result = efemem.check('maxValue');
```

The result will be:

```javascript
result: {
  "ok": false,
  "msg": "Error: key 'maxValue' in space 'public' not found"
}
```



## See also

- [get() command](command-get.md)
- [values() command](command-values.md)
- [Keys](keys.md)
- [Spaces](spaces.md)
- [Values](values.md)





[Go to index](index.md)