document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

document.getElementById('taskForm').addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const responsible = document.getElementById('responsible').value;

    if (new Date(endDate) < new Date(startDate)) {
        alert("La fecha de fin no puede ser menor a la fecha de inicio.");
        return;
    }

    const task = {
        id: Date.now(),
        taskName,
        startDate,
        endDate,
        responsible,
        completed: false
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('taskForm').reset();
    loadTasks();
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.dataset.id = task.id;
        li.innerHTML = `
            <div>
                <span>${task.taskName}</span>
                <span class="ml-2 text-muted">(Inicio: ${task.startDate}, Fin: ${task.endDate}, Responsable: ${task.responsible})</span>
            </div>
            <div>
                <button class="btn btn-danger btn-sm delete-task">Eliminar</button>
                ${task.completed ? `<button class="btn btn-warning btn-sm unmark-completed">Desmarcar</button>` : (new Date(task.endDate) < new Date() ? '' : `<button class="btn btn-success btn-sm mark-completed">Marcar como resuelta</button>`)}
            </div>
        `;

        const endDate = new Date(task.endDate);
        const now = new Date();

        if (task.completed) {
            li.classList.add('completed');
        } else if (endDate < now) {
            li.classList.add('expired');
        } else {
            li.classList.add('pending');
        }

        taskList.appendChild(li);
    });
}

document.getElementById('taskList').addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-task')) {
        deleteTask(e.target.parentElement.parentElement.dataset.id);
    } else if (e.target.classList.contains('mark-completed')) {
        markTaskCompleted(e.target.parentElement.parentElement.dataset.id);
    } else if (e.target.classList.contains('unmark-completed')) {
        unmarkTaskCompleted(e.target.parentElement.parentElement.dataset.id);
    }
});

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function markTaskCompleted(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id == id && new Date(task.endDate) >= new Date()) {
            task.completed = true;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function unmarkTaskCompleted(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id == id) {
            task.completed = false;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function searchTasks(query) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => task.taskName.toLowerCase().includes(query.toLowerCase()));
    displayTasks(filteredTasks);
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.dataset.id = task.id;
        li.innerHTML = `
            <div>
                <span>${task.taskName}</span>
                <span class="ml-2 text-muted">(Inicio: ${task.startDate}, Fin: ${task.endDate}, Responsable: ${task.responsible})</span>
            </div>
            <div>
                <button class="btn btn-danger btn-sm delete-task">Eliminar</button>
                ${task.completed ? `<button class="btn btn-warning btn-sm unmark-completed">Desmarcar</button>` : (new Date(task.endDate) < new Date() ? '' : `<button class="btn btn-success btn-sm mark-completed">Marcar como resuelta</button>`)}
            </div>
        `;

        const endDate = new Date(task.endDate);
        const now = new Date();

        if (task.completed) {
            li.classList.add('completed');
        } else if (endDate < now) {
            li.classList.add('expired');
        } else {
            li.classList.add('pending');
        }

        taskList.appendChild(li);
    });
}

document.getElementById('search').addEventListener('input', function() {
    const query = this.value.trim();
    searchTasks(query);
});

loadTasks();
