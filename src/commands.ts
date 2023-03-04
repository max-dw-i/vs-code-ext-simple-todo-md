import * as vscode from 'vscode';
import * as editor from './editor';
import * as item from './item';


function convertToTodoItem() {
    const curLine = editor.getCurrentLine();
    if (curLine) {
        item.insertTodoItemBullet(curLine);
    }
}

function toggleTodoItem() {
    const curLine = editor.getCurrentLine();
    if (curLine) {
        item.toggleTodoItem(curLine);
    }
}

export function registerCommands(context: vscode.ExtensionContext) {
    let disposable;
    disposable = vscode.commands.registerCommand(
        'todo-md.convertToTodoItem',
        convertToTodoItem
    );
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand(
        'todo-md.toggleTodoItem',
        toggleTodoItem
    );
    context.subscriptions.push(disposable);
}
