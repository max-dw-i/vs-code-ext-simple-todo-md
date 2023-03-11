import * as vscode from 'vscode';
import * as editor from './editor';


export function register(context: vscode.ExtensionContext) {
    let disposable;
    disposable = vscode.commands.registerCommand(
        'simple-todo-md.convertToTodoItem',
        editor.convertToTodoItem
    );
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand(
        'simple-todo-md.toggleTodoItem',
        editor.toggleTodoItem
    );
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand(
        'simple-todo-md.sortByPriority',
        editor.sortByPriority
    );
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand(
        'simple-todo-md.sortByDueDate',
        editor.sortByDueDate
    );
    context.subscriptions.push(disposable);
}
