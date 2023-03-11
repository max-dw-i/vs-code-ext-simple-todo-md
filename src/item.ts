import { FormattedDate, currentFormattedDate, strToFormattedDate } from './date';
import * as settings from './settings';
import { TodoItemPriorityT, TodoItemI } from './types';


const TODO_ITEM_BULLET = '[ ]';
const TODO_ITEM_BULLET_DONE_1 = '[X]';
const TODO_ITEM_BULLET_DONE_2 = '[x]';

const mdListRe = new RegExp('(\\d+\\.|-|\\*|\\+)\\s+');
const todoItemBulletRe = new RegExp('\\[(x|X|\\s)\\]');
const todoItemPriorityRe = new RegExp('\\([A-Z]\\)');
const dateRe = new RegExp(`(\\d{2}-\\d{2}-\\d{4}|\\d{4}-\\d{2}-\\d{2})`);
const startDateRe = new RegExp(`s:${dateRe.source}`);
const endDateRe = new RegExp(`e:${dateRe.source}`);
const todoItemRe = new RegExp(
    `^(?<prefix>\\s*(${mdListRe.source})?)?(?<bullet>${todoItemBulletRe.source}\\s+)?`
    + `(?<priority>${todoItemPriorityRe.source}\\s+)?(?<end>${endDateRe.source}\\s+)?`
    + `(?<start>${startDateRe.source}\\s+)?(?<description>.*)`
);


export class TodoItem implements TodoItemI {
    prefix: string;
    bullet: boolean | null;
    priority: TodoItemPriorityT | null;
    endDate: FormattedDate | null;
    startDate: FormattedDate | null;
    description: string;
    projects: string[];
    contexts: string[];
    dueDate: FormattedDate | null;

    private line: string;
    private isParsed: boolean;

    constructor(line: string) {
        this.prefix = '';
        this.bullet = null;
        this.priority = null;
        this.endDate = null;
        this.startDate = null;
        this.description = '';
        this.projects = [];
        this.contexts = [];
        this.dueDate = null;

        this.line = line;
        this.isParsed = false;

        this.parse(line);
    }

    private parse(line: string) {
        const reApplyResult = line.match(todoItemRe);
        const parsedGroups = reApplyResult?.groups;
        if (parsedGroups) {
            this.isParsed = true;
            this.populateProperties(parsedGroups);
        }
    }

    private populateProperties(groups: { [key: string]: string; }) {
        if (groups.prefix) {
            this.prefix = groups.prefix;
        }

        if (groups.priority) {
            this.priority = groups.priority.trimEnd().slice(1, -1) as TodoItemPriorityT;
        }

        if (groups.end) {
            this.endDate = strToFormattedDate(groups.end.trimEnd().slice(2));
        }

        if (groups.start) {
            this.startDate = strToFormattedDate(groups.start.trimEnd().slice(2));
        }

        if (groups.description) {
            this.description = groups.description.trimEnd();
        }

        const bullet = groups.bullet?.trimEnd();
        if (bullet) {
            const doneRe = new RegExp(`(${TODO_ITEM_BULLET_DONE_1}|${TODO_ITEM_BULLET_DONE_2})`);
            if (doneRe.test(bullet)) {
                this.bullet = true;
            }
            const notDoneRe = new RegExp(`${TODO_ITEM_BULLET}`);
            if (notDoneRe.test(bullet)) {
                this.bullet = false;
            }
        }

        const splittedDescription = this.description?.split(' ') ?? [];
        for (const word of splittedDescription) {
            if (word.startsWith('+')) {
                this.projects.push(word.slice(1));
            }
            if (word.startsWith('@')) {
                this.contexts.push(word.slice(1));
            }
            if (word.startsWith('d:')) {
                this.dueDate = strToFormattedDate(word.slice(2));
            }
        }
    }

    public toString() {
        if (!this.isParsed) {
            return this.line;
        }

        let bullet;
        if (this.bullet === null) {
            bullet = '';
        } else if (this.bullet) {
            bullet = `${TODO_ITEM_BULLET_DONE_1} `;
        } else {
            bullet = `${TODO_ITEM_BULLET} `;
        }

        const priority = this.priority ? `(${this.priority}) ` : '';
        const endDate = this.endDate ? `e:${this.endDate} ` : '';
        const startDate = this.startDate ? `s:${this.startDate} ` : '';

        return `${this.prefix}${bullet}${priority}${endDate}${startDate}${this.description}`;
    }

    public addStartDate() {
        if (this.isParsed) {
            this.startDate = currentFormattedDate();
        }
    }

    public addEndDate() {
        if (this.isParsed) {
            this.endDate = currentFormattedDate();
        }
    }

    public convert() {
        if (this.isParsed && this.bullet === null) {
            this.bullet = false;

            const defaultPriority = settings.defaultPriority();
            if (defaultPriority) {
                this.priority = defaultPriority;
            }

            if (settings.isAutoStartDate()) {
                this.addStartDate();
            }
        }
    }

    public toggle() {
        if (this.isParsed) {
            if (this.bullet === null) {
                this.convert();
            } else if (this.bullet) {
                this.bullet = false;
                this.endDate = null;
            } else {
                this.bullet = true;
                this.addEndDate();
            }
        }
    }

}
