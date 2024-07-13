// server.js
const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const db = require('./db');
const path = require('path');

const app = express();
app.use(body_parser.json());
app.use(cors());

// 課題リストを取得するエンドポイント
app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(rows);
        write_db_to_JSON("tasks");
    });
});

// 新しい課題を追加するエンドポイント
app.post('/api/tasks', (req, res) => {
    const { title, dueDate, completed } = req.body;
    const sql = 'INSERT INTO tasks (title, dueDate, completed) VALUES (?, ?, ?)';
    const params = [title, dueDate, completed ? 1 : 0];
    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// 課題を更新するエンドポイント
app.put('/api/tasks/:id', (req, res) => {
    const { title, dueDate, completed } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE tasks SET title = ?, dueDate = ?, completed = ? WHERE id = ?';
    const params = [title, dueDate, completed ? 1 : 0, id];
    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

// 課題を削除するエンドポイント
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// JSONファイルにデータを書き込む関数
const write_db_to_JSON = (table_name) => {
    db.all(`SELECT * FROM ${table_name}`, [], (err, rows) => {
        if (err) {
            console.error(`Error fetching ${table_name}:`, err);
            return;
        }
        const data = rows;
        const json_file_path = path.join(__dirname, 'data', `${table_name}.json`);
        fs.writeFile(json_file_path, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error('Error writing to JSON file:', err);
            } else {
                console.log(`Tasks written to data/${table_name}.json`);
            }
        });
    });
};

// JSONデータをデータベースに挿入
// 後でtasks以外も対応できるようにする
const write_JSON_to_db = async (table_name) => {
    const sqlite3 = require('sqlite3').verbose();
    const database = new sqlite3.Database('./database.db');
    // JSONファイルの読み込み
    const json_file_path = path.join(__dirname, 'data', `${table_name}.json`);
    if (!fs.existsSync(json_file_path)) {
        console.error(`JSON file not found: ${json_file_path}`);
        return;
    }
    const json_data = fs.readFileSync(json_file_path, 'utf8');
    const tasks = JSON.parse(json_data);


    // JSONデータをデータベースに挿入
    const insert_stmt = database.prepare(`INSERT INTO ${table_name} (id, title, dueDate, completed, description) VALUES (?, ?, ?, ?, ?)`);
    const new_datas = await get_new_datas("tasks", tasks, database);
    for (const data of new_datas) {
        try {
            await new Promise((resolve, reject) => {
                insert_stmt.run(data.id, data.title, data.dueDate, data.completed, data.description, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        } catch (err) {
            console.error(`Error inserting task with id ${data.id}:`, err);
        }
    }
    
    insert_stmt.finalize();

    console.log('New tasks have been imported to the database.');
};

const get_new_datas = async (table_name, datas, database) => {
    if (!Array.isArray(datas)) {
        console.error('Data is not an array');
        return [];
    }

    const json_ids = datas.map(item => item.id);
    const db_ids = await new Promise((resolve, reject) => {
                                database.all(`SELECT id FROM ${table_name}`, [], (err, rows) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                    resolve(rows.map(row => row.id));
                                });
                            });
    const new_datas = datas.filter(data => !db_ids.includes(data.id));
    return new_datas;
};
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    write_JSON_to_db("tasks");
});