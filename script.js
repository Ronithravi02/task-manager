const API_URL = 'https://ze2ijde7hd.execute-api.us-east-1.amazonaws.com/tasks';

async function loadTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();

  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.title} - ${task.description} [${task.completed ? '✅' : '❌'}]`;
    taskList.appendChild(li);
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

document.getElementById('taskForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  addTask(title, description);
  e.target.reset();
});

window.onload = loadTasks;
