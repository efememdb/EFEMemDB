# Spaces

**EFEMem Database** organizes the keys using space names. One space name groups a set of keys under a common context.

For example, you can organize a set of keys related with the configuration using a space named **config**, or you can compile the keys related with the students data under a space named **students**.

You can group your keys into spaces names for an easy and efficient organization. Also, the space name defines an scope of keys, which means that you can define key names repeated, but they must be unique on each space name. For example, you can define a key named **maxValue** into the space **config**, and other key also named **maxValue** into the space **sales**.



## **Key name rules**

The rules for the space names are the following:

- Maximum length of 24 characters.
- Only alphabetical and numeric characters.
- The first character must be alphabetical.
- Lowercase and uppercase letters.
- Case sensitive. Lowercase and uppercase are considered as different values.



Correct space names could be the following:

- **`config`**
- **`course2020`**
- **`salesAndRevenue`**



Incorrect space names could be the following:

- **`course 2020`** (space is not allowed)
- **`2020course`** (first character cannot be numeric)
- **`sales&revenue`** (ampersand is not allowed)



## See also

- [Keys](keys.md)
- [Values](values.md)
- [Pattern names](patterns.md)
- [spaces() command](command-spaces.md)



[Go to index](index.md)