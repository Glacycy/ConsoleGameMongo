const { MongoClient } = require('mongodb');

const URL = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'consolegame';

let client = null;
let db = null;

async function connect() {
  if (db) {
    return db;
  }

  client = new MongoClient(URL, {
    directConnection: true,
    serverSelectionTimeoutMS: 5000
  });

  await client.connect();
  db = client.db(DB_NAME);

  return db;
}

async function disconnect() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not connected. Call connect() first.');
  }
  return db;
}

module.exports = {
  connect,
  disconnect,
  getDb
};
