import * as vscode from 'vscode';


export function isDecorateTodoItems() {
    const configuration = vscode.workspace.getConfiguration();
    return configuration.get('todo-md.decorateTodoItems');
}
