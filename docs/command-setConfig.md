# setConfig() command

## **Syntax**

`setConfig(param, value)`

## **Parameters**

| Parameter | Type   | Mandatory | Description            |
| --------- | ------ | --------- | ---------------------- |
| `param`   | string | Yes       | Config parameter key   |
| `value`   | any    | Yes       | Config parameter value |

## **Description**

The `setConfig()` command defines the value of an **EFEMem DB** configuration parameter.

When you start **EFEMem Database**, the configuration data will be loaded and set automatically from `efememdb.json` file, but you can change this configuration while **EFEMem DB** is running. These changes will be effective while **EFEMem DB** is running, but these will not be applied to `efememdb.json` file.

The configuration parameters are the following:

| Parameter       | Type    | Description                                                  |
| --------------- | ------- | ------------------------------------------------------------ |
| `accessKey`     | string  | Key password for authorization access (future usage)         |
| `maxMemory`     | integer | Maximum of RAM memory bytes reserved for usage               |
| `keysMax`       | integer | Maximum number of keys reserved for usage                    |
| `recyclingMode` | boolean | If **true**, when number of keys reaches the **keysMax** value, automatically, the first key will be deleted and the next key will be added to the top. If **false**, you the new keys cannot be added. |
| `dataPath`      | string  | Path directory where the persistence will be stored.         |

## **Examples**

```javascript
const { efemem } = require('efememdb');

let result = efemem.setConfig("keysMax", 2000);
```



The result will be the following one:

```javascript
result: {
    "ok": true,
    "cmd": "setConfig()",
    "data": 2000,
    "msg": "EFEMem DB configuration parameter 'keysMax' was assigned with value '2000'",
    "affected": 1
}
```



## See also

- [getConfig() command](command-getConfig.md)



[Go to index](index.md)