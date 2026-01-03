let tasksData = {}; 
// COLUMNS
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done];

// DRAG STATE
let draggedTask = null;

// UPDATE COUNTS , SAVE
function updateCounts() {
    tasksData = {};

    columns.forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        tasksData[col.id] = Array.from(tasks).map(task => ({
            title: task.querySelector("h2").innerText,
            desc: task.querySelector("p").innerText
        }));

        count.innerText = tasks.length;
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// CREATE TASK ELEMENT
function createTask(title, desc) {
    const task = document.createElement("div");
    task.className = "task";

    task.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>
    `;

    addTaskDragEvents(task);

    task.querySelector(".delete-btn").addEventListener("click", () => {
        task.remove();
        updateCounts();
    });

    return task;
}

// DRAG EVENTS
function addTaskDragEvents(task) {
    task.draggable = true;

    task.addEventListener("dragstart", () => {
        draggedTask = task;
        task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
        draggedTask = null;
    });
}

// COLUMN EVENTS
columns.forEach(column => {
    column.addEventListener("dragover", e => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", () => {
        column.classList.remove("hover-over");
    });

    column.addEventListener("drop", () => {
        column.classList.remove("hover-over");

        if (draggedTask) {
            column.appendChild(draggedTask);
            updateCounts();
        }
    });
});

// LOAD FROM LOCAL STORAGE
function loadFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (!storedTasks) {
        updateCounts();
        return;
    }

    tasksData = storedTasks;

    columns.forEach(col => {
        col.querySelectorAll(".task").forEach(task => task.remove());
    });

    Object.keys(tasksData).forEach(colId => {
        const column = document.getElementById(colId);

        tasksData[colId].forEach(taskData => {
            const task = createTask(taskData.title, taskData.desc);
            column.appendChild(task);
        });
    });

    updateCounts();
}


// MODAL
const toggleModalButton = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");

toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

// ADD TASK
const addTaskButton = document.querySelector("#add-new-task");

addTaskButton.addEventListener("click", () => {
    const title = document.querySelector("#task-title-input").value.trim();
    const desc = document.querySelector("#task-desc-input").value.trim();

    if (!title) {
        alert("Task title required");
        return;
    }

    const task = createTask(title, desc);
    todo.appendChild(task);

    updateCounts();
    modal.classList.remove("active");
});
// INITIAL LOAD
loadFromLocalStorage();
