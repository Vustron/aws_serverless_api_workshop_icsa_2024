import { UpdateCommand } from "@aws-sdk/lib-dynamodb"

import { dynamoDb } from "../lib/db"

import type { UpdateCommandInput } from "@aws-sdk/lib-dynamodb"
import type { TodoItem } from "../interfaces/todo"

export const updateTodoHandler = async (event: any) => {
  try {
    const { id } = event.pathParameters
    const data: TodoItem = JSON.parse(event.body)

    // Basic validation to ensure at least one field is provided
    if (!data.title && !data.description && data.completed === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "At least one field (title, description, completed) must be provided for update",
        }),
      }
    }

    // Build the UpdateExpression dynamically based on provided fields
    let updateExpression = "set"
    const ExpressionAttributeValues: { [key: string]: any } = {}
    const ExpressionAttributeNames: { [key: string]: string } = {}

    if (data.title) {
      updateExpression += " #title = :title,"
      ExpressionAttributeValues[":title"] = data.title
      ExpressionAttributeNames["#title"] = "title"
    }

    if (data.description) {
      updateExpression += " #description = :description,"
      ExpressionAttributeValues[":description"] = data.description
      ExpressionAttributeNames["#description"] = "description"
    }

    if (data.completed !== undefined) {
      updateExpression += " #completed = :completed,"
      ExpressionAttributeValues[":completed"] = data.completed
      ExpressionAttributeNames["#completed"] = "completed"
    }

    // Remove the trailing comma
    updateExpression = updateExpression.slice(0, -1)

    // Set up parameters for the UpdateCommand
    const params: UpdateCommandInput = {
      TableName: process.env.TABLE_NAME!,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
      ReturnValues: "UPDATED_NEW",
    }

    // Execute the UpdateCommand to update the item
    const result = await dynamoDb.send(new UpdateCommand(params))

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Todo updated successfully",
        updatedAttributes: result.Attributes,
      }),
    }
  } catch (error) {
    console.error("Error updating todo item:", error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not update the todo item" }),
    }
  }
}
