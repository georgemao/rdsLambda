# rdsLambda
An example how to use a Lambda (Node/Python) to connect to RDS and optionally use IAM authentication


## Introduction

This example demostrates how to use build a Lambda function that can connect to RDS Aurora. It uses MySQL drivers and is implemented in both NodeJS and Python. Optionally, it also shows how to use the IAM Authentication feature in RDS Aurora.

```
test
```

## Resources

- **rdsTestFn.js** - NodeJS Based Lambda function that connects to RDS and performs a simple SELECT statement
- **myrdstest.py** - Python Based Lambda function that connects to RDS and performs a simple SELECT statement

