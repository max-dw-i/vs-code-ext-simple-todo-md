import * as vscode from 'vscode';
import { TodoItemPriorityT } from './types';


export function isDecorateTodoItems() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('todo-md.decorateTodoItems') as boolean;
}

export function defaultPriority() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('todo-md.defaultPriority') as TodoItemPriorityT | "off";
}
