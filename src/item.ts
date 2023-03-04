import * as vscode from 'vscode';
import * as editor from './editor';


const TODO_ITEM_BULLET = '- [ ]';
const TODO_ITEM_BULLET_DONE = '- [X]';

const todoItemRegex = new RegExp('^\\s*-\\s\\[(\\s|x|X)?\\]');

const todoItemBulletDoneRegex = new RegExp('-\\s\\[(x|X)\\]');
const todoItemDoneRegex = new RegExp(`^\\s*${todoItemBulletDoneRegex.source}`);

const todoItemBulletNotDoneRegex = new RegExp('-\\s\\[\\s\\]');
const todoItemNotDoneRegex = new RegExp(`^\\s*${todoItemBulletNotDoneRegex.source}`);


export function isTodoItem(line: vscode.TextLine) {
    const lineText = line.text;
    return todoItemRegex.test(lineText);
}

export function insertTodoItemBullet(line: vscode.TextLine) {
    const lineText = line.text;
    if (!todoItemRegex.test(lineText)) {
        const firstNonWhChInd = line.firstNonWhitespaceCharacterIndex;
        const whitespaces = lineText.slice(0, firstNonWhChInd);
        const meaningfulText = lineText.slice(firstNonWhChInd, lineText.length);
        editor.replaceLine(line, `${whitespaces}${TODO_ITEM_BULLET} ${meaningfulText}`);
    }
}

export function toggleTodoItem(line: vscode.TextLine) {
    const lineText = line.text;
    if (todoItemDoneRegex.test(lineText)) {
        editor.replaceLine(line, lineText.replace(
            todoItemBulletDoneRegex,
            TODO_ITEM_BULLET
        ));
    } else if (todoItemNotDoneRegex.test(lineText)) {
        editor.replaceLine(line, lineText.replace(
            todoItemBulletNotDoneRegex,
            TODO_ITEM_BULLET_DONE
        ));
    }
}
