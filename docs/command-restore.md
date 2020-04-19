# restore() command

## **Syntax** 

`restore()`



## **Parameters**

N/A



## **Description**

The `restore()` command retrieves all the last persisted data (made with the command `persist()`) and loads it into memory.

This command is used automatically by **EFEMem DB** when starts, but you can use it when you consider necessary.



**Note:** *You can persist the current data, using the command `persist()`.*





## **Examples**

The following command restores the last persisted data:

```javascript
result = efemem.restore();
```



The result will be the following one:

```javascript
result: {
  "ok": true,
  "cmd": "restore()",
  "data": {},
  "msg": "Efemem DB has restored the data. Total spaces: 3. Total keys: 4",
  "affected": 4,
  "time": "0s 12.355ms (12355200 nanoseconds)"
}
```



## See also

- [persist() command](command-persist.md)



[Go to index](index.md)