window.addEventListener("focus", () => {
    setTimeout(() => {
        location.reload();
    }, 100)
})

function updateClock() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = days[now.getDay()];
    const date = String(now.getDate()).padStart(2, "0");
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    document.getElementById("clock-time").textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById("clock-date").textContent = `${day}, ${date} ${month} ${year}`;
}

setInterval(updateClock, 1000);
updateClock();

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const clearAllBtn = document.getElementById("clearAll");
const toggleBtn = document.getElementById("toggleTodo");
const todoContent = document.getElementById("todoContent");

function loadTodos() {
    return JSON.parse(localStorage.getItem("todos") || "[]");
}

function saveTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
    const todos = loadTodos();
    todoList.innerHTML = "";
    todos.forEach((t, i) => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-start border-2 border-black bg-white px-2 py-1 gap-2 whitespace-pre";

        const left = document.createElement("div");
        left.className = "flex gap-2 items-start flex-1";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = t.done;
        checkbox.classList.add("hidden");
        checkbox.onchange = () => {
            todos[i].done = checkbox.checked;
            saveTodos(todos);
            renderTodos();
        };

        const span = document.createElement("span");
        span.textContent = t.text;
        if (t.done) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.6";
        }

        left.appendChild(checkbox);
        left.appendChild(span);

        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.className = "border-2 border-black px-2 bg-button font-bold cursor-pointer";
        delBtn.onclick = () => {
            todos.splice(i, 1);
            saveTodos(todos);
            renderTodos();
        };

        li.appendChild(left);
        li.appendChild(delBtn);
        todoList.appendChild(li);
    });
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;
    const todos = loadTodos();
    todos.push({text, done: false});
    saveTodos(todos);
    todoInput.value = "";
    localStorage.removeItem("todoInput");
    renderTodos();
});

todoInput.value = localStorage.getItem("todoInput") || "";
todoInput.addEventListener("input", () => {
    localStorage.setItem("todoInput", todoInput.value);
});

clearAllBtn.addEventListener("click", () => {
    if (confirm("Delete all tasks?")) {
        localStorage.removeItem("todos");
        renderTodos();
    }
});

function saveVisibility(state) {
    localStorage.setItem("todoVisible", state);
}

toggleBtn.addEventListener("click", () => {
    const hidden = todoContent.classList.toggle("hidden");
    toggleBtn.textContent = hidden ? "+" : "−";
    saveVisibility(hidden ? "hidden" : "visible");
});

renderTodos();
const savedState = localStorage.getItem("todoVisible");
if (savedState === "hidden") {
    todoContent.classList.add("hidden");
    toggleBtn.textContent = "+";
}
