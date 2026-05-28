const storageKey = "codex-todo-items";

const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const todoTemplate = document.querySelector("#todoTemplate");
const emptyState = document.querySelector("#emptyState");
const counter = document.querySelector("#counter");
const clearDoneButton = document.querySelector("#clearDone");
const clearAllButton = document.querySelector("#clearAll");
const filterButtons = document.querySelectorAll(".filter");
const weekdayElement = document.querySelector("#weekday");
const todayElement = document.querySelector("#today");

let todos = loadTodos();
let currentFilter = "all";

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}

function formatDate() {
  const now = new Date();
  const weekdays = [
    "\u5468\u65e5",
    "\u5468\u4e00",
    "\u5468\u4e8c",
    "\u5468\u4e09",
    "\u5468\u56db",
    "\u5468\u4e94",
    "\u5468\u516d",
  ];

  weekdayElement.textContent = weekdays[now.getDay()];
  todayElement.textContent = `${String(now.getMonth() + 1).padStart(2, "0")}.${String(
    now.getDate(),
  ).padStart(2, "0")}`;
}

function getVisibleTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.done);
  }

  if (currentFilter === "done") {
    return todos.filter((todo) => todo.done);
  }

  return todos;
}

function updateCounter() {
  const activeCount = todos.filter((todo) => !todo.done).length;
  const totalCount = todos.length;
  counter.textContent = `${activeCount} \u9879\u5f85\u529e / \u5171 ${totalCount} \u9879`;
}

function renderTodos() {
  todoList.innerHTML = "";

  const visibleTodos = getVisibleTodos();
  visibleTodos.forEach((todo) => {
    const item = todoTemplate.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector(".todo-check");
    const title = item.querySelector(".todo-title");
    const deleteButton = item.querySelector(".delete-button");

    item.classList.toggle("done", todo.done);
    title.textContent = todo.title;
    checkbox.checked = todo.done;

    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    deleteButton.addEventListener("click", () => {
      todos = todos.filter((itemTodo) => itemTodo.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    todoList.append(item);
  });

  emptyState.classList.toggle("visible", visibleTodos.length === 0);
  updateCounter();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = todoInput.value.trim();
  if (!title) {
    todoInput.focus();
    return;
  }

  todos.unshift({
    id: createId(),
    title,
    done: false,
    createdAt: Date.now(),
  });

  todoInput.value = "";
  saveTodos();
  renderTodos();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTodos();
  });
});

clearDoneButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.done);
  saveTodos();
  renderTodos();
});

clearAllButton.addEventListener("click", () => {
  if (todos.length === 0) {
    return;
  }

  const confirmed = confirm("\u786e\u5b9a\u8981\u6e05\u7a7a\u5168\u90e8\u5f85\u529e\u5417\uff1f");
  if (!confirmed) {
    return;
  }

  todos = [];
  saveTodos();
  renderTodos();
});

formatDate();
renderTodos();
