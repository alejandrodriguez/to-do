import { Task, tasks } from "./task.js";
import { Storage } from "./storage.js";

export class UI {
    static addTask(e) {
        e.preventDefault();
        const title = document.querySelector("#title").value;
        if (!title) {
            return;
        }
        const details = document.querySelector("#details")
            ? document.querySelector("#details").value
            : null;
        const dueDate = document.querySelector("#dueDate")
            ? document.querySelector("#dueDate").value
            : null;
        const priority = document.querySelector("#priority")
            ? document.querySelector("#priority").value
            : null;
        const project = document.querySelector("#new-project")
            ? document.querySelector("#new-project").value
            : null;
        if (project) {
            Storage.addProject(project);
        }
        Storage.addTask(new Task(title, details, dueDate, priority, project));
        UI.displayTasks();
        UI.displayProjectOptions();
    }
    static collapseForm() {
        const form = document.querySelector("form");
        const formComponents = document.querySelectorAll("form *");
        formComponents.forEach(item => {
            if (!item.classList.contains("required")) {
                item.remove();
            }
        });
        const expand = document.createElement("img");
        expand.setAttribute("src", "../img/icons/menu-down.svg");
        expand.id = "expand-form";
        expand.className = "expand-collapse";
        expand.addEventListener("click", UI.expandForm);
        form.append(expand);
    }
    static collapseTask(e) {
        const grandparent = e.target.parentElement.parentElement;
        e.target.parentElement.remove();
        const expand = document.createElement("img");
        expand.setAttribute("src", "../img/icons/menu-down.svg");
        expand.classList.add("expand-collapse", "expand-task");
        grandparent.append(expand);
    }
    static completeTask(e) {
        let index = parseInt(
            e.target.parentElement.parentElement.dataset.taskIndex,
            10
        );
        Storage.completeTask(index);
        UI.displayTasks();
    }
    static changeDescription() {
        // TODO
    }
    static changeDueDate() {
        // TODO
    }

