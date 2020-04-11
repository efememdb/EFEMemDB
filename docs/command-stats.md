# stats() command

## **Syntax** 

`stats()`



## **Parameters**

N/A



## **Description**

The `stats()` command analyzes the current database and returns the statistics of memory and data usage.



## **Examples**

The following code will create some keys:

`const { efemem } = require('./efememdb.js');`



`let result = efemem.set("maxValue", 100, "config");`

`result = efemem.set("minValue", 1, "config");`

`result = efemem.set("maxValue", 3000, "sales");`

`result = efemem.set("student:001", {name: "James", surname: "Gordon", job: "Police inspector"}, "students")`



You can get the database statistics with the following command:

`result = efemem.stats();`

The result will be following one:

`result: {`
  `"totalSpaces": 3,`
  `"totalKeys": 4,`
  `"time": "0s 1.306ms (1305500 nanoseconds)",`
  `"keySize": 184,`
  `"dataSize": 106,`
  `"dbSize": 368,`
  `"totalSize": 658,`
  `"spaces": [`
    `{`
      `"spaceName": "config",`
      `"spaceKeys": 2,`
      `"spaceKeySize": 88,`
      `"spaceDataSize": 16,`
      `"spaceDBSize": 184,`
      `"spaceTotalSize": 288`
    `},`
    `{`
      `"spaceName": "sales",`
      `"spaceKeys": 1,`
      `"spaceKeySize": 42,`
      `"spaceDataSize": 8,`
      `"spaceDBSize": 92,`
      `"spaceTotalSize": 142`
    `},`
    `{`
      `"spaceName": "students",`
      `"spaceKeys": 1,`
      `"spaceKeySize": 54,`
      `"spaceDataSize": 82,`
      `"spaceDBSize": 92,`
      `"spaceTotalSize": 228`
    `}`
  `]`
`}`

