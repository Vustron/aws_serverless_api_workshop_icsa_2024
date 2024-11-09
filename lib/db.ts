import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export const dynamoDbClient = new DynamoDBClient()
export const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient)
