const { connect, disconnect } = require('../src/db');
const {
  getGamesBy3DS,
  getGamesBy3DSIn2011,
  getGamesBy3DSIn2011WithProjection,
  getTop3GamesBy3DSIn2011
} = require('../src/queries');

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});

describe('Console Games Queries', () => {
  describe('getGamesBy3DS', () => {
    it('should return all 3DS games', async () => {
      const results = await getGamesBy3DS();

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      results.forEach(game => {
        expect(game.Platform).toBe('3DS');
      });
    });
  });

  describe('getGamesBy3DSIn2011', () => {
    it('should return all 3DS games released in 2011', async () => {
      const results = await getGamesBy3DSIn2011();

      expect(Array.isArray(results)).toBe(true);

      results.forEach(game => {
        expect(game.Platform).toBe('3DS');
        expect(game.Year).toBe('2011');
      });
    });
  });

  describe('getGamesBy3DSIn2011WithProjection', () => {
    it('should return Name and Global_Sales only for 3DS games in 2011', async () => {
      const results = await getGamesBy3DSIn2011WithProjection();

      expect(Array.isArray(results)).toBe(true);

      results.forEach(game => {
        expect(game).toHaveProperty('Name');
        expect(game).toHaveProperty('Global_Sales');
        expect(game).not.toHaveProperty('_id');
        expect(game).not.toHaveProperty('Platform');
        expect(game).not.toHaveProperty('Year');
      });
    });
  });

  describe('getTop3GamesBy3DSIn2011', () => {
    it('should return top 3 best-selling 3DS games from 2011', async () => {
      const results = await getTop3GamesBy3DSIn2011();

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(3);

      results.forEach(game => {
        expect(game).toHaveProperty('Name');
        expect(game).toHaveProperty('Global_Sales');
        expect(game).not.toHaveProperty('_id');
      });

      if (results.length > 1) {
        for (let i = 0; i < results.length - 1; i++) {
          expect(results[i].Global_Sales).toBeGreaterThanOrEqual(results[i + 1].Global_Sales);
        }
      }
    });
  });
});
