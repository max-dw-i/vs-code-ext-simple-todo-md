export const TODO_ITEM_BULLET = '- [ ]';
export const TODO_ITEM_BULLET_DONE = '- [X]';

export const todoItemRegex = new RegExp('^\\s*-\\s\\[(\\s|x|X)?\\]');

export const todoItemBulletDoneRegex = new RegExp('-\\s\\[(x|X)\\]');
export const todoItemDoneRegex = new RegExp(`^\\s*${todoItemBulletDoneRegex.source}`);

export const todoItemBulletNotDoneRegex = new RegExp('-\\s\\[\\s\\]');
export const todoItemNotDoneRegex = new RegExp(`^\\s*${todoItemBulletNotDoneRegex.source}`);
