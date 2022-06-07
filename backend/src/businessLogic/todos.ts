import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'


const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId = uuid.v4()
    return await todosAccess.createTodo({
      todoId: todoId,
      userId: userId,
      done: false,
      attachmentUrl: "",
      createdAt: new Date().toISOString(),
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate
})
}

export const getTodo = async (todoId: string): Promise<TodoItem> => {
    return await todosAccess.getTodo(todoId);
}

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
    return await todosAccess.getTodosForUser(userId);
}

export async function updateTodo(
    userId: string, 
    todoId: string, 
    updateTodoRequest: UpdateTodoRequest) {
    const item = await todosAccess.getTodo(todoId)
    const updateTodoError = new createError.Forbidden('Unauthorized: this is not your TODO');
    if (item.userId !== userId) {throw updateTodoError}    
    return await todosAccess.updateTodo(todoId, updateTodoRequest);
}

export async function deleteTodo(userId: string, todoId: string) {
    const item = await todosAccess.getTodo(todoId)
    const deleteTodoError = new createError.Forbidden('Unauthorized: this is not your TODO');
    if (item.userId !== userId) {throw deleteTodoError }    
    return await todosAccess.deleteTodo(todoId);
}

export async function createAttachmentPresignedUrl(userId: string, todoId: string, attachmentId: string) {
    const item = await todosAccess.getTodo(todoId)
    const createAttachmentPresignedUrlError = new createError.Forbidden('Unauthorized: this is not your TODO');
    if (item.userId !== userId) {throw createAttachmentPresignedUrlError } 
    return await attachmentUtils.getUploadUrl(attachmentId);

} 

// export const getUploadUrl = (attachmentId: string) => attachmentUtils.getUploadUrl(attachmentId);
