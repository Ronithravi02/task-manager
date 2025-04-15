const API_URL = 'https://tuuy7bl41g.execute-api.eu-north-1.amazonaws.com/tasks';
let currentEditTaskId = null;
let showCompletedTasksOnly = false;

async function loadTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();

  const taskList = document.getElementById('taskList');
  const completedTasksList = document.getElementById('completedTasksList');
  taskList.innerHTML = '';
  completedTasksList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);
    li.innerHTML = `
      ${task.title} - ${task.description} [${task.completed ? '✅' : '❌'}]
      <button onclick="editTask('${task.taskId}', \`${task.title}\`, \`${task.description}\`, ${task.completed})">✏ Edit</button>
      <button onclick="deleteTask('${task.taskId}')">🗑 Delete</button>
    `;

    // Display task in the appropriate list based on completion status
    if (task.completed && showCompletedTasksOnly) {
      completedTasksList.appendChild(li);
    } else if (!task.completed) {
      taskList.appendChild(li);
    }
  });
}

async function addTask(title, description) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  });
  await response.json();
  loadTasks(); // Refresh task list
}

async function deleteTask(taskId) {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: 'DELETE'
  });
  const result = await response.json();
  alert(result.message || 'Deleted');
  loadTasks(); // Refresh task list
}

function editTask(id, title, description, completed) {
  currentEditTaskId = id;
  document.getElementById('editTitle').value = title;
  document.getElementById('editDescription').value = description;
  document.getElementById('editCompleted').checked = completed;
  document.getElementById('editModal').style.display = 'block';
}

function closeEdit() {
  currentEditTaskId = null;
  document.getElementById('editModal').style.display = 'none';
}

async function submitEdit() {
  const updatedTask = {
    title: document.getElementById('editTitle').value,
    description: document.getElementById('editDescription').value,
    completed: document.getElementById('editCompleted').checked
  };

  const response = await fetch(`${API_URL}/${currentEditTaskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask)
  });

  const result = await response.json();
  alert('✅ Task updated!');
  closeEdit();
  loadTasks();
}

document.getElementById('taskForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  addTask(title, description);
  e.target.reset();
});

// Toggle between showing all tasks and only completed tasks
function toggleCompletedTasks() {
  showCompletedTasksOnly = !showCompletedTasksOnly;
  loadTasks();
}

window.onload = loadTasks;
