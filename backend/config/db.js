const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let memoryDb;
let isReady = false;

async function init() {
    console.log("Initializing SQLite Local Database...");
    memoryDb = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    // Run schema
    await memoryDb.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS exit_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            reason TEXT NOT NULL,
            leave_date TEXT NOT NULL,
            leave_time TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS qr_passes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id INTEGER NOT NULL,
            token_hash TEXT NOT NULL,
            generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            validity_status TEXT DEFAULT 'Valid',
            FOREIGN KEY (request_id) REFERENCES exit_requests(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS exit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            qr_id INTEGER NOT NULL,
            scan_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            type TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (qr_id) REFERENCES qr_passes(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS parent_settings (
            parent_id INTEGER PRIMARY KEY,
            requires_approval BOOLEAN DEFAULT 1,
            FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS system_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        INSERT OR IGNORE INTO system_settings (key, value) VALUES ('parent_permission_required', 'true');
    `);
    
    console.log('Connected to Local SQLite Database successfully!');
    isReady = true;
}

init().catch(err => console.error("SQLite Init Error:", err));

module.exports = {
    execute: async (query, params = []) => {
        // Wait for db to initialize if hit too fast
        while (!isReady) {
            await new Promise(r => setTimeout(r, 50));
        }
        
        const isSelect = query.trim().toUpperCase().startsWith('SELECT');
        if (isSelect) {
            const rows = await memoryDb.all(query, params);
            return [rows, null]; // Mimic mysql2 [rows, fields]
        } else {
            const result = await memoryDb.run(query, params);
            return [{ insertId: result.lastID, affectedRows: result.changes }, null];
        }
    }
};
