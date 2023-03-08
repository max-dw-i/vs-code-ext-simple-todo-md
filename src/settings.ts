import * as vscode from 'vscode';
import { TodoItemPriorityT, DateFormatT } from './types';


export function isDecorateTodoItems() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('todo-md.decorateTodoItems') as boolean;
}

export function defaultPriority() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('todo-md.defaultPriority') as TodoItemPriorityT | "off";
}

export function dateFormat() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('todo-md.dateFormat') as DateFormatT;
}

export function isAutoStartDate() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('todo-md.autoStartDate') as boolean;
}
