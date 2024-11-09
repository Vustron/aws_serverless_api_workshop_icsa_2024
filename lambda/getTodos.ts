import { ScanCommand } from "@aws-sdk/lib-dynamodb"

import { dynamoDbClient } from "../lib/db"

import type { ScanCommandInput } from "@aws-sdk/lib-dynamodb"
import type { TodoItem } from "../interfaces/todo"

export const getTodosHandler = async () => {
  // Set up parameters for the Scan operation
  const params: ScanCommandInput = {
    TableName: process.env.TABLE_NAME!,
  }

  try {
    // Execute the ScanCommand to retrieve items
    const data = await dynamoDbClient.send(new ScanCommand(params))

    // Extract items from the response
    const items = data.Items as TodoItem[]

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    }
  } catch (error) {
    console.error("Error retrieving todo items:", error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve the todo items" }),
    }
  }
}
