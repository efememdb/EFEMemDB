# persist() command

## **Syntax** 

`persist()`



## **Parameters**

N/A



## **Description**

The `persist()` command saves all the current data into disk, using the directory defined in `dataPath` configuration parameter, at `efememdb.json` file.

This command will create an index file, named `efememdb.idb`, which will contain the current list of space names.

For each space name, it will create a file with the same name as the space name, with `.data` extension, which contains the data of all keys and values on such space name.

These files will be used by **EFEMem DB** when starts, in order to load automatically the last data persisted.

You can recover the last persisted data, using the command `restore()`.

**Important note:** *This command only can be used on NodeJS.*



## **Examples**

The following code will create some keys:

`const { efemem } = require('./efememdb.js');`



`let result = efemem.set("maxValue", 100, "config");`

`result = efemem.set("minValue", 1, "config");`

`result = efemem.set("maxValue", 3000, "sales");`

`result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")`



You can save the data with the following command:

`result = efemem.persist();`



The result will be following one:

`result: {`
  `"ok": true,`
  `"cmd": "persist()",`
  `"data": {},`
  `"msg": "EFEMem DB has persisted the data. Total spaces: 3. Total keys: 4",`
  `"affected": 4,`
  `"time": "0s 3.630ms (3629900 nanoseconds)"`
`}`



After the execution, 4 files has been created:

- `efememdb.idb:` Index file
- `config.data:` Data from **config** space name
- `sales.data:` Data from **sales** space name
- `students.data:` Data from **students** space name

