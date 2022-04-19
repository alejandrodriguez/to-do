import { toDoItem, toDoItems } from "./todo.js";

export const DOMController = {
    addTask(e) {
        e.preventDefault();
        const title = document.querySelector("#title").value;
        if (!title) {
            return;
        }
        const details = document.querySelector("#details")
            ? document.querySelector("#details").value
            : null;
        const dueDate = document.querySelector("#duedate")
            ? document.querySelector("#duedate").value
            : null;
        const priority = document.querySelector("#priority")
            ? document.querySelector("#priority").value
            : null;
        const project = null; // TODO: hardcoded null for now
        toDoItems.push(
            new toDoItem(title, details, dueDate, priority, project)
        );
        DOMController.displayToDo();
        assignToDoIndex();
    },
    collapseForm() {
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
        expand.addEventListener("click", DOMController.expandForm);
        form.append(expand);
    },
    completeTask(e) {
        e.target.parentElement.parentElement.classList.toggle("completed");
        toDoItems[
            parseInt(e.target.parentElement.parentElement.dataset.toDoIndex, 10)
        ].complete();
    },
    changeTitle() {
        // TODO
    },
    changeDescription() {
        // TODO
    },
    changeDueDate() {
        // TODO
    },
    changePriority() {
        // TODO
    },
    changeProject() {
        // TODO
    },
    deleteTask(index) {
        toDoItems.splice(index, 1);
        const tasks = document.querySelectorAll(".task");
        for (let task of tasks) {
            if (parseInt(task.dataset.toDoIndex, 10) === index) {
                task.remove();
            }
        }
        assignToDoIndex();
    },
    displayToDo() {
        const taskList = document.querySelector("#tasklist");
        while (taskList.lastChild) {
            taskList.removeChild(taskList.lastChild);
        }
        for (let item of toDoItems) {
            const task = document.createElement("div");
            task.classList.add("task", "card", "container", "mb-3");
            task.style.width = "33vw";
            const taskBody = document.createElement("div");
            taskBody.classList.add("card-body");
            task.append(taskBody);
            const taskText = document.createElement("h5");
            taskText.textContent = item.title;
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
            expand.className = "expand-collapse";
            expand.addEventListener("click", e => DOMController.expandTask(e));
            // Add elements to page
            taskBody.append(taskText, completeBtn, deleteBtn);
            task.append(expand);
            taskList.append(task);
            console.log(toDoItems);
        }
    },
    expandForm() {
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
        const project = document.createElement("input");
        project.name = "project";
        project.id = "project";
        project.placeholder = "Project";
        project.classList.add("form-control", "mb-3");
        // Collapse Button
        const collapse = document.createElement("img");
        collapse.setAttribute("src", "../img/icons/menu-up.svg");
        collapse.id = "collapse-form";
        collapse.className = "expand-collapse";
        collapse.addEventListener("click", DOMController.collapseForm);
        // Add to Form
        const form = document.querySelector("form");
        form.append(details, dueDateWrapper, priority, project, collapse);
    }
};

function checkForTarget(e) {
    console.log(e.target);
    if (e.target.classList.contains("delete-btn")) {
        DOMController.deleteTask(
            parseInt(e.target.parentElement.parentElement.dataset.toDoIndex),
            10
        );
    } else if (e.target.classList.contains("complete-btn")) {
        DOMController.completeTask(e);
    }
}

function assignToDoIndex() {
    const tasks = document.querySelectorAll(".task");
    tasks.forEach((task, index) =>
        task.setAttribute("data-to-do-index", index)
    );
}

document
    .querySelector("#addbtn")
    .addEventListener("click", DOMController.addTask);
document.querySelector("#tasklist").addEventListener("click", checkForTarget);
document
    .querySelector("#expand-form")
    .addEventListener("click", DOMController.expandForm);
