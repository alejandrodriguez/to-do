export class Task {
    constructor(
        title,
        details = null,
        dueDate = null,
        priority = null,
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
}

export let tasks = []; // this will become localStorage
