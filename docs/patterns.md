# Pattern names

**EFEMem Database** facilitates you the search of spaces and keys using patterns. In the most cases, when you specify a name to refer to spaces or keys, this name will be used as a pattern or, more specifically, as part of the complete name. The name will be assumed as a pattern like `*name*`, which means: *"take any character before and after the string of characters 'name'"*

You also can use the concept of pattern with spaces names, combining with keys, spreading the affected results.

For example, you have the following key names:

- **`course2018`**
- **`course2019`**
- **`course2020`**



You can find all the courses using the following pattern: **`course`**

If you want to get the courses finalized on 201x decade, you can use the following pattern: **course201**

If you use **`20`** as name, you will get all the keys.



**Note:** If you don't specify a name (null value or empty character), pattern "*" will be assumed (all names or any character in the name).



## See also

- [Keys](keys.md)
- [Spaces](spaces.md)



[Go to index](index.md)