import * as vscode from 'vscode';
import { TodoItem } from './item';


const LINE_SEPARATOR = '\n';

const linethroughDecorationType = vscode.window.createTextEditorDecorationType({
    textDecoration: 'line-through',
    color: new vscode.ThemeColor('disabledForeground')
});


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


export function getCurrentEditorAndDocument() {
    const editor = vscode.window.activeTextEditor;
    return {
        curEditor: editor,
        curDoc: editor?.document
    };
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

function sort(compareFn: ((a: TodoItem, b: TodoItem) => number)) {
    const { curEditor, curDoc } = getCurrentEditorAndDocument();
    if (curEditor && curDoc) {
        let range: vscode.Range;
        const curSelection = curEditor.selection;
        if (curSelection.start.character === curSelection.end.character
            && curSelection.start.line === curSelection.end.line) {
            const firstLine = curDoc.lineAt(0);
            const lastLine = curDoc.lineAt(curDoc.lineCount - 1);
            range = new vscode.Range(firstLine.range.start, lastLine.range.end);
        } else {
            const curSelectionStartPos = new vscode.Position(curSelection.start.line, 0);
            const curSelectionEndPos = new vscode.Position(
                curSelection.end.line,
                curDoc.lineAt(curSelection.end.line).range.end.character
            );
            range = new vscode.Range(curSelectionStartPos, curSelectionEndPos);
        }

        const text = curDoc.getText(range);
        const items = text.split(LINE_SEPARATOR).filter(l => l).map(l => new TodoItem(l));
        const sortedItems = items.sort(compareFn);
        const sortedText = sortedItems.join(LINE_SEPARATOR);

        curEditor.edit(editBuilder => {
            editBuilder.replace(range, sortedText);
        });
    }
}

export function sortByPriority() {
    sort((a: TodoItem, b: TodoItem) => {
        // Add 'ZZ' to put items without priority at the end after sorting
        const priorityA = a.priority ?? 'ZZ';
        const priorityB = b.priority ?? 'ZZ';
        return priorityA.localeCompare(priorityB);
    });
}
