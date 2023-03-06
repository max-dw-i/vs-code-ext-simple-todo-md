import * as vscode from 'vscode';
import { TodoItemPriority } from './types';


export function isDecorateTodoItems() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('todo-md.decorateTodoItems') as boolean;
}

export function defaultPriority() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('todo-md.defaultPriority') as TodoItemPriority | "off";
}
