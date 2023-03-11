import * as vscode from 'vscode';
import * as settings from './settings';
import { FormattedDateI } from './types';


function settingsDateFormatDetails() {
    const dateFormat = settings.dateFormat();
    let re, cls;
    switch (dateFormat) {
        case 'dd-mm-yyyy':
            re = /(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})/;
            cls = DMY;
            break;
        case 'mm-dd-yyyy':
            re = /(?<month>\d{2})-(?<day>\d{2})-(?<year>\d{4})/;
            cls = MDY;
            break;
        case 'yyyy-mm-dd':
            re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
            cls = YMD;
            break;
        default:
            throw new Error(`Format '${dateFormat} is not implemented`);
    }
    return { format: dateFormat, re: re, cls: cls };
}


export function strToFormattedDate(str: string): FormattedDate | null {
    const { format, re, cls } = settingsDateFormatDetails();
    const matchRes = str.match(re);
    const day = matchRes?.groups?.day;
    const month = matchRes?.groups?.month;
    const year = matchRes?.groups?.year;
    if (day && month && year) {
        return new cls(year, month, day);
    }
    vscode.window.showInformationMessage(
        `Date '${str}' and format '${format}' from 'settings.json' are incompatible`
    );
    return null;
}


export function currentFormattedDate() {
    const { cls } = settingsDateFormatDetails();
    const curDate = new Date().toISOString();
    const year = curDate.slice(0, 4);
    const month = curDate.slice(5, 7);
    const day = curDate.slice(8, 10);
    return new cls(year, month, day);
}


export class FormattedDate implements FormattedDateI {
    day: string;
    month: string;
    year: string;

    constructor(year: string, month: string, day: string) {
        this.day = day;
        this.month = month;
        this.year = year;
    }

    public date() {
        if (!(this.day && this.month && this.year)) {
            return null;
        }
        return new Date(Number(this.year), Number(this.month) - 1, Number(this.day));
    }

    public toString() {
        return '';
    }
}


export class DMY extends FormattedDate {
    public toString() {
        return `${this.day}-${this.month}-${this.year}`;
    }
}


export class MDY extends FormattedDate {
    public toString() {
        return `${this.month}-${this.day}-${this.year}`;
    }
}


export class YMD extends FormattedDate {
    public toString() {
        return `${this.year}-${this.month}-${this.day}`;
    }
}
