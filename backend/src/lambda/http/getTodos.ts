import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const getTodosForUserResponse = await getTodosForUser(userId);
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: getTodosForUserResponse
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