    static changePriority() {
        // TODO
    }
    static changeProject() {
        // TODO
    }
    static changeTitle() {
        // TODO
    }
    static checkForTarget(e) {
        if (e.target.classList.contains("delete-btn")) {
            UI.removeTask(
                parseInt(
                    e.target.parentElement.parentElement.dataset.taskIndex
                ),
                10
            );
        } else if (e.target.classList.contains("complete-btn")) {
            UI.completeTask(e);
        } else if (e.target.classList.contains("expand-task")) {
            UI.expandTask(e);
        } else if (e.target.classList.contains("collapse-task")) {
            UI.collapseTask(e);
        }
    }
    static deleteProject() {
        const project = document.querySelector("#select-project").value;
        if (!project) {
            return;
        }
        // Delete project from projects in storage
        const projects = Storage.getProjects();
        for (let i = 0; i < projects.length; i++) {
            if (projects[i] === project) {
                Storage.removeProject(i);
            }
        }
        // Update DOM
        UI.displayProjectOptions();
        UI.displayTasks();
        // Alert the user of the deletion
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-success", "text-center");
        alert.textContent = `Your project "${project}" has been successfully deleted.`;
        document.body.insertBefore(
            alert,
            document.querySelector(".project-div")
        );
        setTimeout(() => alert.remove(), 3000);
    }
    static deleteProjectBtnControl() {
        const deleteBtn = document.querySelector("#delete-project");
        if (deleteBtn.previousElementSibling.value === "") {
            deleteBtn.setAttribute("disabled", true);
            deleteBtn.style.display = "none";
        } else {
            deleteBtn.removeAttribute("disabled");
            deleteBtn.style.display = "";
        }
    }
    static displayProjectOptions() {
        const projectList = document.querySelector("#select-project");
        while (projectList.childElementCount > 1) {
            projectList.removeChild(projectList.lastChild);
        }
        const projects = Storage.getProjects();
        for (let project of projects) {
            const option = document.createElement("option");
            option.textContent = project;
            option.value = project;
            projectList.append(option);
        }
        UI.deleteProjectBtnControl();
    }
    static displayTasks() {
        const project = document.querySelector("#select-project").value;
        const taskList = document.querySelector("#tasklist");
        while (taskList.lastChild) {
            taskList.removeChild(taskList.lastChild);
        }
        const tasks = Storage.getTasks();
        // Remove Tasks not part of project to be displayed
        if (project !== "") {
            for (let i = tasks.length - 1; i >= 0; i--) {
                console.log(tasks.isCompleted);
                if (tasks[i].project !== project) {
                    tasks.splice(i, 1);
                }
            }
        }
        // Display completed tasks at bottom of list
        for (let i = tasks.length - 1; i >= 0; i--) {
            if (tasks[i].isCompleted) {
                tasks.push(tasks[i]);
                tasks.splice(i, 1);
            }
        }
        for (let task of tasks) {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task", "card", "container", "mb-3");
            // Extra class for tasks with priorities
            if (task.priority) {
                switch (task.priority) {
                    case "low":
                        taskDiv.classList.add("border", "border-success");
                        break;
                    case "medium":
                        taskDiv.classList.add("border", "border-warning");
                        break;
                    case "high":
                        taskDiv.classList.add("border", "border-danger");
                        break;
                }
            }
            // Extra Class for tasks that are completed
            if (task.isCompleted) {
                taskDiv.classList.add("completed");
            }
            const taskBody = document.createElement("div");
            taskBody.classList.add("card-body", "card-body-flex");
            const taskText = document.createElement("h5");
            taskText.textContent = task.title;
            // Complete Button
            const completeBtn = document.createElement("button");
            completeBtn.innerHTML = "&#10003;";
            completeBtn.classList.add("complete-btn", "btn", "btn-success");
            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "&#120;";
            deleteBtn.classList.add("delete-btn", "btn", "btn-danger");
            // Expand Button
            const expand = document.createElement("img");
            expand.setAttribute("src", "../img/icons/menu-down.svg");
            expand.classList.add("expand-collapse", "expand-task");
            // Link DOM Element with Task in Storage
            taskDiv.dataset.taskIndex = task.index;
            // Add elements to page
            taskBody.append(taskText, completeBtn, deleteBtn);
            taskDiv.append(taskBody);
            taskDiv.append(expand);
            taskList.append(taskDiv);
        }
    }
    static expandForm() {
        // Delete Expand Button
        document.querySelector("#expand-form").remove();
        // Details Input
        const details = document.createElement("input");
        details.name = "details";
        details.id = "details";
        details.placeholder = "Details";
        details.classList.add("form-control", "mb-3");
        // Due Date Wrapper
        const dueDateWrapper = document.createElement("div");
        dueDateWrapper.classList.add("mb-3");
        // Due Date Label
        const dueDateLabel = document.createElement("label");
        dueDateLabel.setAttribute("for", "dueDate");
        dueDateLabel.textContent = "Due Date:";
        dueDateWrapper.append(dueDateLabel);
        // Due Date Input
        const dueDate = document.createElement("input");
        dueDate.type = "date";
        dueDate.name = "dueDate";
        dueDate.id = "dueDate";
        dueDateWrapper.append(dueDate);
        //Priority
        const priority = document.createElement("select");
        priority.name = "priority";
        priority.id = "priority";
        priority.classList.add("form-select", "mb-3");
        priority.innerHTML = `<option value="" selected>Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>`;
        // Project Input
        const projectWrapper = document.createElement("div");
        const projects = document.createElement("select");
        projects.classList.add("form-select", "mb-3");
        projects.id = "project-drop-down";
        const createNew = document.createElement("option");
        createNew.textContent = "New Project";
        createNew.value = "";
        projects.append(createNew);
        if (Storage.getProjects() !== []) {
            for (let project of Storage.getProjects()) {
                let existingProject = document.createElement("option");
                existingProject.value = project;
                existingProject.textContent = project;
                projects.append(existingProject);
            }
        }
        const newProject = document.createElement("input");
        newProject.name = "new-project";
        newProject.id = "new-project";
        newProject.placeholder = "Project Name";
        newProject.maxLength = "30";
        newProject.classList.add("form-control", "mb-3");
        projects.addEventListener("change", () => {
            if (projects.value) {
                newProject.style.display = "none";
                newProject.value = "";
            } else {
                newProject.style.display = "block";
            }
        });
        projectWrapper.append(projects, newProject);
        // Collapse Button
        const collapse = document.createElement("img");
        collapse.setAttribute("src", "../img/icons/menu-up.svg");
        collapse.id = "collapse-form";
        collapse.className = "expand-collapse";
        collapse.addEventListener("click", UI.collapseForm);
        // Add to Form
        const form = document.querySelector("form");
        form.append(
            details,
            dueDateWrapper,
            priority,
            projectWrapper,
            collapse
        );
    }
    static expandTask(e) {
        // TODO: All edit buttons
        let tasks = Storage.getTasks();
        let task =
            tasks[parseInt(e.target.parentElement.dataset.taskIndex, 10)];
        const card = e.target.parentElement;
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        e.target.remove();
        // Details
        const detailsWrapper = document.createElement("div");
        detailsWrapper.classList.add("editable");
        const detailsText = document.createElement("p");
        detailsText.classList.add("card-text");
        detailsText.textContent = task.details
            ? task.details
            : "No extra details.";
        const detailsEdit = document.createElement("a");
        detailsEdit.textContent = "Edit";
        detailsEdit.href = "#";
        detailsWrapper.append(detailsText, detailsEdit);
        // Due Date
        const dueDateWrapper = document.createElement("div");
        dueDateWrapper.classList.add("editable");
        const dueDateText = document.createElement("p");
        dueDateText.classList.add("card-text");
        dueDateText.textContent = task.dueDate
            ? `Due: ${task.dueDate}`
            : "No due date.";
        const dueDateEdit = document.createElement("a");
        dueDateEdit.textContent = "Edit";
        dueDateEdit.href = "#";
        dueDateWrapper.append(dueDateText, dueDateEdit);
        // Priority
        const priorityWrapper = document.createElement("div");
        priorityWrapper.classList.add("editable");
        const priorityText = document.createElement("p");
        priorityText.textContent = task.priority
            ? task.priority[0].toUpperCase() +
              task.priority.slice(1) +
              " priority."
            : "No priority set.";
        const priorityEdit = document.createElement("a");
        priorityEdit.textContent = "Edit";
        priorityEdit.href = "#";
        priorityWrapper.append(priorityText, priorityEdit);
        // Project
        const projectWrapper = document.createElement("div");
        projectWrapper.classList.add("editable");
        const projectText = document.createElement("p");
        projectText.textContent = task.project
            ? "Project: " + task.project
            : "Not part of a project.";
        const projectEdit = document.createElement("a");
        projectEdit.textContent = "Edit";
        projectEdit.href = "#";
        projectWrapper.append(projectText, projectEdit);
        // Collapse Task
        const collapse = document.createElement("img");
        collapse.setAttribute("src", "../img/icons/menu-up.svg");
        collapse.classList.add("expand-collapse", "collapse-task");
        // Add to DOM
        cardBody.append(
            detailsWrapper,
            dueDateWrapper,
            priorityWrapper,
            projectWrapper,
            collapse
        );
        card.append(cardBody);
    }
    static removeTask(index) {
        const taskDivs = document.querySelectorAll(".task");
        const title = Storage.getTasks()[index].title;
        for (let task of taskDivs) {
            if (parseInt(task.dataset.taskIndex, 10) === index) {
                task.remove();
            }
        }
        Storage.removeTask(index);
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-success", "text-center");
        alert.textContent = `Your task "${title}" has been successfully deleted.`;
        UI.displayTasks();
        document.body.insertBefore(
            alert,
            document.querySelector(".project-div")
        );
        setTimeout(() => alert.remove(), 3000);
    }
}

document.addEventListener("DOMContentLoaded", UI.displayTasks);
document.addEventListener("DOMContentLoaded", UI.displayProjectOptions);
document.addEventListener("DOMContentLoaded", UI.deleteProjectBtnControl);
document.querySelector("#addbtn").addEventListener("click", UI.addTask);
document
    .querySelector("#tasklist")
    .addEventListener("click", UI.checkForTarget);
document.querySelector("#expand-form").addEventListener("click", UI.expandForm);
document
    .querySelector("#select-project")
    .addEventListener("change", e => UI.displayTasks(e.target.value));
document
    .querySelector("#select-project")
    .addEventListener("change", UI.deleteProjectBtnControl);
document
    .querySelector("#delete-project")
    .addEventListener("click", UI.deleteProject);
// TODO: Edits
// TODO: Alert after deletion of project
