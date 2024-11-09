import { GetCommand } from "@aws-sdk/lib-dynamodb"

import { dynamoDb } from "../lib/db"

import type { GetCommandInput } from "@aws-sdk/lib-dynamodb"
import type { TodoItem } from "../interfaces/todo"

export const getTodoHandler = async (event: any) => {
  try {
    const { id } = event.pathParameters

    // Set up parameters for the Get operation
    const params: GetCommandInput = {
      TableName: process.env.TABLE_NAME!,
      Key: { id },
    }

    // Execute the GetCommand to retrieve the item
    const data = await dynamoDb.send(new GetCommand(params))

    if (data.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(data.Item as TodoItem),
      }
    }
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Todo not found" }),
    }
  } catch (error) {
    console.error("Error retrieving todo item:", error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve the todo item" }),
    }
  }
}
