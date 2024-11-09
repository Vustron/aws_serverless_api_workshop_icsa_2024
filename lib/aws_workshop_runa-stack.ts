import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as cdk from "aws-cdk-lib"
import * as path from "node:path"

import type { Construct } from "constructs"

export class AwsWorkshopRunaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const table = new dynamodb.Table(this, process.env.TABLE_NAME!, {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: process.env.TABLE_NAME!,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    const createTodoFunction = new NodejsFunction(this, "CreateTodoFunction", {
      entry: path.join(__dirname, "../lambda/createTodo.ts"),
      handler: "postTodoHandler",
      environment: {
        TABLE_NAME: table.tableName,
      },
    })

    const getTodosFunction = new NodejsFunction(this, "GetTodosFunction", {
      entry: path.join(__dirname, "../lambda/getTodos.ts"),
      handler: "getTodosHandler",
      environment: {
        TABLE_NAME: table.tableName,
      },
    })

    const getTodoFunction = new NodejsFunction(this, "GetTodoFunction", {
      entry: path.join(__dirname, "../lambda/getTodo.ts"),
      handler: "getTodoHandler",
      environment: {
        TABLE_NAME: table.tableName,
      },
    })

    const updateTodoFunction = new NodejsFunction(this, "UpdateTodoFunction", {
      entry: path.join(__dirname, "../lambda/updateTodo.ts"),
      handler: "updateTodoHandler",
      environment: {
        TABLE_NAME: table.tableName,
      },
    })

    const deleteTodoFunction = new NodejsFunction(this, "DeleteTodoFunction", {
      entry: path.join(__dirname, "../lambda/deleteTodo.ts"),
      handler: "deleteTodoHandler",
      environment: {
        TABLE_NAME: table.tableName,
      },
    })

    const createTodoIntegration = new apigateway.LambdaIntegration(
      createTodoFunction,
      {
        requestTemplates: { "application/json": '{ "statusCode": "200" }' },
      },
    )

    const getTodosIntegration = new apigateway.LambdaIntegration(
      getTodosFunction,
    )
    const getTodoIntegration = new apigateway.LambdaIntegration(getTodoFunction)
    const updateTodoIntegration = new apigateway.LambdaIntegration(
      updateTodoFunction,
    )
    const deleteTodoIntegration = new apigateway.LambdaIntegration(
      deleteTodoFunction,
    )

    const api = new apigateway.RestApi(this, "runa_TodoApi", {
      restApiName: "Runa_Todo_api_service",
      description: "This api service manages todos.",
    })

    const apiKey = api.addApiKey("TodoApiKey", {
      apiKeyName: process.env.API_KEY!,
    })

    const usagePlan = api.addUsagePlan("TodoApiUsagePlan", {
      name: "TodoApiUsagePlan",
      throttle: {
        rateLimit: 10,
        burstLimit: 20,
      },
      quota: {
        limit: 1000,
        period: apigateway.Period.MONTH,
      },
    })

    const todos = api.root.addResource("todos")
    const todo = todos.addResource("{id}")

    usagePlan.addApiKey(apiKey)
    usagePlan.addApiStage({
      stage: api.deploymentStage,
    })

    todos.addMethod("POST", createTodoIntegration, {
      apiKeyRequired: true,
    })
    todos.addMethod("GET", getTodosIntegration, {
      apiKeyRequired: true,
    })
    todo.addMethod("GET", getTodoIntegration, {
      apiKeyRequired: true,
    })
    todo.addMethod("PATCH", updateTodoIntegration, {
      apiKeyRequired: true,
    })
    todo.addMethod("DELETE", deleteTodoIntegration, {
      apiKeyRequired: true,
    })

    table.grantWriteData(createTodoFunction)
    table.grantReadData(getTodosFunction)
    table.grantReadData(getTodoFunction)
    table.grantWriteData(updateTodoFunction)
    table.grantWriteData(deleteTodoFunction)
  }
}
