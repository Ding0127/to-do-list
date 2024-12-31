document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const tasksList = document.getElementById('tasksList');
    const completedList = document.getElementById('completedList');
    const pendingCount = document.getElementById('pending-count');
    const completedCount = document.getElementById('completed-count');
    const sortBtn = document.getElementById('sort-btn');
    const dateElement = document.querySelector('.date');

    // 设置当前日期
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('zh-CN', options);

    // 从本地存储加载任务
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // 更新计数器
    function updateCounts() {
        const pending = tasks.filter(task => !task.completed).length;
        const completed = tasks.filter(task => task.completed).length;
        pendingCount.textContent = pending;
        completedCount.textContent = completed;
    }

    // 渲染任务列表
    function renderTasks() {
        tasksList.innerHTML = '';
        completedList.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="task-btn delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // 复选框事件监听
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTask(index));

            // 删除按钮事件监听
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(index));

            // 根据完成状态放入不同列表
            if (task.completed) {
                completedList.appendChild(li);
            } else {
                tasksList.appendChild(li);
            }
        });

        updateCounts();
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // 添加新任务
    function addTask(text) {
        if (text.trim() === '') return;
        tasks.unshift({
            text: text,
            completed: false,
            createdAt: new Date().getTime()
        });
        renderTasks();
    }

    // 切换任务状态
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    // 删除任务
    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    // 排序任务
    function sortTasks() {
        tasks.sort((a, b) => {
            if (a.completed === b.completed) {
                return b.createdAt - a.createdAt;
            }
            return a.completed ? 1 : -1;
        });
        renderTasks();
    }

    // 输入框回车事件
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim() !== '') {
            addTask(taskInput.value);
            taskInput.value = '';
        }
    });

    // 排序按钮点击事件
    sortBtn.addEventListener('click', sortTasks);

    // 初始渲染
    renderTasks();
});