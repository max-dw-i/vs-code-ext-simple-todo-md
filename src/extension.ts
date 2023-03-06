import * as vscode from 'vscode';
import * as commands from './commands';
import { decorate } from './editor';
import * as settings from './settings';


export function activate(context: vscode.ExtensionContext) {
	commands.registerCommands(context);
	if (settings.isDecorateTodoItems()) {
		decorate();
	}
}

export function deactivate() {
}
