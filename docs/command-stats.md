# stats() command

## **Syntax** 

`stats(key, space)`



## **Parameters**

| Parameter | Type   | Mandatory | Description        |
| --------- | ------ | --------- | ------------------ |
| `key`     | string | No        | Key name pattern   |
| `space`   | string | No        | Space name pattern |





## **Description**

The `stats()` command calculate statistics over numeric values in the keys that matches with the `key` and `space` [patterns](patterns.md).

The statistics includes:

- **`count`**: Number of involved values
- **`sum`**: Summatory of involved values
- **`min`**: Minimum value
- **`max`**: Maximum value
- **`avg`**: Average or mean
- **`var`**: Variance
- **`std`**: Standard deviation



**Note:** *A numeric value can be a number or a number represented as string*



## **Examples**

The following code will create some keys:

```javascript
const { efemem } = require('./efememdb.js');

efemem.set("student:001|class:Python", 9.7, "qualifications");
efemem.set("student:002|class:Python", 7.5, "qualifications");
efemem.set("student:003|class:Python", 6.7, "qualifications");
efemem.set("student:001|class:JavaScript", 8.7, "qualifications");
efemem.set("student:002|class:JavaScript", 6.6, "qualifications");
efemem.set("student:003|class:JavaScript", 8.3, "qualifications");
efemem.set("student:001|class:Java", "9.2", "qualifications");
efemem.set("student:002|class:Java", "9.5", "qualifications");
efemem.set("student:003|class:Java", "8.9", "qualifications");
efemem.set("student:005|class:Python", 5.8, "qualifications");`
```



If you want to get the statistics over the qualifications of the class Python, you could be execute the following commands:

`let result = efemem.stats("Python", "qualifications");`

The result will be the following:

```javascript
"count": 4,
"sum": 29.7,
"min": 5.8,
"max": 9.7,
"avg": 7.425,
"var": 2.782499999999999,
"std": 1.6680827317612275
```

With the next command you can get the statistics over the qualificatiions for Java and JavaScript classes:

```javascript
result = efemem.stats("Java", "qualifications");
```



The result will be this:

```javascript
"count": 6,
"sum": 51.199999999999996,
"min": 6.6,
"max": 9.5,
"avg": 8.533333333333333,
"var": 1.0666666666666669,
"std": 1.0327955589886446
```


**Note:** *Remember that the parameters are patterns. It means that the characters will be found as part of the entire key or space. In this case, the pattern `"Java"` will found at any position of the key.*



Finally, if you want the statistics over the student with id `"001"`, try the following command:

```javascript
result = efemem.stats("student:001", "qualifications");
```



The result will be the following one:

```javascript
{
  "ok": true,
  "cmd": "stats()",
  "data": {
    "count": 3,
    "sum": 27.599999999999998,
    "min": 8.7,
    "max": 9.7,
    "avg": 9.2,
    "var": 0.25,
    "std": 0.5
  },
  "msg": "Statistics for 'student:001' and space 'qualifications' patterns retrieved successfully",
  "affected": 3,
  "time": "< 1 ms"
}
```



## See also

- [Keys](keys.md)
- [Spaces](spaces.md)
- [Values](values.md)
- [Pattern names](patterns.md)



[Go to index](index.md)