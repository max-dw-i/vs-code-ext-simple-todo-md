import * as vscode from 'vscode';
import { TodoItemPriorityT, DateFormatT } from './types';


export function isDecorateTodoItems() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('simple-todo-md.decorateTodoItems') as boolean;
}

export function defaultPriority() {
    const configuration = vscode.workspace.getConfiguration();
    const priority = configuration.get(
        'simple-todo-md.defaultPriority'
    ) as TodoItemPriorityT | "off";
    if (priority === 'off') {
        return null;
    }
    return priority;
}

export function dateFormat() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('simple-todo-md.dateFormat') as DateFormatT;
}

export function isAutoStartDate() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('simple-todo-md.autoStartDate') as boolean;
}

export function isAutoEndDate() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('simple-todo-md.autoEndDate') as boolean;
}
