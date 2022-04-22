import { Task, tasks } from "./todo.js";
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
        assignToDoIndex();
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
        e.target.parentElement.parentElement.classList.toggle("completed");
        let tasks = Storage.getTasks();
        tasks[
            parseInt(e.target.parentElement.parentElement.dataset.toDoIndex, 10)
        ].complete();
    }
    static changeTitle() {
        // TODO
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
    static removeTask(index) {
        Storage.removeTask(index);
        const taskDivs = document.querySelectorAll(".task");
        for (let task of taskDivs) {
            if (parseInt(task.dataset.toDoIndex, 10) === index) {
                task.remove();
            }
        }
        assignToDoIndex();
    }
    static displayTasks() {
        const taskList = document.querySelector("#tasklist");
        while (taskList.lastChild) {
            taskList.removeChild(taskList.lastChild);
        }
        let tasks = Storage.getTasks();
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
            taskDiv.style.width = "33vw";
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
        priority.innerHTML = `<option value="none" selected>Priority</option>
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
            tasks[parseInt(e.target.parentElement.dataset.toDoIndex, 10)];
        const card = e.target.parentElement;
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        e.target.remove();
        // Details
        const detailsWrapper = document.createElement("div");
        detailsWrapper.classList.add("editable"); // TODO: Make Class
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
        // TODO: Project
        // Collapse Task
        const collapse = document.createElement("img");
        collapse.setAttribute("src", "../img/icons/menu-up.svg");
        collapse.classList.add("expand-collapse", "collapse-task");
        // Add to DOM
        cardBody.append(
            detailsWrapper,
            dueDateWrapper,
            priorityWrapper,
            collapse
        );
        card.append(cardBody);
    }
}

function checkForTarget(e) {
    if (e.target.classList.contains("delete-btn")) {
        UI.removeTask(
            parseInt(e.target.parentElement.parentElement.dataset.toDoIndex),
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

function assignToDoIndex() {
    const taskDivs = document.querySelectorAll(".task");
    taskDivs.forEach((task, index) =>
        task.setAttribute("data-to-do-index", index)
    );
}
document.addEventListener("DOMContentLoaded", UI.displayTasks);
document.querySelector("#addbtn").addEventListener("click", UI.addTask);
document.querySelector("#tasklist").addEventListener("click", checkForTarget);
document.querySelector("#expand-form").addEventListener("click", UI.expandForm);
