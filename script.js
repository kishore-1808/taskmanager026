document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const taskCount = document.getElementById('taskCount');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const themeToggle = document.getElementById('themeToggle');

  // State
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

  // Initialize
  renderTasks();
  updateTaskCount();
  loadTheme();

  // Event Listeners
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  clearCompletedBtn.addEventListener('click', clearCompletedTasks);
  themeToggle.addEventListener('click', toggleTheme);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks();
    });
  });

  // Functions
  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      const task = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
      };
      tasks.unshift(task);
      saveTasks();
      renderTasks();
      taskInput.value = '';
      updateTaskCount();
    }
  }

  function toggleTask(id) {
    tasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
    updateTaskCount();
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateTaskCount();
  }

  function editTask(id, newText) {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    );
    saveTasks();
    renderTasks();
  }

  function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateTaskCount();
  }

  function renderTasks() {
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
      filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    }

    taskList.innerHTML = filteredTasks.map(task => `
      <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text" ondblclick="this.contentEditable=true;this.focus()"
          onblur="this.contentEditable=false"
          onkeypress="if(event.key==='Enter'){event.preventDefault();this.blur()}"
        >${task.text}</span>
        <button class="delete-task">Delete</button>
      </li>
    `).join('');

    // Add event listeners to new elements
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const id = parseInt(e.target.closest('.task-item').dataset.id);
        toggleTask(id);
      });
    });

    document.querySelectorAll('.delete-task').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = parseInt(e.target.closest('.task-item').dataset.id);
        deleteTask(id);
      });
    });

    document.querySelectorAll('.task-text').forEach(text => {
      text.addEventListener('blur', (e) => {
        const id = parseInt(e.target.closest('.task-item').dataset.id);
        const newText = e.target.textContent.trim();
        if (newText) {
          editTask(id, newText);
        }
      });
    });
  }

  function updateTaskCount() {
    const remainingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${remainingTasks} task${remainingTasks === 1 ? '' : 's'} remaining`;
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTheme() {
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    }
  }

  function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('darkTheme', document.body.classList.contains('dark-theme'));
  }
});