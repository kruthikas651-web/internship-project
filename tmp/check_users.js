const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function checkUsers() {
    const db = await open({
        filename: './backend/database.sqlite',
        driver: sqlite3.Database
    });

    const rows = await db.all('SELECT name, email, role FROM users');
    console.log(JSON.stringify(rows, null, 2));
    await db.close();
}

checkUsers().catch(console.error);
