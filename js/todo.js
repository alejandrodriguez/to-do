export class toDoItem {
    constructor(
        title,
        details = null,
        dueDate = null,
        priority,
        project = null
    ) {
        this.title = title;
        this.details = details;
        this.dueDate = dueDate;
        this.priority = priority;
        this._isCompleted = false;
        this.project = project;
    }
    complete() {
        this._isCompleted = !this._isCompleted;
    }
}

export let toDoItems = []; // this will become localStorage
