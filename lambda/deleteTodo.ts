import { DeleteCommand } from "@aws-sdk/lib-dynamodb"

import { dynamoDb } from "../lib/db"

import type { DeleteCommandInput } from "@aws-sdk/lib-dynamodb"

export const deleteTodoHandler = async (event: any) => {
  try {
    const { id } = event.pathParameters

    // Set up parameters for the Delete operation
    const params: DeleteCommandInput = {
      TableName: process.env.TABLE_NAME!,
      Key: { id },
    }

    // Execute the DeleteCommand to remove the item
    await dynamoDb.send(new DeleteCommand(params))

    // Return a successful response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Todo deleted successfully" }),
    }
  } catch (error) {
    console.error("Error deleting todo item:", error)

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not delete the todo item" }),
    }
  }
}
