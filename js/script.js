document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskDueTimeInput = document.getElementById('task-due-time');
    const addTaskButton = document.getElementById('add-task-btn');
    const deleteCompletedButton = document.getElementById('delete-completed-btn');
    const filterSelect = document.getElementById('filter-tasks');
    const searchInput = document.getElementById('search-tasks');
    const taskList = document.getElementById('task-list');
    const themeToggle = document.getElementById('theme-toggle');

    function validateInput() {
        const taskText = taskInput.value.trim();
        const dueDate = taskDueDateInput.value;
        const dueTime = taskDueTimeInput.value;
        if (taskText.length === 0 && !dueDate && !dueTime) {
            alert('Mohon isi Task, Tanggal, dan Jam terlebih dahulu.');
            taskInput.focus();
            return false;
        }
        if (taskText.length === 0) {
            alert('Mohon isi Task terlebih dahulu.');
            taskInput.focus();
            return false;
        }
        if (!dueDate) {
            alert('Mohon isi Tanggal terlebih dahulu.');
            taskDueDateInput.focus();
            return false;
        }
        if (!dueTime) {
            alert('Mohon isi Jam terlebih dahulu.');
            taskDueTimeInput.focus();
            return false;
        }
        return true;
    }

    function createTaskElement(taskText, dueDate, dueTime) {
        const listItem = document.createElement('li');
        listItem.className = 'flex items-center gap-3 py-1';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-checkbox h-4 w-4';

        const textSpan = document.createElement('span');
        textSpan.textContent = taskText;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'text-gray-600 text-sm';
        const datePart = dueDate ? dueDate : '';
        const timePart = dueTime ? dueTime : '';
        const dt = [datePart, timePart].filter(Boolean).join(' ');
        dateSpan.textContent = dt ? `(${dt})` : '';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'ml-auto border border-black rounded py-0.5 px-2 bg-amber-500 text-white edit-btn';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'border border-black rounded py-0.5 px-2 bg-red-500 text-white';

        editButton.addEventListener('click', () => {
            const currentText = textSpan.textContent;
            const newText = prompt('Edit task:', currentText);
            if (newText === null) return; // cancelled
            const trimmed = newText.trim();
            if (trimmed.length === 0) {
                alert('Task tidak boleh kosong.');
                return;
            }
            textSpan.textContent = trimmed;
        });

        deleteButton.addEventListener('click', () => {
            listItem.remove();
        });

        checkbox.addEventListener('change', () => {
            listItem.dataset.status = checkbox.checked ? 'completed' : 'pending';
            applyFilters();
        });

        listItem.dataset.status = 'pending';
        const dueMs = Date.parse(`${dueDate}T${dueTime}`);
        listItem.dataset.dueAt = isNaN(dueMs) ? '0' : String(dueMs);
        listItem.appendChild(checkbox);
        listItem.appendChild(textSpan);
        listItem.appendChild(dateSpan);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        return listItem;
    }

    function sortTasks() {
        const items = Array.from(taskList.children);
        items.sort((a, b) => {
            const aDue = Number(a.dataset.dueAt || '0');
            const bDue = Number(b.dataset.dueAt || '0');
            return aDue - bDue; // earliest first
        });
        items.forEach((item) => taskList.appendChild(item));
    }

    function addTask() {
        if (!validateInput()) {
            return;
        }
        const taskText = taskInput.value.trim();
        const dueDate = taskDueDateInput.value;
        const dueTime = taskDueTimeInput.value;

        const taskElement = createTaskElement(taskText, dueDate, dueTime);
        taskList.appendChild(taskElement);
        sortTasks();

        taskInput.value = '';
        taskDueDateInput.value = '';
        taskDueTimeInput.value = '';
        applyFilters();
    }

    function deleteCompleted() {
        const items = Array.from(taskList.querySelectorAll('li'));
        items.forEach((item) => {
            const isCompleted = item.dataset.status === 'completed' || item.querySelector('input[type="checkbox"]').checked;
            if (isCompleted) {
                item.remove();
            }
        });
    }

    function applyFilters() {
        const filterValue = filterSelect.value;
        const query = searchInput.value.trim().toLowerCase();

        const items = Array.from(taskList.querySelectorAll('li'));
        items.forEach((item) => {
            const status = item.dataset.status || 'pending';
            const text = item.textContent.toLowerCase();

            const matchesFilter =
                filterValue === 'all' ||
                (filterValue === 'completed' && status === 'completed') ||
                (filterValue === 'pending' && status === 'pending');

            const matchesSearch = query === '' || text.includes(query);

            item.style.display = matchesFilter && matchesSearch ? '' : 'none';
        });
    }

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    deleteCompletedButton.addEventListener('click', deleteCompleted);
    filterSelect.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);

    // THEME TOGGLE
    function applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('theme-dark');
            themeToggle.textContent = '🌞';
        } else {
            root.classList.remove('theme-dark');
            themeToggle.textContent = '🌙';
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('theme-dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '🌞' : '🌙';
    });
});

