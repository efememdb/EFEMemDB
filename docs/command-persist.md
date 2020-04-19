# persist() command

## **Syntax** 

`persist()`



## **Parameters**

N/A



## **Description**

The `persist()` command persist the current data into disk (on NodeJS environment) or into **localStorage** (on Web environment).

You can recover the last persisted data, using the command `restore()`.



### NodeJS environment

If you are executing **EFEMem NoSQL Database** using **NodeJS**, the `persist()` command saves the current data into disk, using the directory defined in `dataPath` configuration parameter, at `efememdb.json` file.

This command will create an index file, named `efememdb.efs`, which will contain the current list of space names. 

For each space name, it will create a file with the same name as the space name, with `.efd` extension, which contains the data of all keys and values on such space name.

These files will be used by **EFEMem DB** when starts, in order to load automatically the last data persisted.



**Notes:** 

- *The `efs` extension file means **EFemem Spaces**.*
- *The `efd` extension file means **EFemem Data**.*



### Web environment

If you are executing **EFEMem NoSQL Database** in a Web environment, the `persist()` command saves the current data into the **localStorage** web browser local storage.

This command will create a **localStorage** key named `efememdb-efs`, which will contain the current list of spaces names.

For each space name, it will create a **localStorage** key named `"efememdb"`, followed by the "_" (underscore) and the name of space, which will contain the data of all keys and values on such space name.

These **localStorage** keys will be used by **EFEMem DB** when starts, in order to load automatically the last data persisted.



## **Examples**

The following code will create some keys:

```javascript
const { efemem } = require('./efememdb.js');



let result = efemem.set("maxValue", 100, "config");

result = efemem.set("minValue", 1, "config");

result = efemem.set("maxValue", 3000, "sales");

result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")
```



You can save the data with the following command:

```javascript
result = efemem.persist();
```



The result will be following one:

```javascript
result: {
  "ok": true,
  "cmd": "persist()",
  "data": {},
  "msg": "EFEMem DB has persisted the data. Total spaces: 3. Total keys: 4",
  "affected": 4,
  "time": "0s 3.630ms (3629900 nanoseconds)"
}
```



In a **NodeJS** enviroment, 4 files will be created:

- `efememdb.efs:` Index file
- `config.efd:` Data from **config** space name
- `sales.efd:` Data from **sales** space name
- `students.efd:` Data from **students** space name



In a web environment, 4 **localStorage** keys will be created:

- `efememdb-efs`
- `efememdb_config`
- `efememdb_sales`
- `efememdb_students`



## See also

- [restore() command](command-restore.md)



[Go to index](index.md)