// URL de l'API backend. En local via docker-compose, le port 5000
// du conteneur "backend" est publie sur la machine hote.
const API_URL = 'http://localhost:5000/api/tasks';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  list.innerHTML = '';
  tasks.forEach(renderTask);
}

function renderTask(task) {
  const li = document.createElement('li');
  li.className = task.done ? 'done' : '';

  const span = document.createElement('span');
  span.textContent = task.title;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = task.done ? 'Annuler' : 'Terminer';
  toggleBtn.onclick = () => toggleTask(task.id, !task.done);

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Suppr.';
  delBtn.className = 'delete-btn';
  delBtn.onclick = () => deleteTask(task.id);

  actions.appendChild(toggleBtn);
  actions.appendChild(delBtn);

  li.appendChild(span);
  li.appendChild(actions);
  list.appendChild(li);
}

async function toggleTask(id, done) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done }),
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadTasks();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  input.value = '';
  loadTasks();
});

loadTasks();
