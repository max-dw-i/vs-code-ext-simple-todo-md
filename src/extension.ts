import * as vscode from 'vscode';
import * as editor from './editor';


export function activate(context: vscode.ExtensionContext) {
	editor.registerActions(context);
}

export function deactivate() {
}
