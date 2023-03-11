# simple-todo-md

An extension for Visual Studio Code that manages TODO lists written in Markdown. The format is based on the todo.txt format.

## Features

- Supported date formats: 'dd-mm-yyyy', 'mm-dd-yyyy', 'yyyy-mm-dd'.

- The priority, item 'start' date, item 'done' date can be added automatically.

- Sorting by priority or due date (quite rudimental, for example, does not sort 'nested' items properly).

- Editor decorations: a TODO item marked as done can have the ~~strike-through~~ style.

## Extension Settings

|             Setting              |                 Description                   | Default value |
|----------------------------------|-----------------------------------------------|---------------|
| simple-todo-md.decorateTodoItems | Renders additional decorations in the editor (for example, sets the 'line-through' style for 'Done' items) | true |
| simple-todo-md.defaultPriority   | Adds a priority when converts a line to a TODO item | 'Z'
| simple-todo-md.dateFormat        | Date format | 'dd-mm-yyyy'
| simple-todo-md.autoStartDate     | Adds the start date automatically when a TODO item is created | true
| simple-todo-md.autoEndDate | Adds the end date automatically when a TODO item is marked as done | true
