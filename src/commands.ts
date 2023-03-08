import * as vscode from 'vscode';
import * as editor from './editor';


export function register(context: vscode.ExtensionContext) {
    let disposable;
    disposable = vscode.commands.registerCommand(
        'todo-md.convertToTodoItem',
        editor.convertToTodoItem
    );
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand(
        'todo-md.toggleTodoItem',
        editor.toggleTodoItem
    );
    context.subscriptions.push(disposable);
}
