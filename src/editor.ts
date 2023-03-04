import * as vscode from 'vscode';
import * as utils from './utils';


const TODO_ITEM_BULLET = '- [ ]';
const todoItemBulletRegex = new RegExp('^\\s*-\\s\\[(\\s|x|X)?\\]');


function replaceCurrentLine(str: string) {
    const { editor, doc } = utils.getCurrentEditorAndDocument();
    if (editor && doc) {
        const curPos = editor.selection.active;
        const curLineRange = doc.lineAt(curPos.line).range;
        const curLineSelection = new vscode.Selection(curLineRange.start, curLineRange.end);
        editor.edit(editBuilder => {
            editBuilder.replace(curLineSelection, str);
        });
    }
}

function convertToTodoItem() {
    const { editor, doc } = utils.getCurrentEditorAndDocument();
    if (editor && doc) {
        const curPos = editor.selection.active;
        const curLine = doc.lineAt(curPos.line);
        const curLineText = curLine.text;
        if (!todoItemBulletRegex.test(curLineText)) {
            const essentialInd = curLine.firstNonWhitespaceCharacterIndex;
            const whitespaces = curLineText.slice(0, essentialInd);
            const meaningfulText = curLineText.slice(essentialInd, curLineText.length);
            replaceCurrentLine(`${whitespaces}${TODO_ITEM_BULLET} ${meaningfulText}`);
        }
    }
}

export function registerActions(context: vscode.ExtensionContext) {
    let disposable;
    disposable = vscode.commands.registerCommand(
        'todo-md.convertToTodoItem',
        convertToTodoItem
    );
    context.subscriptions.push(disposable);
}
