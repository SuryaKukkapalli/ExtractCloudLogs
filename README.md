# ExtractCloudLogs
1.Send cloud watch logs of one lambda function to another lambda function and insert those logs into dynamoDB.
2.All resources needed for the application is mentioned in the serverless.yml file like lambda functions, dynamoDb table.
3.Added subscription Filter on "/aws/lambda/serverless-nodejs-app-dev-hello" and destination arn as another lambda "/aws/lambda/serverless-nodejs-app-dev-getLo".
getLo lambda will trigger when hello function logs pattern matches the subscription filter.
