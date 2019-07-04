## Instructions

1. Compile `main1.c` and run it:

```
make main1
./main1
```

2. Compile sum.c into a shared library (`.so`) file

```
make shared
```

3. Once `main2.c` is implemented, compile it so that it dynamically links `sum.so` from previous step at runtime

```
make main2
./main2
```
