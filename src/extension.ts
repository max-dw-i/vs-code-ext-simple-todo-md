import * as vscode from 'vscode';
import * as commands from './commands';
import * as editor from './editor';
import * as events from './events';
import * as settings from './settings';


export function activate(context: vscode.ExtensionContext) {
	events.register(context);
	commands.register(context);

	if (settings.isDecorateTodoItems()) {
		editor.decorate();
	}
}

export function deactivate() {
}
