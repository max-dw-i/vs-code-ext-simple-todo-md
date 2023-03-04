import * as vscode from 'vscode';
import * as item from './item';
import * as utils from './utils';


const linethroughDecorationType = vscode.window.createTextEditorDecorationType({
    textDecoration: 'line-through',
    color: new vscode.ThemeColor('disabledForeground')
});

export function decorate() {
    const { editor, doc } = utils.getCurrentEditorAndDocument();
    if (editor && doc) {
        const decorationRanges = [];
        for (let i = 0; i < doc.lineCount; i++) {
            const line = doc.lineAt(i);
            if (item.isDoneTodoItem(line)) {
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
