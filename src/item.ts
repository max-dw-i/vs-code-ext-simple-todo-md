import * as settings from './settings';
import { TodoItemPriorityT, TodoItemI } from './types';


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


export class TodoItem implements TodoItemI {
    prefix: string | null;
    bullet: boolean | null;
    priority: TodoItemPriorityT | null;
    endDate: string | null;
    startDate: string | null;
    description: string | null;
    projects: string[];
    contexts: string[];
    dueDate: string | null;

    private line: string;
    private isParsed: boolean;

    constructor(line: string) {
        this.prefix = null;
        this.bullet = null;
        this.priority = null;
        this.endDate = null;
        this.startDate = null;
        this.description = null;
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
        this.prefix = groups.prefix;
        this.priority = groups.priority?.trimEnd()?.slice(1, -1) as TodoItemPriorityT;
        this.endDate = groups.end?.trimEnd()?.slice(2);
        this.startDate = groups.start?.trimEnd()?.slice(2);
        this.description = groups.description?.trimEnd();

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
                this.dueDate = word.slice(2);
            }
        }
    }

    public toString() {
        if (!this.isParsed) {
            return this.line;
        }

        const prefix = this.prefix ?? '';

        let bullet;
        if (this.bullet === null) {
            bullet = '';
        } else if (this.bullet) {
            bullet = `${TODO_ITEM_BULLET_DONE_1} `;
        } else {
            bullet = `${TODO_ITEM_BULLET} `;
        }

        const priority = !this.priority ? '' : `(${this.priority}) `;
        const endDate = !this.endDate ? '' : `e:${this.endDate} `;
        const startDate = !this.startDate ? '' : `s:${this.startDate} `;

        return `${prefix}${bullet}${priority}${endDate}${startDate}${this.description}`;
    }

    private currentDate() {
        const curDate = new Date().toISOString();
        const year = curDate.slice(0, 4);
        const month = curDate.slice(5, 7);
        const day = curDate.slice(8, 10);
        let formattedDate;
        switch (settings.dateFormat()) {
            case "dd-mm-yyyy":
                formattedDate = `${day}-${month}-${year}`;
                break;
            case "mm-dd-yyyy":
                formattedDate = `${month}-${day}-${year}`;
                break;
            case "yyyy-mm-dd":
                formattedDate = `${year}-${month}-${day}`;
                break;
            case "dd.mm.yyyy":
                formattedDate = `${day}.${month}.${year}`;
                break;
            case "mm.dd.yyyy":
                formattedDate = `${month}.${day}.${year}`;
                break;
            case "yyyy.mm.dd":
                formattedDate = `${year}.${month}.${day}`;
                break;
            case "dd/mm/yyyy":
                formattedDate = `${day}/${month}/${year}`;
                break;
            case "mm/dd/yyyy":
                formattedDate = `${month}/${day}/${year}`;
                break;
            case "yyyy/mm/dd":
                formattedDate = `${year}/${month}/${day}`;
                break;
            default:
                formattedDate = `${day}-${month}-${year}`;
                break;
        }
        return formattedDate;
    }

    public addStartDate() {
        if (this.isParsed) {
            this.startDate = this.currentDate();
        }
    }

    public convert() {
        if (this.isParsed && this.bullet === null) {
            this.bullet = false;

            const defaultPriority = settings.defaultPriority();
            if (defaultPriority !== 'off') {
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
            } else {
                this.bullet = true;
            }
        }
    }

}
