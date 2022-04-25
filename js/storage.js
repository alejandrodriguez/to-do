import { Task } from "./task.js";

export class Storage {
    static getTasks() {
        let tasks = [];
        if (localStorage.getItem("tasks")) {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }
        return tasks;
    }
    static addTask(task) {
        let tasks = Storage.getTasks();
        task.index = tasks.length;
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    static removeTask(index) {
        let tasks = Storage.getTasks();
        tasks.splice(index, 1);
        tasks.forEach((task, index) => (task.index = index));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    static editTask(index, property, newValue) {
        let tasks = Storage.getTasks();
        tasks[index][property] = newValue;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    static completeTask(index) {
        let tasks = Storage.getTasks();
        tasks[index].isCompleted = !tasks[index].isCompleted;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    static getProjects() {
        let projects = [];
        if (localStorage.getItem("projects")) {
            projects = JSON.parse(localStorage.getItem("projects"));
        }
        return projects;
    }
    static addProject(project) {
        let projects = Storage.getProjects();
        if (!projects.includes(project)) {
            projects.push(project);
            localStorage.setItem("projects", JSON.stringify(projects));
        }
    }
    static removeProject(index) {
        let projects = Storage.getProjects();
        const projectName = projects[index];
        projects.splice(index, 1);
        localStorage.setItem("projects", JSON.stringify(projects));
        let tasks = Storage.getTasks();
        for (let task of tasks) {
            if (task.project === projectName) {
                task.project = null;
            }
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}
