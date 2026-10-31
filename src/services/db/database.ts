import * as SQLite from 'expo-sqlite';

/**
 * SQLite Database Management Service
 * Initializes database instance and runs schema migrations.
 */

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const DB_NAME = 'habit_tracker.db';

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync(DB_NAME);
  }
  return dbInstance;
}

/**
 * Initialize Tables
 */
export async function initializeDatabase(): Promise<void> {
  const db = getDatabase();

  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT DEFAULT 'sparkles',
      category TEXT DEFAULT 'mindfulness',
      time_of_day TEXT DEFAULT 'anytime',
      frequency_type TEXT DEFAULT 'every_day',
      frequency_days TEXT DEFAULT '1,2,3,4,5,6,7',
      target_count INTEGER DEFAULT 1,
      unit TEXT DEFAULT 'times',
      created_at TEXT NOT NULL,
      archived INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      value INTEGER DEFAULT 0,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);
    CREATE INDEX IF NOT EXISTS idx_habit_logs_habit ON habit_logs(habit_id);
  `);
}

