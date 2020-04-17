# Change log

## 1.0.5 (2020-04-19)

### Features

- Added automated testing (`testing` folder)
- Main and unique file: `efememdb.js`
- Code adapted for Web applications
- `example.html` demo



### Fixes

- Added `created`, `updated` and `due` dates to the result of `values()` command
-  `persist()` command refactorized and optimized
- Extension for index file (persistence): `efememdb.efs` (EFemem Spaces)
- Extension for data files (persistence): `<space_name>.efd` (EFemem Data)
- `restore()` command refactorized and optimized



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
