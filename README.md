# rdsLambda
This example demostrates how to build a Lambda (Node/Python) that connects to an RDS instance and optionally use IAM authentication


## Introduction

This example demostrates how to use build a Lambda function that can connect to RDS Aurora. It uses MySQL drivers and is implemented in both NodeJS and Python. Optionally, it also shows how to use the IAM Authentication feature in RDS Aurora.

## Step 0 - Create the RDS DB.

## Step 1 - Configure the DB
The connection to the database is encrypted via SSL. Download the PEM certificate required [here] (http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html)

Create an IAM user authenticated by RDS. See [docs] (http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html)

```
CREATE USER jane_doe IDENTIFIED WITH AWSAuthenticationPlugin as 'RDS';    
```

Create a user on your RDS instance with username/password.

## Step 2 - Create Lambda function and setup Env variables
The code depends on a few environment variables that need to match your deployed RDS instance:

```
endpoint: somename.someuniquevalue.us-west-2.rds.amazonaws.com
password: somepassword
useIAM: 1 for IAM Auth, 0 for RDS auth
my_db: DB name
user: Rds username
```

VPC enable your Lambda function and attach it to the same subnet your RDS instance is in.

## Resources

- **rdsTestFn.js** - NodeJS Based Lambda function that connects to RDS and performs a simple SELECT statement
- **myrdstest.py** - Python Based Lambda function that connects to RDS and performs a simple SELECT statement
