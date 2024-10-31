document.addEventListener('DOMContentLoaded', () => {
  const task_list = document.getElementById('task-list');
  const task_form = document.getElementById('task-form');

  // タスクを取得、表示する関数
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks'); // サーバーからタスクデータを取得
      const tasks = await response.json();

      tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));//タスクを期日順に表示
      task_list.innerHTML = ''; // タスクリストをクリア
      tasks.forEach(task => {
        const li = document.createElement('li');

        // タスクの完了を示すチェックボックスを作成
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => updateTask({ ...task, completed: checkbox.checked })); // チェック状態の変更をサーバーに送信
        li.appendChild(checkbox);

        // タスク情報を表示
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

        // タスクを編集するためのボタンを追加
        const editButton = document.createElement('button');
        editButton.textContent = '編集';
        editButton.addEventListener('click', () => editTask(task)); // 編集処理を呼び出し
        li.appendChild(editButton);

        // タスクを削除するためのボタンを追加
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => deleteTask(task.id)); // 削除処理を呼び出し
        li.appendChild(deleteButton);

        // タスク要素をリストに追加
        task_list.appendChild(li);
      });
    } catch (error) {
      console.error('エラーが発生しました。タスクを取得できません:', error);
    }
  };

  // タスクを編集する関数
  const editTask = (task) => {
    // ユーザーに新しいタスク名と期日を入力してもらう
    const newTitle = prompt('新しいタスク名を入力してください:', task.title);
    const newDueDate = prompt('新しい期日を入力してください (YYYY-MM-DD):', task.dueDate);

    // 日付形式を検証
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(newDueDate)) {
      alert('日付の形式が正しくありません。YYYY-MM-DDの形式で入力してください。');
      return;
    }

    // 変更があった場合、タスクを更新
    if (newTitle && newDueDate && (newTitle !== task.title || newDueDate !== task.dueDate)) {
      updateTask({ ...task, title: newTitle, dueDate: newDueDate });
    }
  };

  // タスクを更新する関数

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
        fetchTasks(); // 成功した場合はタスクリストを再取得
      }
    } catch (error) {
      console.error('エラーが発生しました。タスクを更新できません:', error);
    }
  };

  // タスクを削除する関数
  const deleteTask = async (id) => {
    const confirmed = confirm('本当にこのタスクを削除しますか？'); // ユーザーの確認を求める
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchTasks(); // 削除に成功したらタスクリストを再取得
      }
    } catch (error) {
      console.error('エラーが発生しました。タスクを削除できません:', error);
    }
  };

  // 新しいタスクを追加する関数
  const addTask = async (event) => {
    event.preventDefault(); // フォームのデフォルト動作をキャンセル
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
        fetchTasks(); // 成功した場合はタスクリストを再取得
        task_form.reset(); // フォームをリセット
      }
    } catch (error) {
      console.error('エラーが発生しました。タスクを追加できません:', error);
    }
  };

  task_form.addEventListener('submit', addTask); // フォーム送信時にタスク追加関数を呼び出し

  fetchTasks(); // 初回のタスクリスト取得
});