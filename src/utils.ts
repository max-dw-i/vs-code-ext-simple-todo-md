import * as vscode from 'vscode';


export function getCurrentEditorAndDocument() {
    const editor = vscode.window.activeTextEditor;
    return {
        editor: editor,
        doc: editor?.document
    };
}
