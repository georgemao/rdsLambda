# rdsLambda
An example how to use a Lambda (Node/Python) to connect to RDS and optionally use IAM authentication


## Introduction

This example demostrates how to use build a Lambda function that can connect to RDS Aurora. It uses MySQL drivers and is implemented in both NodeJS and Python. Optionally, it also shows how to use the IAM Authentication feature in RDS Aurora.

## Notes
The connection to the database is encrypted via SSL. You can download the PEM certificate required [here] (http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html)

The code depends on a few environment variables that need to match your deployed RDS instance:

```
endpoint: somename.someuniquevalue.us-west-2.rds.amazonaws.com
password: somepassword
useIAM: 1 for IAM Auth, 0 for RDS auth
my_db: DB name
user: Rds username
```

## Resources

- **rdsTestFn.js** - NodeJS Based Lambda function that connects to RDS and performs a simple SELECT statement
- **myrdstest.py** - Python Based Lambda function that connects to RDS and performs a simple SELECT statement

