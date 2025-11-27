const { getDb } = require('./config/db');

const COLLECTION_NAME = 'consolegame';

async function getGamesBy3DS() {
  const db = getDb();
  const collection = db.collection(COLLECTION_NAME);

  return await collection.find({ Platform: "3DS" }).toArray();
}

async function getGamesBy3DSIn2011() {
  const db = getDb();
  const collection = db.collection(COLLECTION_NAME);

  return await collection.find({
    Platform: "3DS",
    Year: "2011"
  }).toArray();
}

async function getGamesBy3DSIn2011WithProjection() {
  const db = getDb();
  const collection = db.collection(COLLECTION_NAME);

  return await collection.find(
    {
      Platform: "3DS",
      Year: "2011"
    },
    {
      projection: {
        Name: 1,
        Global_Sales: 1,
        _id: 0
      }
    }
  ).toArray();
}

async function getTop3GamesBy3DSIn2011() {
  const db = getDb();
  const collection = db.collection(COLLECTION_NAME);

  return await collection.find(
    {
      Platform: "3DS",
      Year: "2011"
    },
    {
      projection: {
        Name: 1,
        Global_Sales: 1,
        _id: 0
      }
    }
  )
  .sort({ Global_Sales: -1 })
  .limit(3)
  .toArray();
}

module.exports = {
  getGamesBy3DS,
  getGamesBy3DSIn2011,
  getGamesBy3DSIn2011WithProjection,
  getTop3GamesBy3DSIn2011
};
