// db.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// データベースファイルの作成または接続
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// テーブルの作成（存在しない場合）
db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    description TEXT NULL
)`, (err) => {
if (err) {
    console.error('Error creating table:', err);
    return;
}
});

module.exports = db;