import { Task } from "./todo.js";

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
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    static removeTask(index) {
        let tasks = Storage.getTasks();
        tasks.splice(index, 1);
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
        project = project.toLowerCase();
        let projects = Storage.getProjects();
        if (!projects.includes(project)) {
            projects.push(project);
            localStorage.setItem("projects", JSON.stringify(projects));
        }
        // TODO: Reload Project Navbar
    }
    static removeProject(index) {
        let projects = Storage.getProjects();
        projects.splice(index, 1);
        localStorage.setItem("projects", JSON.stringify(projects));
    }
}
