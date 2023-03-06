export type TodoItemPriorityT = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K"
    | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

export interface TodoItemI {
    prefix: string | null,
    bullet: boolean | null,
    priority: TodoItemPriorityT | null,
    endDate: string | null,
    startDate: string | null,
    description: string | null,
    projects: string[],
    contexts: string[],
    dueDate: string | null,
}