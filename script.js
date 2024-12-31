document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const tasksList = document.getElementById('tasksList');
    const completedList = document.getElementById('completedList');

    // 从本地存储加载任务
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // 添加 Firebase 配置
    const firebaseConfig = {
        // 您的 Firebase 配置信息
    };

    // 初始化 Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // 实时同步数据
    db.collection('tasks').onSnapshot(snapshot => {
        tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderTasks();
    });

    // 在 script.js 中添加 WebSocket 连接
    const ws = new WebSocket('您的WebSocket服务器地址');

    // 在任务更新时发送消息
    function updateTasks() {
        renderTasks();
        ws.send(JSON.stringify(tasks));
    }

    // 接收其他用户的更新
    ws.onmessage = (event) => {
        tasks = JSON.parse(event.data);
        renderTasks();
    };

    // 渲染任务列表
    function renderTasks() {
        tasksList.innerHTML = '';
        completedList.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn">删除</button>
            `;

            // 复选框事件监听
            const checkbox = li.querySelector('input[type="checkbox"]');
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

        // 保存到本地存储
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // 添加新任务
    function addTask(text) {
        if (text.trim() === '') return;
        tasks.push({
            text: text,
            completed: false
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

    // 添加任务按钮点击事件
    addTaskBtn.addEventListener('click', () => {
        addTask(taskInput.value);
        taskInput.value = '';
    });

    // 输入框回车事件
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
            taskInput.value = '';
        }
    });

    // 初始渲染
    renderTasks();
}); 