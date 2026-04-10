const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("transactions.db");

db.run(`
CREATE TABLE IF NOT EXISTS transactions (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 sender TEXT,
 receiver TEXT,
 amount REAL
)
`);

module.exports = db;