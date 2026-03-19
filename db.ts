import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any; // global db instance

export const initDB = async () => {
  db = await open({
    filename: './cloudsafe.db',
    driver: sqlite3.Database
  });

  // create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT,
      type TEXT,
      config TEXT,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER,
      severity TEXT,
      description TEXT,
      timestamp TEXT,
      status TEXT
    );
  `);

  console.log("✅ Database connected");

  return db;
};

// ✅ THIS IS IMPORTANT (fix)
export default db;