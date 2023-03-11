export type TodoItemPriorityT = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K'
    | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
    | '';

export type DateFormatT = 'dd-mm-yyyy' | 'mm-dd-yyyy' | 'yyyy-mm-dd';

export interface TodoItemI {
    prefix: string,
    bullet: boolean | null,
    priority: TodoItemPriorityT,
    endDate: string,
    startDate: string,
    description: string,
    projects: string[],
    contexts: string[],
    dueDate: string,
}
