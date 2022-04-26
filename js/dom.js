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
        const menuDiv = document.createElement("div");
        menuDiv.classList.add("menu");
        const expandImg = document.createElement("img");
        expandImg.src = "../img/menu-down.svg";
        const expandBtn = document.createElement("button");
        expandBtn.id = "expand-form";
        expandBtn.classList.add("icon", "btn");
        expandBtn.addEventListener("click", UI.expandForm);
        expandBtn.append(expandImg);
        menuDiv.append(document.createElement("div"), expandBtn);
        form.append(menuDiv);
    }
    static collapseTask(e) {
        e.target.parentElement.parentElement.remove();
        const menuDiv = document.createElement("div");
        menuDiv.classList.add("menu");
        menuDiv.append(document.createElement("div"));
        const expandImg = document.createElement("img");
        expandImg.src = "../img/menu-down.svg";
        const expandBtn = document.createElement("button");
        expandBtn.classList.add("icon", "expand-task", "btn");
        expandBtn.append(expandImg);
        menuDiv.append(expandBtn);
        const taskIndex = parseInt(
            e.target.parentElement.dataset.taskIndex,
            10
        );
        menuDiv.dataset.taskIndex = taskIndex;
        document
            .querySelector(`div[data-task-index="${taskIndex}"]`)
            .append(menuDiv);
    }
    static completeTask(e) {
        let index = parseInt(
            e.target.parentElement.parentElement.dataset.taskIndex,
            10
        );
        Storage.completeTask(index);
        UI.displayTasks();
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
        } else if (e.target.classList.contains("edit-btn")) {
            UI.openEditForm(e);
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
        // If add task form is expanded
        let projectForm = null;
        if (document.querySelector("#project-drop-down")) {
            projectForm = document.querySelector("#project-drop-down");
            while (projectForm.childElementCount > 1) {
                projectForm.removeChild(projectForm.lastChild);
            }
        }
        const projects = Storage.getProjects();
        for (let project of projects) {
            const option = document.createElement("option");
            option.textContent = project;
            option.value = project;
            projectList.append(option);
            if (projectForm) {
                const formOption = option.cloneNode(true);
                projectForm.append(formOption);
            }
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
            // Menu Div
            const menuDiv = document.createElement("div");
            menuDiv.classList.add("menu", "btn");
            menuDiv.append(document.createElement("div"));
            // Expand Button
            const expand = document.createElement("img");
            expand.src = "../img/menu-down.svg";
            expand.classList.add("icon", "expand-task");
            menuDiv.append(expand);
            // Link DOM Element and menu with Task in Storage
            taskDiv.dataset.taskIndex = task.index;
            menuDiv.dataset.taskIndex = task.index;
            // Add elements to page
            taskBody.append(taskText, completeBtn, deleteBtn);
            taskDiv.append(taskBody, menuDiv);
            taskList.append(taskDiv);
        }
    }
    static editTask(e) {
        e.preventDefault();
        if (e.target.nodeName === "FORM") {
            e.target.nextElementSibling.children[1].click();
            return;
        }
        const index = e.target.dataset.taskIndex;
        const taskForm = e.target.parentElement.previousElementSibling;
        const details = taskForm.children[0].value
            ? taskForm.children[0].value
            : null;
        console.log(taskForm.children[1].lastChild.value);
        const dueDate = taskForm.children[1].lastChild.value
            ? taskForm.children[1].lastChild.value
            : null;
        const priority = taskForm.children[2].value
            ? taskForm.children[2].value
            : null;
        const project = taskForm.children[3].value
            ? taskForm.children[3].value
            : null;
        Storage.editTask(index, "details", details);
        Storage.editTask(index, "dueDate", dueDate);
        Storage.editTask(index, "priority", priority);
        Storage.editTask(index, "project", project);
        if (project) {
            Storage.addProject(project);
            UI.displayProjectOptions();
        }
        // Get current task info
        const task = Storage.getTasks()[index];
        // Details Element
        const detailsElement = document.createElement("p");
        detailsElement.classList.add("card-text");
        detailsElement.textContent = task.details
            ? task.details
            : "No extra details.";
        // Due Date Element
        const dueDateElement = document.createElement("p");
        dueDateElement.classList.add("card-text");
        dueDateElement.textContent = task.dueDate
            ? `Due: ${task.dueDate}`
            : "No due date.";
        // Priority Element
        const priorityElement = document.createElement("p");
        priorityElement.textContent = task.priority
            ? task.priority[0].toUpperCase() +
              task.priority.slice(1) +
              " priority."
            : "No priority set.";
        // Project Element
        const projectElement = document.createElement("p");
        projectElement.textContent = task.project
            ? "Project: " + task.project
            : "Not part of a project.";
        // Replace form with new data
        const grandparent = e.target.parentElement.parentElement;
        taskForm.remove();
        grandparent.append(
            detailsElement,
            dueDateElement,
            priorityElement,
            projectElement,
            e.target.parentElement
        );
        // Replace submit button with edit button
        const editBtn = document.createElement("button");
        editBtn.classList.add("btn", "icon", "edit-btn");
        const pencil = document.createElement("img");
        pencil.src = "../img/pencil.svg";
        editBtn.dataset.taskIndex = index;
        editBtn.append(pencil);
        e.target.parentElement.insertBefore(editBtn, e.target);
        e.target.remove();
    }
    static expandForm() {
        // Delete Expand Button
        document.querySelector("#expand-form").remove();
        // Details Input
        const details = document.createElement("textarea");
        details.name = "details";
        details.id = "details";
        details.placeholder = "Details";
        details.maxLength = "280";
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
        // Menu Div
        const menuDiv = document.createElement("div");
        menuDiv.classList.add("menu");
        menuDiv.append(document.createElement("div"));
        // Collapse Button
        const collapse = document.createElement("img");
        collapse.src = "../img/menu-up.svg";
        collapse.id = "collapse-form";
        collapse.classList.add("icon", "btn");
        collapse.addEventListener("click", UI.collapseForm);
        menuDiv.append(collapse);
        // Add to Form
        const form = document.querySelector("form");
        form.append(details, dueDateWrapper, priority, projectWrapper, menuDiv);
    }
    static expandTask(e) {
        let tasks = Storage.getTasks();
        let task =
            tasks[parseInt(e.target.parentElement.dataset.taskIndex, 10)];
        const card = e.target.parentElement.parentElement;
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        e.target.parentElement.remove();
        // Details
        const details = document.createElement("p");
        details.classList.add("card-text");
        details.textContent = task.details ? task.details : "No extra details.";
        // Due Date
        const dueDate = document.createElement("p");
        dueDate.classList.add("card-text");
        dueDate.textContent = task.dueDate
            ? `Due: ${task.dueDate}`
            : "No due date.";
        // Priority
        const priority = document.createElement("p");
        priority.textContent = task.priority
            ? task.priority[0].toUpperCase() +
              task.priority.slice(1) +
              " priority."
            : "No priority set.";
        // Project
        const project = document.createElement("p");
        project.textContent = task.project
            ? "Project: " + task.project
            : "Not part of a project.";
        // Menu Div
        const menuDiv = document.createElement("div");
        menuDiv.classList.add("menu");
        menuDiv.append(document.createElement("div"));
        menuDiv.dataset.taskIndex = e.target.parentElement.dataset.taskIndex;
        // Edit Button
        const editBtn = document.createElement("button");
        editBtn.classList.add("btn", "icon", "edit-btn");
        const pencil = document.createElement("img");
        pencil.src = "../img/pencil.svg";
        editBtn.dataset.taskIndex = e.target.parentElement.dataset.taskIndex;
        editBtn.append(pencil);
        // Collapse Task
        const collapse = document.createElement("img");
        collapse.src = "../img/menu-up.svg";
        collapse.classList.add("icon", "collapse-task", "btn");
        // Add to DOM
        menuDiv.append(editBtn, collapse);
        cardBody.append(details, dueDate, priority, project, menuDiv);
        card.append(cardBody);
    }
    static openEditForm(e) {
        const cardBody = e.target.parentElement.parentElement;
        const menu = e.target.parentElement;
        while (cardBody.childElementCount > 1) {
            cardBody.removeChild(cardBody.firstChild);
        }
        const task = Storage.getTasks()[e.target.dataset.taskIndex];
        // Details Input
        const details = document.createElement("textarea");
        details.name = "details";
        details.placeholder = "Details";
        details.value = task.details ? task.details : "";
        details.maxLength = "280";
        details.classList.add("form-control", "mb-3");
        // Due Date Wrapper
        const dueDateWrapper = document.createElement("div");
        dueDateWrapper.classList.add("mb-3");
        // Due Date Label
        const dueDateLabel = document.createElement("label");
        dueDateLabel.textContent = "Due Date:";
        dueDateWrapper.append(dueDateLabel);
        // Due Date Input
        const dueDate = document.createElement("input");
        dueDate.name = "dueDate";
        dueDate.type = "date";
        dueDate.value = task.dueDate ? task.dueDate : "";
        dueDateWrapper.append(dueDate);
        //Priority
        const priority = document.createElement("select");
        priority.name = "priority";
        priority.classList.add("form-select", "mb-3");
        priority.innerHTML = `<option value="" selected>Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>`;
        switch (task.priority) {
            case "low":
                priority.children[1].setAttribute("selected", true);
                break;
            case "medium":
                priority.children[2].setAttribute("selected", true);
                break;
            case "high":
                priority.children[3].setAttribute("selected", true);
                break;
        }
        // Project Input
        const project = document.createElement("input");
        project.name = "project";
        project.classList.add("form-control", "mb-3");
        project.value = task.project ? task.project : "";
        project.placeholder = "Project Name";
        // Change edit button to submit button
        const confirmBtn = document.createElement("button");
        confirmBtn.classList.add("btn", "btn-primary");
        confirmBtn.innerHTML = "&#10003;";
        confirmBtn.dataset.taskIndex = e.target.dataset.taskIndex;
        confirmBtn.addEventListener("click", e => UI.editTask(e));
        // Add to DOM
        const form = document.createElement("form");
        form.addEventListener("submit", e => UI.editTask(e));
        form.append(details, dueDateWrapper, priority, project);
        cardBody.insertBefore(form, menu);
        menu.insertBefore(confirmBtn, e.target);
        e.target.remove();
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
