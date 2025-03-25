import sqlite3 from 'sqlite3';
import logger from './loggerService';

export class CacheManager {
  private db: sqlite3.Database;

  constructor() {
    // Abre o crea la base de datos
    this.db = new sqlite3.Database('./cookies.db', (err) => {
      if (err) {
        logger.error('Error opening database:', err);
        throw new Error('Database connection failed');
      } else {
        logger.info('Database opened successfully');
      }
    });

    // Crear la tabla si no existe
    this.db.run(
      `CREATE TABLE IF NOT EXISTS cookies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        cookie_key TEXT NOT NULL,
        cookie_value TEXT NOT NULL,
        domain TEXT NOT NULL,
        path TEXT NOT NULL,
        secure INTEGER NOT NULL,
        httpOnly INTEGER NOT NULL,
        sameSite TEXT NOT NULL
      )`,
      (err) => {
        if (err) {
          logger.error('Error creating table:', err);
          throw new Error('Failed to create table');
        }
      }
    );
  }

  async get<T>(username: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM cookies WHERE username = ?`,
        [username],
        (err, rows) => {
          if (err) {
            reject(new Error('Error fetching cookies'));
          } else {
            resolve(rows.length > 0 ? (rows as T) : null);
          }
        }
      );
    });
  }

  async set(username: string, cookies: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(
        `INSERT INTO cookies (username, cookie_key, cookie_value, domain, path, secure, httpOnly, sameSite)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );

      cookies.forEach((cookie) => {
        stmt.run(
          username,
          cookie.key,
          cookie.value,
          cookie.domain,
          cookie.path,
          cookie.secure ? 1 : 0,
          cookie.httpOnly ? 1 : 0,
          cookie.sameSite
        );
      });

      stmt.finalize((err) => {
        if (err) {
          reject(new Error('Error finalizing the insert'));
        } else {
          resolve();
        }
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        logger.error('Error closing the database:', err);
      } else {
        logger.info('Database closed');
      }
    });
  }
}
