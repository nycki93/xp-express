// https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application

import express from 'express';
import sqlite3 from 'sqlite3';
import ejs from 'ejs';

const app = express();
const db = new sqlite3.Database('sqlite.db', (err) => {
  if (err) return console.log(err.message);
  console.log('connected to database.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS pages (
    page_id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    views INTEGER
  );
`);
db.run(`
  INSERT INTO pages(page_id, url, views) 
  VALUES 
    (1, '/', 0),
    (2, '/about', 0)
  ON CONFLICT DO NOTHING;
`, (err) => err && console.log(err.message));

app.get('/', (req, res) => {
  db.run(`
    UPDATE pages
    SET views=views+1
    WHERE url=="/";
  `, err => err && console.log(err));
  db.get('SELECT * FROM pages WHERE url=="/"', async (err, page) => {
    if (err) {
      return console.log(err.message);
    } else {
      const body = await ejs.renderFile('views/index.ejs', { page });
      res.send(body);
    }
  });
});

app.listen(8080);
console.log('server on http://localhost:8080');
