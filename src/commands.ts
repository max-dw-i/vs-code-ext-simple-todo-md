import * as vscode from 'vscode';
import * as editor from './editor';


function convertToTodoItem() {
    const curLine = editor.getCurrentLine();
    if (curLine) {
        editor.insertTodoItemBullet(curLine);
    }
}

export function registerCommands(context: vscode.ExtensionContext) {
    let disposable;
    disposable = vscode.commands.registerCommand(
        'todo-md.convertToTodoItem',
        convertToTodoItem
    );
    context.subscriptions.push(disposable);
}
