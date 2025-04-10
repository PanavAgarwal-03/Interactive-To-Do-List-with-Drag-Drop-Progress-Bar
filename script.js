const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progress');

let tasks = [];

addTaskButton.addEventListener('click', addTask);

// Add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  tasks.push(task);
  taskInput.value = '';
  renderTasks();
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.draggable = true;

    if (task.completed) {
      li.classList.add('completed');
    }

    // Add buttons
    const buttonsDiv = document.createElement('div');

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(index));
    buttonsDiv.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(index));
    buttonsDiv.appendChild(deleteBtn);

    // Complete button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete';
    completeBtn.addEventListener('click', () => toggleComplete(index));
    buttonsDiv.appendChild(completeBtn);

    li.appendChild(buttonsDiv);
    taskList.appendChild(li);

    // Drag and drop events
    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => li.classList.remove('dragging'));
  });

  updateProgress();
}

// Edit task
function editTask(index) {
  const newText = prompt('Edit your task:', tasks[index].text);
  if (newText) {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Toggle complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Drag and drop functionality
taskList.addEventListener('dragover', (e) => {
  e.preventDefault();
  const draggingElement = document.querySelector('.dragging');
  const afterElement = getDragAfterElement(taskList, e.clientY);
  if (afterElement == null) {
    taskList.appendChild(draggingElement);
  } else {
    taskList.insertBefore(draggingElement, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Update progress bar
function updateProgress() {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progressPercentage = tasks.length ? (completedTasks / tasks.length) * 100 : 0;
  progressBar.style.width = `${progressPercentage}%`;
}
