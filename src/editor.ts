import * as vscode from 'vscode';
import { TodoItem } from './item';
import * as settings from './settings';


const linethroughDecorationType = vscode.window.createTextEditorDecorationType({
    textDecoration: 'line-through',
    color: new vscode.ThemeColor('disabledForeground')
});


function getCurrentEditorAndDocument() {
    const editor = vscode.window.activeTextEditor;
    return {
        editor: editor,
        doc: editor?.document
    };
}

function currentLine() {
    const { editor, doc } = getCurrentEditorAndDocument();
    if (editor && doc) {
        const curPos = editor.selection.active;
        return doc.lineAt(curPos.line);
    }
}

function replaceLine(line: vscode.TextLine, replaceWith: string) {
    const { editor } = getCurrentEditorAndDocument();
    if (editor) {
        const lineRange = line.range;
        const lineSelection = new vscode.Selection(lineRange.start, lineRange.end);
        return editor.edit(editBuilder => {
            editBuilder.replace(lineSelection, replaceWith);
        });
    }
}

export function decorate() {
    const { editor, doc } = getCurrentEditorAndDocument();
    if (editor && doc) {
        const decorationRanges = [];
        for (let i = 0; i < doc.lineCount; i++) {
            const line = doc.lineAt(i);
            const todoItem = new TodoItem(line.text);
            if (todoItem.bullet === true) {
                const startPos = new vscode.Position(
                    line.lineNumber,
                    line.firstNonWhitespaceCharacterIndex
                );
                const endPos = new vscode.Position(line.lineNumber, line.range.end.character);
                const range = new vscode.Range(startPos, endPos);
                decorationRanges.push(range);
            }
        }
        editor.setDecorations(linethroughDecorationType, decorationRanges);
    }
}

export function convertToTodoItem() {
    const curLine = currentLine();
    if (curLine) {
        const item = new TodoItem(curLine.text);
        item.convert();
        replaceLine(curLine, item.toString());
    }
}

export function toggleTodoItem() {
    const curLine = currentLine();
    if (curLine) {
        const item = new TodoItem(curLine.text);
        item.toggle();

        const promise = replaceLine(curLine, item.toString());
        if (promise && settings.isDecorateTodoItems()) {
            promise.then(() => { decorate(); });
        }
    }
}
