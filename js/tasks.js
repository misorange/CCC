document.addEventListener('DOMContentLoaded', () => {
  const task_list = document.getElementById('task-list');
  const task_form = document.getElementById('task-form');

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const tasks = await response.json();
      task_list.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');

        // チェックボックスの作成
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => updateTask({ ...task, completed: checkbox.checked }));
        li.appendChild(checkbox);

        // タスク情報
        const taskInfo = document.createTextNode(` ${task.title} (期日: ${task.dueDate})`);
        li.appendChild(taskInfo);

        // 現在の日付を取得
        const currentDate = new Date().toISOString().split('T')[0];

        // 期日が過去で未完了の場合に警告を表示
        if (task.dueDate < currentDate && !task.completed) {
          const warningPast = document.createElement('span');
          warningPast.textContent = ' ⚠️期日切れ';
          warningPast.style.color = 'red';
          li.appendChild(warningPast);
        }

        // 期日が今日で未完了の場合に警告を表示
        if (task.dueDate === currentDate && !task.completed) {
          const warningToday = document.createElement('span');
          warningToday.textContent = ' ⚠️本日が期日';
          warningToday.style.color = 'orange';
          li.appendChild(warningToday);
        }

        // 編集ボタンを追加
        const editButton = document.createElement('button');
        editButton.textContent = '編集';
        editButton.addEventListener('click', () => editTask(task));
        li.appendChild(editButton);

        // 削除ボタンを追加
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        li.appendChild(deleteButton);

        task_list.appendChild(li);
      });
    } catch (error) {
      console.error('エラーが発生しました。タスクを取得できません:', error);
    }
  };

  const editTask = (task) => {
    const newTitle = prompt('新しいタスク名を入力してください:', task.title);
    const newDueDate = prompt('新しい期日を入力してください (YYYY-MM-DD):', task.dueDate);

    // 日付形式を検証
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(newDueDate)) {
      alert('日付の形式が正しくありません。YYYY-MM-DDの形式で入力してください。');
      return;
    }

    if (newTitle && newDueDate && (newTitle !== task.title || newDueDate !== task.dueDate)) {
      updateTask({ ...task, title: newTitle, dueDate: newDueDate });
    }
  };

  const updateTask = async (task) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: task.title, dueDate: task.dueDate, completed: task.completed })
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('エラーが発生しました。タスクを更新できません:', error);
    }
  };

  const deleteTask = async (id) => {
    const confirmed = confirm('本当にこのタスクを削除しますか？');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('エラーが発生しました。タスクを削除できません:', error);
    }
  };

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
        fetchTasks();
        task_form.reset();
      }
    } catch (error) {
      console.error('エラーが発生しました。タスクを追加できません:', error);
    }
  };

  task_form.addEventListener('submit', addTask);

  fetchTasks();
});