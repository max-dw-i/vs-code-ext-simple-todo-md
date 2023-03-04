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
    if (!consts.todoItemRegex.test(lineText)) {
        const firstNonWhChInd = line.firstNonWhitespaceCharacterIndex;
        const whitespaces = lineText.slice(0, firstNonWhChInd);
        const meaningfulText = lineText.slice(firstNonWhChInd, lineText.length);
        replaceLine(line, `${whitespaces}${consts.TODO_ITEM_BULLET} ${meaningfulText}`);
    }
}

export function toggleTodoItem(line: vscode.TextLine) {
    const lineText = line.text;
    if (consts.todoItemDoneRegex.test(lineText)) {
        replaceLine(line, lineText.replace(
            consts.todoItemBulletDoneRegex,
            consts.TODO_ITEM_BULLET
        ));
    } else if (consts.todoItemNotDoneRegex.test(lineText)) {
        replaceLine(line, lineText.replace(
            consts.todoItemBulletNotDoneRegex,
            consts.TODO_ITEM_BULLET_DONE
        ));
    }
}
