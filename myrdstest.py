import mysql.connector
import boto3
import os

RDS_HOST = 'myaurorards.cvbjqjhsfcqp.us-west-2.rds.amazonaws.com'
RDS_USER = 'rds_user'
RDS_REGION = 'us-west-2'

rds = boto3.client('rds')

rds = boto3.client(
    'rds',
    aws_access_key_id='AKIAIG5Y4FGPBU5WSORQ',
    aws_secret_access_key='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'
)


def handler(event, context):
    password = rds.generate_db_auth_token(
        DBHostname=RDS_HOST,
        Port=3306,
        DBUsername=RDS_USER
    )

    conn = mysql.connector.connect(
        user=RDS_USER,
        password=password,
        host=RDS_HOST,
        database='my_db',
        charset='utf8',
        ssl_verify_cert=True,
        ssl_ca='./rds-combined-ca-bundle.pem'
    )

    cursor = conn.cursor()
    cursor.execute('SELECT * FROM Employees')
    rows = cursor.fetchall()
    for row in rows:
        print(row)
