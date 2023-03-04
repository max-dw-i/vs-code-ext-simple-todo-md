export const TODO_ITEM_BULLET = '- [ ]';

export const TODO_ITEM_BULLET_DONE_1 = '- [x]';
export const TODO_ITEM_BULLET_DONE_2 = '- [X]';
export const possibleTodoItemBulletDone = [
    TODO_ITEM_BULLET_DONE_1,
    TODO_ITEM_BULLET_DONE_2,
];

export const todoItemBulletRegex = new RegExp('^\\s*-\\s\\[(\\s|x|X)?\\]');
