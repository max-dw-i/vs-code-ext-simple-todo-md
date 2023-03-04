import * as vscode from 'vscode';
import { decorate } from './decorations';
import * as editor from './editor';
import * as settings from './settings';


const TODO_ITEM_BULLET = '- [ ]';
const TODO_ITEM_BULLET_DONE = '- [X]';

const todoItemRegex = new RegExp('^\\s*-\\s\\[(\\s|x|X)?\\]');

const todoItemBulletDoneRegex = new RegExp('-\\s\\[(x|X)\\]');
const todoItemDoneRegex = new RegExp(`^\\s*${todoItemBulletDoneRegex.source}`);

const todoItemBulletNotDoneRegex = new RegExp('-\\s\\[\\s\\]');
const todoItemNotDoneRegex = new RegExp(`^\\s*${todoItemBulletNotDoneRegex.source}`);


export function isTodoItem(line: vscode.TextLine) {
    return todoItemRegex.test(line.text);
}

export function isDoneTodoItem(line: vscode.TextLine) {
    return todoItemDoneRegex.test(line.text);
}

export function isNotDoneTodoItem(line: vscode.TextLine) {
    return todoItemNotDoneRegex.test(line.text);
}

export function insertTodoItemBullet(line: vscode.TextLine) {
    if (!isTodoItem(line)) {
        const lineText = line.text;
        const firstNonWhChInd = line.firstNonWhitespaceCharacterIndex;
        const whitespaces = lineText.slice(0, firstNonWhChInd);
        const meaningfulText = lineText.slice(firstNonWhChInd, lineText.length);
        editor.replaceLine(line, `${whitespaces}${TODO_ITEM_BULLET} ${meaningfulText}`);
    }
}

export function toggleTodoItem(line: vscode.TextLine) {
    const lineText = line.text;
    let promise;
    if (isDoneTodoItem(line)) {
        promise = editor.replaceLine(line, lineText.replace(
            todoItemBulletDoneRegex,
            TODO_ITEM_BULLET
        ));
    } else if (isNotDoneTodoItem(line)) {
        promise = editor.replaceLine(line, lineText.replace(
            todoItemBulletNotDoneRegex,
            TODO_ITEM_BULLET_DONE
        ));
    }

    if (promise && settings.isDecorateTodoItems()) {
        promise.then(() => { decorate(); });
    }
}
