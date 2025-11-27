const { MongoClient } = require('mongodb');

const URL = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'consolegame';

let client = null;
let db = null;

async function initializeLivreCollection() {
  const collections = await db.listCollections({ name: 'livre' }).toArray();

  if (collections.length === 0) {
    await db.createCollection('livre', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['titre', 'auteur', 'année'],
          properties: {
            titre: {
              bsonType: 'string',
              description: 'titre doit être une chaîne de caractères et est requis'
            },
            auteur: {
              bsonType: 'string',
              minLength: 1,
              description: 'auteur doit être une chaîne non vide et est requis'
            },
            année: {
              bsonType: 'int',
              minimum: 1901,
              description: 'année doit être un entier supérieur à 1900 et est requis'
            },
            genre: {
              bsonType: 'string',
              description: 'genre est optionnel mais doit être une chaîne si présent'
            }
          }
        }
      }
    });

    await db.collection('livre').createIndex({ titre: 1 }, { unique: true });
  } else {
    try {
      await db.collection('livre').createIndex({ titre: 1 }, { unique: true });
    } catch (error) {
      if (error.code === 11000) {
        console.warn('Warning: Cannot create unique index on titre because duplicate values exist. Please clean the collection.');
      } else if (error.message && error.message.includes('already exists')) {
        // Index already exists, ignore
      } else {
        throw error;
      }
    }
  }
}

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

  await initializeLivreCollection();

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
