const { connect, disconnect } = require('../../src/config/db');
const gamesService = require('../../src/services/games.service');

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});

describe('Games Service', () => {
  describe('getAllGames', () => {
    it('should return all games with default limit', async () => {
      const games = await gamesService.getAllGames();

      expect(Array.isArray(games)).toBe(true);
      expect(games.length).toBeGreaterThan(0);
      expect(games.length).toBeLessThanOrEqual(100);

      if (games.length > 0) {
        expect(games[0]).toHaveProperty('Name');
        expect(games[0]).toHaveProperty('Platform');
      }
    });

    it('should respect custom limit', async () => {
      const games = await gamesService.getAllGames(5);

      expect(Array.isArray(games)).toBe(true);
      expect(games.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getGamesByPlatform', () => {
    it('should return only games for specified platform', async () => {
      const platform = '3DS';
      const games = await gamesService.getGamesByPlatform(platform);

      expect(Array.isArray(games)).toBe(true);

      games.forEach(game => {
        expect(game.Platform).toBe(platform);
      });
    });

    it('should return empty array for non-existent platform', async () => {
      const games = await gamesService.getGamesByPlatform('FAKE_PLATFORM_XYZ');

      expect(Array.isArray(games)).toBe(true);
      expect(games.length).toBe(0);
    });
  });

  describe('getGamesByPlatformAndYear', () => {
    it('should return games matching both platform and year', async () => {
      const platform = '3DS';
      const year = '2011';
      const games = await gamesService.getGamesByPlatformAndYear(platform, year);

      expect(Array.isArray(games)).toBe(true);

      games.forEach(game => {
        expect(game.Platform).toBe(platform);
        expect(game.Year).toBe(year);
      });
    });
  });

  describe('getTop3GamesByPlatformAndYear', () => {
    it('should return top 3 games sorted by Global_Sales', async () => {
      const platform = '3DS';
      const year = '2011';
      const games = await gamesService.getTop3GamesByPlatformAndYear(platform, year);

      expect(Array.isArray(games)).toBe(true);
      expect(games.length).toBeLessThanOrEqual(3);

      games.forEach(game => {
        expect(game).toHaveProperty('Name');
        expect(game).toHaveProperty('Global_Sales');
      });

      if (games.length > 1) {
        for (let i = 0; i < games.length - 1; i++) {
          expect(games[i].Global_Sales).toBeGreaterThanOrEqual(games[i + 1].Global_Sales);
        }
      }
    });
  });

  describe('createGame', () => {
    let createdGameId;

    afterEach(async () => {
      if (createdGameId) {
        await gamesService.deleteGame(createdGameId);
        createdGameId = null;
      }
    });

    it('should create a new game', async () => {
      const gameData = {
        Name: 'Test Game',
        Platform: 'TEST',
        Year: '2023',
        Genre: 'Action',
        Publisher: 'Test Publisher',
        NA_Sales: '1.5',
        EU_Sales: '2.0',
        JP_Sales: '0.5',
        Other_Sales: '0.3',
        Global_Sales: '4.3'
      };

      const result = await gamesService.createGame(gameData);

      expect(result).toHaveProperty('insertedId');
      expect(result.acknowledged).toBe(true);

      createdGameId = result.insertedId.toString();

      const createdGame = await gamesService.getGameById(createdGameId);
      expect(createdGame).toBeDefined();
      expect(createdGame.Name).toBe('Test Game');
      expect(createdGame.Platform).toBe('TEST');
      expect(createdGame.NA_Sales).toBe(1.5);
    });

    it('should parse sales values as floats', async () => {
      const gameData = {
        Name: 'Test Game Parse',
        Platform: 'TEST',
        Year: '2023',
        Genre: 'Action',
        Publisher: 'Test Publisher',
        NA_Sales: '1.5',
        EU_Sales: '2',
        JP_Sales: 'invalid',
        Other_Sales: '',
        Global_Sales: '4.3'
      };

      const result = await gamesService.createGame(gameData);
      createdGameId = result.insertedId.toString();

      const createdGame = await gamesService.getGameById(createdGameId);
      expect(createdGame.NA_Sales).toBe(1.5);
      expect(createdGame.EU_Sales).toBe(2);
      expect(createdGame.JP_Sales).toBe(0);
      expect(createdGame.Other_Sales).toBe(0);
    });
  });

  describe('updateGame', () => {
    let testGameId;

    beforeEach(async () => {
      const gameData = {
        Name: 'Game To Update',
        Platform: 'TEST',
        Year: '2023',
        Genre: 'Action',
        Publisher: 'Test Publisher',
        NA_Sales: '1.0',
        EU_Sales: '1.0',
        JP_Sales: '1.0',
        Other_Sales: '1.0',
        Global_Sales: '4.0'
      };

      const result = await gamesService.createGame(gameData);
      testGameId = result.insertedId.toString();
    });

    afterEach(async () => {
      if (testGameId) {
        await gamesService.deleteGame(testGameId);
        testGameId = null;
      }
    });

    it('should update an existing game', async () => {
      const updateData = {
        Name: 'Updated Game Name',
        Platform: 'UPDATED',
        Year: '2024',
        Genre: 'RPG',
        Publisher: 'Updated Publisher',
        NA_Sales: '5.0',
        EU_Sales: '5.0',
        JP_Sales: '5.0',
        Other_Sales: '5.0',
        Global_Sales: '20.0'
      };

      const result = await gamesService.updateGame(testGameId, updateData);

      expect(result.modifiedCount).toBe(1);

      const updatedGame = await gamesService.getGameById(testGameId);
      expect(updatedGame.Name).toBe('Updated Game Name');
      expect(updatedGame.Platform).toBe('UPDATED');
      expect(updatedGame.NA_Sales).toBe(5.0);
    });
  });

  describe('deleteGame', () => {
    it('should delete a game', async () => {
      const gameData = {
        Name: 'Game To Delete',
        Platform: 'TEST',
        Year: '2023',
        Genre: 'Action',
        Publisher: 'Test Publisher',
        NA_Sales: '1.0',
        EU_Sales: '1.0',
        JP_Sales: '1.0',
        Other_Sales: '1.0',
        Global_Sales: '4.0'
      };

      const createResult = await gamesService.createGame(gameData);
      const gameId = createResult.insertedId.toString();

      const deleteResult = await gamesService.deleteGame(gameId);

      expect(deleteResult.deletedCount).toBe(1);

      const deletedGame = await gamesService.getGameById(gameId);
      expect(deletedGame).toBeNull();
    });
  });

  describe('getGameById', () => {
    let testGameId;

    beforeEach(async () => {
      const gameData = {
        Name: 'Game To Find',
        Platform: 'TEST',
        Year: '2023',
        Genre: 'Action',
        Publisher: 'Test Publisher',
        NA_Sales: '1.0',
        EU_Sales: '1.0',
        JP_Sales: '1.0',
        Other_Sales: '1.0',
        Global_Sales: '4.0'
      };

      const result = await gamesService.createGame(gameData);
      testGameId = result.insertedId.toString();
    });

    afterEach(async () => {
      if (testGameId) {
        await gamesService.deleteGame(testGameId);
        testGameId = null;
      }
    });

    it('should find a game by ID', async () => {
      const game = await gamesService.getGameById(testGameId);

      expect(game).toBeDefined();
      expect(game.Name).toBe('Game To Find');
      expect(game.Platform).toBe('TEST');
    });

    it('should return null for non-existent ID', async () => {
      const game = await gamesService.getGameById('507f1f77bcf86cd799439011');

      expect(game).toBeNull();
    });
  });
});
