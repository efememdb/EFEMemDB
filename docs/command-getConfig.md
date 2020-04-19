# getConfig() command

## **Syntax**

`getConfig(param)`



## **Parameters**

| Parameter | Type   | Mandatory | Description               |
| --------- | ------ | --------- | ------------------------- |
| `param`   | string | Yes       | Config parameter key name |



## **Description**

The `getConfig()` command returns the value of an **EFEMem DB** configuration parameter.

When you start **EFEMem Database**, the configuration data will be loaded and set automatically from `efememdb.json` file.

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
const { efemem } = require('./efememdb.js');

let result = efemem.getConfig("keysMax");
```



The result will be the following one:

```javascript
result: {
"ok": true,
"data": 1000,
"msg": "EFEMem DB configuration parameter name 'keysMax' found"
}
```



## See also

- [setConfig() command](command-setConfig.md)



[Go to index](index.md)