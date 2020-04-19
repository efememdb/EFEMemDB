# spaceInfo() command

## **Syntax** 

`spaceInfo(space)`



## **Parameters**

| Parameter | Type   | Mandatory | Description                     |
| --------- | ------ | --------- | ------------------------------- |
| `space`   | string | No        | Space name. 'public' by default |





## **Description**

The `spaceInfo()` command shows the current status information:

- `space`: Space name
- `keys`: Total number of keys stored in the space
- `valuesSize`: Size in bytes of the values stored in the space
- `spaceSize`: Size in bytes of the space structure 
- `totalSize`: Total size in bytes of the space ( `valuesSize` + `spaceSize`)



## **Examples**

The following command will get the status info of the space `'public'` (by default):

```javascript
console.log(efemem.statusInfo());
```



The next command will retrieve the infor of the space `'qualifications'`:

```javascript
console.log(efemem.statusInfo("qualifications"));
```



The result could be the following one:

```json
result: {
  "ok": true,
  "cmd": "spaceInfo()",
  "data": {
    "space": "qualifications",
    "keys": 10,
    "valuesSize": 74,
    "spaceSize": 2222,
    "totalSize": 2296
  },
  "msg": "Space 'qualifications' information retrieved successfully",
  "affected": 10,
  "time": "4 ms"
}
```



## See also

- [spaces() command](command-spaces.md)
- [memory() command](command-memory.md)
- [info() command](command-info.md)



[Go to index](index.md)