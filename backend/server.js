// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const body_parser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const db = require('./db');
const path = require('path');
const jwt = require('jsonwebtoken');


const app = express();
app.use(body_parser.json());
app.use(cors());

// テーブル名の配列を定義
const tableNames = ['tasks', 'UID']; // 必要なテーブル名を追加

const column_maps = {
    tasks: {
        id: 'id',           // JSONとデータベースでIDのカラム名が同じであることを前提
        title: 'title',
        dueDate: 'dueDate',
        completed: 'completed',
        description: 'description'
    }
};

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
const write_JSON_to_db = async (table_name) => {
    const sqlite3 = require('sqlite3').verbose();
    const database = new sqlite3.Database('./database.db');

    // テーブル名に基づいてカラムマップを取得
    const column_map = column_maps[table_name];
    if (!column_map) {
        console.error(`No column map defined for table: ${table_name}`);
        return;
    }

    // JSONファイルの読み込み
    const json_file_path = path.join(__dirname, 'data', `${table_name}.json`);
    if (!fs.existsSync(json_file_path)) {
        console.error(`JSON file not found: ${json_file_path}`);
        return;
    }
    const json_data = fs.readFileSync(json_file_path, 'utf8');
    const datas = JSON.parse(json_data);


    // データベースのカラムに挿入するための準備
    const insert_columns = Object.keys(column_map).join(', ');
    const insert_placeholders = Object.keys(column_map).map(() => '?').join(', ');
    const insert_stmt = database.prepare(`INSERT INTO ${table_name} (${insert_columns}) VALUES (${insert_placeholders})`);
    
    const db_datas = await new Promise((resolve, reject) => {
        database.all(`SELECT * FROM ${table_name}`, [], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
    const update_stmt = database.prepare(`UPDATE ${table_name} SET ${Object.entries(column_map).map(([key, value]) => `${value} = ?`).join(', ')} WHERE ${column_map.id} = ?`);
    
    const json_ids = datas.map(task => task.id);
    const db_ids = db_datas.map(task => task.id);
    // 新しいデータを挿入
    for (const data of datas) {
        if (!db_ids.includes(data[column_map.id])) {
            try {
                const insert_values = Object.keys(column_map).map(key => data[key]);
                await new Promise((resolve, reject) => {
                    insert_stmt.run(...insert_values, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            } catch (err) {
                console.error(`Error inserting task with id ${data[column_map.id]}:`, err);
            }
        }
    }
    

    // 既存のデータを更新
    for (const data of datas) {
        if (db_ids.includes(data[column_map.id])) {
            try {
                const update_values = Object.keys(column_map).map(key => data[key]);
                await new Promise((resolve, reject) => {
                    update_stmt.run(...update_values, data[column_map.id], (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            } catch (err) {
                console.error(`Error updating task with id ${data[column_map.id]}:`, err);
            }
        }
    }
    

    // データベースに存在するがJSONに存在しないデータを削除
    for (const db_data of db_datas) {
        if (!json_ids.includes(db_data[column_map.id])) {
            try {
                await new Promise((resolve, reject) => {
                    database.run(`DELETE FROM ${table_name} WHERE ${column_map.id} = ?`, db_data[column_map.id], (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            } catch (err) {
                console.error(`Error deleting task with id ${db_data[column_map.id]}:`, err);
            }
        }
    }
    
    insert_stmt.finalize();
    update_stmt.finalize();

    console.log('New datas have been imported to the database.');
};

const get_new_datas = async (table_name, datas, database) => {
    if (!Array.isArray(datas)) {
        console.error('Data is not an array');
        return [];
    }

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
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // 各テーブルに対してデータベースに書き込む
    for (const tableName of tableNames) {
        try {
            await write_JSON_to_db(tableName);
        } catch (err) {
            console.error(`Error writing data to ${tableName}:`, err);
        }
    }
});