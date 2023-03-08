import * as vscode from 'vscode';
import { TodoItem } from './item';


const linethroughDecorationType = vscode.window.createTextEditorDecorationType({
    textDecoration: 'line-through',
    color: new vscode.ThemeColor('disabledForeground')
});


export function getCurrentEditorAndDocument() {
    const editor = vscode.window.activeTextEditor;
    return {
        curEditor: editor,
        curDoc: editor?.document
    };
}

function currentLine() {
    const { curEditor, curDoc } = getCurrentEditorAndDocument();
    if (curEditor && curDoc) {
        const curPos = curEditor.selection.active;
        return curDoc.lineAt(curPos.line);
    }
}

function replaceLine(line: vscode.TextLine, replaceWith: string) {
    const { curEditor } = getCurrentEditorAndDocument();
    if (curEditor) {
        const lineRange = line.range;
        const lineSelection = new vscode.Selection(lineRange.start, lineRange.end);
        return curEditor.edit(editBuilder => {
            editBuilder.replace(lineSelection, replaceWith);
        });
    }
}

export function decorate() {
    const { curEditor, curDoc } = getCurrentEditorAndDocument();
    if (curEditor && curDoc) {
        const decorationRanges = [];
        for (let i = 0; i < curDoc.lineCount; i++) {
            const line = curDoc.lineAt(i);
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
        curEditor.setDecorations(linethroughDecorationType, decorationRanges);
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
        replaceLine(curLine, item.toString());
    }
}
