<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
  const task_list = document.getElementById('task-list');
  const task_form = document.getElementById('task-form');

=======
// DOMの準備が整ったら、以下の処理を実行
document.addEventListener('DOMContentLoaded', () => {
  const task_list = document.getElementById('task-list');
  const task_form = document.getElementById('task-form');
  const update_task_form = document.getElementById('update-task-form');

  // サーバからタスクの一覧を取得し、表示する関数
>>>>>>> c374b9b2606352a9f238c7bf3a91703ddeb211d7
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const tasks = await response.json();
<<<<<<< HEAD
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
=======
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
>>>>>>> c374b9b2606352a9f238c7bf3a91703ddeb211d7
    const confirmed = confirm('本当にこのタスクを削除しますか？');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
<<<<<<< HEAD
        fetchTasks();
      }
    } catch (error) {
      console.error('エラーが発生しました。タスクを削除できません:', error);
    }
  };

  const addTask = async (event) => {
    event.preventDefault();
=======
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
>>>>>>> c374b9b2606352a9f238c7bf3a91703ddeb211d7
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
<<<<<<< HEAD
=======
        // 追加成功後、タスクを再取得してフォームをリセット
>>>>>>> c374b9b2606352a9f238c7bf3a91703ddeb211d7
        fetchTasks();
        task_form.reset();
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('エラーが発生しました。タスクを追加できません:', error);
=======
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
>>>>>>> c374b9b2606352a9f238c7bf3a91703ddeb211d7
    }
  };

  task_form.addEventListener('submit', addTask);
<<<<<<< HEAD
=======
  update_task_form.addEventListener('submit', updateTask);
>>>>>>> c374b9b2606352a9f238c7bf3a91703ddeb211d7

  fetchTasks();
});