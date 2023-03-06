import * as vscode from 'vscode';
import { decorate } from './decorations';
import * as editor from './editor';
import * as settings from './settings';
import { TodoItemPriority, TodoItem } from './types';


const TODO_ITEM_BULLET = '[ ]';
const TODO_ITEM_BULLET_DONE_1 = '[X]';
const TODO_ITEM_BULLET_DONE_2 = '[x]';

const mdListRe = new RegExp('(\\d+\\.|-|\\*|\\+)\\s+');
const todoItemBulletRe = new RegExp('\\[(x|X|\\s)\\]');
const todoItemPriorityRe = new RegExp('\\([A-Z]\\)');
const dateSepRe = new RegExp('(-|/|.)');
const dateRe = new RegExp(
    `(\\d{2}${dateSepRe.source}\\d{2}${dateSepRe.source}\\d{4}`
    + `|\\d{4}${dateSepRe.source}\\d{2}${dateSepRe.source}\\d{2})`
);
const startDateRe = new RegExp(`s:${dateRe.source}`);
const endDateRe = new RegExp(`e:${dateRe.source}`);
const todoItemRe = new RegExp(
    `^(?<prefix>\\s*(${mdListRe.source})?)?(?<bullet>${todoItemBulletRe.source}\\s+)?`
    + `(?<priority>${todoItemPriorityRe.source}\\s+)?(?<end>${endDateRe.source}\\s+)?`
    + `(?<start>${startDateRe.source}\\s+)?(?<description>.*)`
);


export function strToTodoItem(str: string) {
    const reApplyResult = str.match(todoItemRe);
    const parsedGroups = reApplyResult?.groups;
    if (!parsedGroups) {
        return null;
    }

    const item: TodoItem = {
        prefix: parsedGroups.prefix,
        bullet: null,
        priority: parsedGroups.priority?.trimEnd()?.slice(1, -1) as TodoItemPriority,
        endDate: parsedGroups.endDate?.trimEnd()?.slice(2),
        startDate: parsedGroups.startDate?.trimEnd()?.slice(2),
        description: parsedGroups.description?.trimEnd(),
        projects: [],
        contexts: [],
        dueDate: null,
    };

    const bullet = parsedGroups.bullet?.trimEnd();
    if (bullet) {
        const doneRe = new RegExp(`(${TODO_ITEM_BULLET_DONE_1}|${TODO_ITEM_BULLET_DONE_2})`);
        if (doneRe.test(bullet)) {
            item.bullet = true;
        }
        const notDoneRe = new RegExp(`${TODO_ITEM_BULLET}`);
        if (notDoneRe.test(bullet)) {
            item.bullet = false;
        }
    }

    const splittedDescription = item.description?.split(' ') ?? [];
    for (const word of splittedDescription) {
        if (word.startsWith('+')) {
            item.projects.push(word.slice(1));
        }
        if (word.startsWith('@')) {
            item.contexts.push(word.slice(1));
        }
        if (word.startsWith('d:')) {
            item.dueDate = word.slice(2);
        }
    }

    return item;
}

function todoItemToStr(item: TodoItem) {
    const prefix = item.prefix ?? '';

    let bullet;
    if (item.bullet === null) {
        bullet = '';
    } else if (item.bullet) {
        bullet = `${TODO_ITEM_BULLET_DONE_1} `;
    } else {
        bullet = `${TODO_ITEM_BULLET} `;
    }

    const priority = !item.priority ? '' : `(${item.priority}) `;
    const endDate = !item.endDate ? '' : `e:${item.endDate} `;
    const startDate = !item.startDate ? '' : `s:${item.startDate} `;

    return `${prefix}${bullet}${priority}${endDate}${startDate}${item.description}`;
}

export function convertToTodoItem(line: vscode.TextLine) {
    const item = strToTodoItem(line.text);
    if (item && item.bullet === null) {
        item.bullet = false;

        const defaultPriority = settings.defaultPriority();
        if (defaultPriority !== 'off') {
            item.priority = defaultPriority;
        }

        editor.replaceLine(line, todoItemToStr(item));
    }
}

export function toggleTodoItem(line: vscode.TextLine) {
    const lineText = line.text;
    const item = strToTodoItem(lineText);
    if (item) {
        if (item.bullet === true || item.bullet === null) {
            item.bullet = false;
        } else if (item.bullet === false) {
            item.bullet = true;
        }

        const promise = editor.replaceLine(line, todoItemToStr(item));
        if (promise && settings.isDecorateTodoItems()) {
            promise.then(() => { decorate(); });
        }
    }
}
