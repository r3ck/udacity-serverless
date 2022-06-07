import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosTableIndexName = process.env.TODOS_CREATED_AT_INDEX
  ) {
  }

  async getTodosForUser(userId: string): Promise<TodoItem[]> {
    const params = {
      TableName: this.todosTable,
      IndexName: this.todosTableIndexName,
      KeyConditionExpression: '#userId = :i',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':i': userId
      },
    };
    const result = await this.docClient.query(params).promise();
    return result.Items as TodoItem[]
  }

  async getTodo(todoId: string): Promise<TodoItem> {
    const params = {
      TableName: this.todosTable,
      Key: { todoId }
    };
    const result = await this.docClient.get(params).promise()
    return result.Item as TodoItem
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    const params = {
      TableName: this.todosTable,
      Item: todoItem,
    }
    await this.docClient.put(params).promise()
    return Promise.resolve(todoItem)
  }

  async updateTodo(todoId: string, todoUpdate: TodoUpdate) {
    const params = {
      TableName: this.todosTable,
      Key: {
        todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": todoUpdate.name,
        ":dueDate": todoUpdate.dueDate,
        ":done": todoUpdate.done
      }
    }
    await this.docClient.update(params).promise()

  }

  async deleteTodo(todoId: string): Promise<void> {
    const params = {
      TableName: this.todosTable,
      Key: {
        todoId
      }
    };
    await this.docClient.delete(params).promise();
    return Promise.resolve()
  }
}