# info() command

## **Syntax** 

`info()`



## **Parameters**

N/A



## **Description**

The `info()` command shows the current status information:

- **EFEMemDB Database** version
- NodeJS environment (true/false)
- Configuration parameters and values
- Memory usage
- Current spaces
- Current keys



## **Examples**

The following code will shows you the current status information :

`const { efemem } = require('./efememdb.js');`

`console.log(efemem.info());`



The result could be the following one:

`EFEMem NoSQL DataBase version 1.0.4`

`Running on NodeJS: true`

`Configuration: {`
  `"accessKey": "!X~*zW7m:Zlzp^3%=*$*mc6$4ZW^D4=e2|^I-6X2D4X|7-n][{-+4Mg=t&^~@Xfp",`
  `"maxMemory": 1048576,`
  `"maxKeys": 1000,`
  `"recyclingMode": false,`
  `"dataPath": "./"`
`}`
`Memory usage: {`
  `"maxMemory": 1048576,`
  `"usedMemory": 790,`
  `"freeMemory": 1047786`
`}`
`Total spaces: 3`
   `["config","employees","public"]`
`Total keys: 5 of 1000`