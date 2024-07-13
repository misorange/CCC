// tasks.js

document.addEventListener('DOMContentLoaded', () => {
    const task_list = document.getElementById('task-list');
    const task_form = document.getElementById('task-form');
    const update_task_form = document.getElementById('update-task-form');
    const delete_task_form = document.getElementById('delete-task-form');

    // 課題リストを取得して表示する関数
    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tasks');
            const tasks = await response.json();
            task_list.innerHTML = ''; // 既存のリストをクリア        
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `${task.id}: ${task.title} (Due: ${task.dueDate}) - ${task.completed ? 'Completed' : 'Not Completed'}`;
                task_list.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // 新しい課題を追加する関数
    const addTask = async (event) => {
        event.preventDefault();
        const title = task_form.title.value;
        const dueDate = task_form.dueDate.value;
        try {
            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, dueDate, completed: false })
            });
            if (response.ok) {
                fetchTasks(); // 課題リストを再取得
                task_form.reset(); // フォームをリセット
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

// 課題を更新する関数
    const updateTask = async (event) => {
        event.preventDefault();
        const id = update_task_form['update-id'].value;
        const title = update_task_form['update-title'].value;
        const dueDate = update_task_form['update-dueDate'].value;
        const completed = update_task_form['update-completed'].checked;
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, dueDate, completed })
            });
            if (response.ok) {
                fetchTasks(); // 課題リストを再取得
                update_task_form.reset(); // フォームをリセット
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    // 課題を削除する関数
    const deleteTask = async (event) => {
        event.preventDefault();
        const id = delete_task_form['delete-id'].value;
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchTasks(); // 課題リストを再取得
                delete_task_form.reset(); // フォームをリセット
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // イベントリスナーを設定
    task_form.addEventListener('submit', addTask);
    update_task_form.addEventListener('submit', updateTask);
    delete_task_form.addEventListener('submit', deleteTask);

    // 初期課題リストの取得
    fetchTasks();
});