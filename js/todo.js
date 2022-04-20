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
        this.isCompleted = false;
        this.project = project;
    }
    complete() {
        this.isCompleted = !this.isCompleted;
    }
}

export let toDoItems = []; // this will become localStorage
