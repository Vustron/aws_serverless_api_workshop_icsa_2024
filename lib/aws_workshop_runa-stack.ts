import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as cdk from "aws-cdk-lib"

import type { Construct } from "constructs"

export class AwsWorkshopRunaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const runaTodoTable = new dynamodb.Table(
      this,
      "todo_table_runa_michaeljoshua",
      {
        partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
        tableName: "todo_table_runa_michaeljoshua",
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      },
    )
  }
}
