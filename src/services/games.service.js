const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'consolegame';

class GamesService {
  getAllGames(limit = 100) {
    const db = getDb();
    return db.collection(COLLECTION_NAME).find().sort({ _id: -1 }).limit(limit).toArray();
  }

  getGamesByPlatform(platform) {
    const db = getDb();
    return db.collection(COLLECTION_NAME).find({ Platform: platform }).toArray();
  }

  getGamesByPlatformAndYear(platform, year) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .find({ Platform: platform, Year: year })
      .toArray();
  }

  getTop3GamesByPlatformAndYear(platform, year) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .find(
        { Platform: platform, Year: year },
        { projection: { Name: 1, Global_Sales: 1, Platform: 1, Year: 1, Genre: 1, Publisher: 1, _id: 1 } }
      )
      .sort({ Global_Sales: -1 })
      .limit(3)
      .toArray();
  }

  async createGame(gameData) {
    const db = getDb();

    const game = {
      Name: gameData.Name,
      Platform: gameData.Platform,
      Year: gameData.Year,
      Genre: gameData.Genre,
      Publisher: gameData.Publisher,
      NA_Sales: parseFloat(gameData.NA_Sales) || 0,
      EU_Sales: parseFloat(gameData.EU_Sales) || 0,
      JP_Sales: parseFloat(gameData.JP_Sales) || 0,
      Other_Sales: parseFloat(gameData.Other_Sales) || 0,
      Global_Sales: parseFloat(gameData.Global_Sales) || 0
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(game);
    return result;
  }

  async updateGame(id, gameData) {
    const db = getDb();

    const updateData = {
      Name: gameData.Name,
      Platform: gameData.Platform,
      Year: gameData.Year,
      Genre: gameData.Genre,
      Publisher: gameData.Publisher,
      NA_Sales: parseFloat(gameData.NA_Sales) || 0,
      EU_Sales: parseFloat(gameData.EU_Sales) || 0,
      JP_Sales: parseFloat(gameData.JP_Sales) || 0,
      Other_Sales: parseFloat(gameData.Other_Sales) || 0,
      Global_Sales: parseFloat(gameData.Global_Sales) || 0
    };

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return result;
  }

  async deleteGame(id) {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(id)
    });
    return result;
  }

  async getGameById(id) {
    const db = getDb();
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  }
}

module.exports = new GamesService();
