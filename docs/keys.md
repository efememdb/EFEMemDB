# Keys

**EFEMem database** storage is based on key and value pairs. Every value is associated to an unique key.

A key is an unique name that identifies exclusively a value. If you use the same key for two values, only a key-value is available (the last one).

**EFEMem database** provides you the space name feature. You can group your keys into spaces names for an easy and efficient organization. Also, the space name defines an scope of keys, which means that you can define repetated key names, but only unique key names on each space name. For example, you can define a key named **maxValue** into the space **config**, and other key also named **maximumValue** into the space **sales**.

You can locate and access quickly to the values using the key names. **EFEMem database** allows you to filter and find easily the keys through efficient commands.



## **Key name rules**

The rules for a key name are the following:

- Maximum length of 100 characters.
- You can use  alphabetical and numeric characters.
- You can use special characters as separators. These special characters are: "|" (pipe), "#" (number), "_" (underscore), ":" (colon) and "." (period or point)
- The first character must be alphabetical.
- Lowercase and uppercase letters.
- Case sensitive. Lowercase and uppercase are different values.



Correct key names could be the following:

- **maximumValue**
- **course|English|2020**
- **student:001|city:020**



The key must be a set of relevant information, that helps you to find and identify the associated value. For example, the key **student:001|city:020** contains the student and city ids, and you will search the value using this information or part of this data.

Incorrect key names example are the following:

- **course English** (space is not allowed)
- **2020course** (first character cannot be numeric)
- **student:001@city:020** (character @ is not allowed)