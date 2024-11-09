import { PutCommand } from "@aws-sdk/lib-dynamodb"

import { dynamoDbClient } from "../lib/db"

import type { PutCommandInput } from "@aws-sdk/lib-dynamodb"
import type { TodoItem } from "../interfaces/todo"

export const postTodoHandler = async (event: any) => {
  try {
    const data: TodoItem = JSON.parse(event.body)

    // Basic validation
    if (!data.id || !data.title || !data.description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      }
    }

    const todoItem: TodoItem = {
      id: data.id,
      title: data.title,
      description: data.description,
      completed: false,
    }

    const params: PutCommandInput = {
      TableName: process.env.TABLE_NAME!,
      Item: todoItem,
    }

    await dynamoDbClient.send(new PutCommand(params))

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Todo created successfully!",
        item: todoItem,
      }),
    }
  } catch (error) {
    console.error("Error creating todo item:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create the todo item" }),
    }
  }
}
