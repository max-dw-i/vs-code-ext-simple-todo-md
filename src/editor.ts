import * as vscode from 'vscode';
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
