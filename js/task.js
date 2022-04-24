export class Task {
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
        this.index = null;
    }
    complete() {
        this.isCompleted = !this.isCompleted;
    }
}

export let tasks = []; // this will become localStorage
