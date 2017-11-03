# rdsLambda
This example demostrates how to build a Lambda (Node/Python) that connects to an RDS instance and optionally use IAM authentication.


## Introduction

This example demostrates how to use build a Lambda function that can connect to RDS Aurora. It uses MySQL drivers and is implemented in both NodeJS and Python. Optionally, it also shows how to use the IAM Authentication feature in RDS Aurora. In order to use IAM authentication, you must create a user in you database that uses the 'RDS' AWSAuthenticationPlugin. You will must generate an authentication token as the password using an [API](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.AWSCLI.html#UsingWithRDS.IAMDBAuth.Connecting.AWSCLI.AuthToken) call.

## Step 0 - Create the RDS DB
Make sure you enable RDS IAM authentication as decribed [here](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Enabling.html).

## Step 1 - Configure the DB
The connection to the database is encrypted via SSL. Download the PEM certificate required [here](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html). You will include this in your Lambda deployment package.

Create a Database User authenticated by RDS. See [docs](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html) for instructions.
Here is a sample command:

```sql
CREATE USER jane_doe IDENTIFIED WITH AWSAuthenticationPlugin as 'RDS';    
```

Create a regular user on your RDS instance with username/password so you can make regular/non-IAM authenticated connections.

## Step 2 - Create Lambda function and setup Env variables
The code depends on a few environment variables that need to match your deployed RDS instance:

```
endpoint: somename.someuniquevalue.us-west-2.rds.amazonaws.com
```
```
password: somepassword
```
```
useIAM: 1 for IAM Auth, 0 for RDS auth
```
```
my_db: DB name
```
```
user: Rds username
```

VPC enable your Lambda function and attach it to the same subnet your RDS instance is in.

## Step 3 -- Create the IAM user and setup permissions
Create an IAM user. THe name must match the name of the DB user you created in Step 1.
Attach a permission that allows the user to connect to your Database. Here's an example (rds_user is the DB and IAM user name):

```json
        {
            "Effect": "Allow",
            "Action": [
                "rds-db:connect"
            ],
            "Resource": [
                "arn:aws:rds-db:us-west-2:xxxxxxxxx:dbuser:*/rds_user"
            ]
        }
```

## Step 4 -- Test the RDS IAM Authentication!

From the CLI, generate an auth token for your IAM/RDS user via the [generate-db-auth-token](http://docs.aws.amazon.com/cli/latest/reference/rds/generate-db-auth-token.html) command.


```bash
aws rds generate-db-auth-token \
   --hostname rdsmysql.cdgmuqiadpid.us-west-2.rds.amazonaws.com \
   --port 3306 \
   --region us-west-2 \
   --username jane_doe   
```
**Note** - You must run this command AS the IAM/RDS user you wish to generate a token for

## Resources

- **rdsTestFn.js** - NodeJS Based Lambda function that connects to RDS and performs a simple SELECT statement
- **myrdstest.py** - Python Based Lambda function that connects to RDS and performs a simple SELECT statement
