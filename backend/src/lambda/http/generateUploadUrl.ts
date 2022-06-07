import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import * as uuid from 'uuid'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const attachmentId = uuid.v4()
    const createAttachmentPresignedUrlResponse = createAttachmentPresignedUrl(userId, todoId, attachmentId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: createAttachmentPresignedUrlResponse
      })
    }  
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
