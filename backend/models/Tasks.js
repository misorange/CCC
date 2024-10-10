// tasks.js

document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('task-list');

  // 課題リストを取得して表示する関数
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const tasks = await response.json();
      taskList.innerHTML = ''; // 既存のリストをクリア
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.title} (期限: ${task.dueDate}) - ${task.completed ? '完了' : '未達成'}`;
        taskList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  fetchTasks();
});