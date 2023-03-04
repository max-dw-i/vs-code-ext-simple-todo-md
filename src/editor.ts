import * as vscode from 'vscode';
import * as consts from './consts';
import * as utils from './utils';


export function getCurrentLine() {
    const { editor, doc } = utils.getCurrentEditorAndDocument();
    if (editor && doc) {
        const curPos = editor.selection.active;
        return doc.lineAt(curPos.line);
    }
}

export function replaceLine(line: vscode.TextLine, replaceWith: string) {
    const { editor, doc } = utils.getCurrentEditorAndDocument();
    if (editor && doc) {
        const lineRange = line.range;
        const lineSelection = new vscode.Selection(lineRange.start, lineRange.end);
        editor.edit(editBuilder => {
            editBuilder.replace(lineSelection, replaceWith);
        });
    }
}

export function insertTodoItemBullet(line: vscode.TextLine) {
    const lineText = line.text;
    if (!consts.todoItemBulletRegex.test(lineText)) {
        const firstNonWhChInd = line.firstNonWhitespaceCharacterIndex;
        const whitespaces = lineText.slice(0, firstNonWhChInd);
        const meaningfulText = lineText.slice(firstNonWhChInd, lineText.length);
        replaceLine(line, `${whitespaces}${consts.TODO_ITEM_BULLET} ${meaningfulText}`);
    }
}
