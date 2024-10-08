import Sqlite3 from 'sqlite3';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { FRONTEND_URL } from '../constants';
import cors from 'cors'

Sqlite3.verbose();

Sqlite3.Database.prototype.allAsync = function (sql, params) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

Sqlite3.Database.prototype.getAsync = function (sql, params) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

Sqlite3.Database.prototype.runAsync = function (sql, params) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const server = http.createServer();
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

const db = new Sqlite3.Database(path.resolve('src', 'database', 'db', 'dartsapp.db'), (err) => {
  if (err) {
    console.log('Database connection error!');
    process.exit(1);
  } else {
    console.log('Db connection successful');
  }
});
export { server, io, db };