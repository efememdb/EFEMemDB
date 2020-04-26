# Change log

## 1.0.8 (2020-05-03)

### Features

- Key names by default. If you `set()` a value without a key, a hash value will be assumed as the name of the key. This hash value will contain 24 characters in hexadecimal format, and will assure the key name will be unique and irrepetible.
- Error results are now minimalists: `{ok: false, cmd: "command()", msg: "error message"}`
- Results returns the complete command syntax
- Initial memory size reduced to 10MB



### Fixes

- Code more stable, thanks to more exceptions control
- `check()` command result fixed



## 1.0.7 (2020-04-19)

### Fixes

- When you imported **npm** package in NodeJS, the **efemem** object is not visible. `module.exports` added



## 1.0.6 (2020-04-19)

### Features

- Added `copy()` command
- Added automated testing (`testing` folder)
- Main and unique file: `efememdb.js`
- Code adapted for Web applications
- `example.html` demo
- `stats()` command calculates now statistics with numeric values applying **count**, **sum**, **min**(imum), **max**(imum), **avg** (average), **var** (variance) and **std** (standard deviation) operations



### Fixes

- Added `created`, `updated` and `due` dates to the result of `values()` command
-  `persist()` command refactorized and optimized
- Extension for index file (persistence): `efememdb.efs` (EFemem Spaces)
- Extension for data files (persistence): `<space_name>.efd` (EFemem Data)
- `restore()` command refactorized and optimized
- `move()` repeated an existing key (if this key was recovered from persistence when starting)
- Internal functions `getKeyDetail()` and `deleteIndex()` has been written out of the class, and, henceforth, are not accesible.



## 1.0.4 (2020-04-12)

### Features

- EFEMem DB Logo included in documentation
- Complete code in an unique JS file
- Execution environment identification through the `nodejsEnv` property (`true` or `false`)
- Execution time calculated with `Date()` instead of `process.hrtime()`. This method is valid for NodeJS and standard JavaScript
- Added `info()` command. 



### Fixes

- Documentation corrections
- `keysmax` config parameter changed to `maxKeys`



## 1.0.3 (2020-04-11)

### Fixes

- Main code (efememdb.js) translation to index.js in order to import library correctly
- Set `dataPath` to `'./'` directory by default



## 1.0.2 (2020-04-11)

Tunning package.json



## 1.0.1 (2020-04-11)

Tuninng package.json



## 1.0.0 (2020-04-10)

**EFEMem Database first version.**

### Features

- NodeJS library
- Commands:
  - set
  - get
  - delete
  - rename
  - move
  - check
  - spaces
  - keys
  - values
  - stats
  - memory
  - persist
  - restore
  - getConfig
  - setConfig
- Configuration params:
  - maxMemory
  - maxKeys
  - reclyclingMode
  - dataPath
