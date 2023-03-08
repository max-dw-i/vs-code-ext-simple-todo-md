import * as vscode from 'vscode';
import * as editor from './editor';
import * as settings from './settings';


export function register(context: vscode.ExtensionContext) {
    if (settings.isDecorateTodoItems()) {
        vscode.workspace.onDidChangeTextDocument(ev => {
            const activeEditor = editor.getCurrentEditorAndDocument()['curEditor'];
            if (activeEditor && ev.document === activeEditor.document) {
                editor.decorate();
            }
        }, null, context.subscriptions);
    }
}
