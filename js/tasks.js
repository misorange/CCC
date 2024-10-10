// DOMの準備が整ったら、以下の処理を実行
document.addEventListener('DOMContentLoaded', () => {
  const task_list = document.getElementById('task-list');
  const task_form = document.getElementById('task-form');
  const update_task_form = document.getElementById('update-task-form');

  // サーバからタスクの一覧を取得し、表示する関数
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const tasks = await response.json();
      // タスクリストの内容をクリア
      task_list.innerHTML = '';
      // 取得した各タスクをリストに追加
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.title} (期日: ${task.dueDate}) - ${task.completed ? '完了' : '未完了'}`;

        const menuButton = document.createElement('div');
        menuButton.className = 'dropdown';

        // ドロップダウンボタンを作成
        const menuToggle = document.createElement('button');
        menuToggle.className = 'dropbtn';
        menuToggle.textContent = '...';
        menuButton.appendChild(menuToggle);

        const menuContent = document.createElement('div');
        menuContent.className = 'dropdown-content';

        const updateOption = document.createElement('a');
        updateOption.href = '#';
        updateOption.textContent = '更新';
        // クリックイベントで更新フォームに選択したタスクの情報をセット
        updateOption.addEventListener('click', () => {
          update_task_form['update-id'].value = task.id;
          update_task_form['update-title'].value = task.title;
          update_task_form['update-dueDate'].value = task.dueDate;
          update_task_form['update-completed'].checked = task.completed;
        });
        menuContent.appendChild(updateOption);

        // 削除オプションのリンクを作成
        const deleteOption = document.createElement('a');
        deleteOption.href = '#';
        deleteOption.textContent = '削除';
        // クリックでタスクを削除
        deleteOption.addEventListener('click', () => deleteTask(task.id));
        menuContent.appendChild(deleteOption);

        // メニュー内容をメニューボタンに追加
        menuButton.appendChild(menuContent);
        li.appendChild(menuButton);
        task_list.appendChild(li);
      });
    } catch (error) {
      // タスク取得エラー時の処理
      console.error('Error fetching tasks:', error);
    }
  };

  // タスクを削除する関数
  const deleteTask = async (id) => {
    // ユーザーに確認ダイアログを表示
    const confirmed = confirm('本当にこのタスクを削除しますか？');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // 削除後、タスクを再取得して画面を更新
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // 新しいタスクを追加する関数
  const addTask = async (event) => {
    event.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
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
        // 追加成功後、タスクを再取得してフォームをリセット
        fetchTasks();
        task_form.reset();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // 既存のタスクを更新する関数
  const updateTask = async (event) => {
    event.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
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
        // 更新成功後、タスクを再取得してフォームをリセット
        fetchTasks();
        update_task_form.reset();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  task_form.addEventListener('submit', addTask);
  update_task_form.addEventListener('submit', updateTask);

  fetchTasks();
});