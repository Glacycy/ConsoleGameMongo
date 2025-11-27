const gamesController = require('../../src/controllers/games.controller');
const gamesService = require('../../src/services/games.service');

jest.mock('../../src/services/games.service');

describe('Games Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('getAllGames', () => {
    it('should return JSON with all games', async () => {
      const mockGames = [
        { Name: 'Game 1', Platform: 'PS4', Global_Sales: 10 },
        { Name: 'Game 2', Platform: 'Xbox', Global_Sales: 5 }
      ];

      gamesService.getAllGames.mockResolvedValue(mockGames);

      await gamesController.getAllGames(req, res);

      expect(gamesService.getAllGames).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockGames.length,
        data: mockGames
      });
    });

    it('should return error JSON when service fails', async () => {
      const errorMessage = 'Database error';
      gamesService.getAllGames.mockRejectedValue(new Error(errorMessage));

      await gamesController.getAllGames(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage
      });
    });
  });

  describe('getGamesByPlatform', () => {
    it('should return JSON with games filtered by platform', async () => {
      const platform = '3DS';
      const mockGames = [
        { Name: 'Game 1', Platform: '3DS' },
        { Name: 'Game 2', Platform: '3DS' }
      ];

      req.params.platform = platform;
      gamesService.getGamesByPlatform.mockResolvedValue(mockGames);

      await gamesController.getGamesByPlatform(req, res);

      expect(gamesService.getGamesByPlatform).toHaveBeenCalledWith(platform);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockGames.length,
        data: mockGames
      });
    });

    it('should return error JSON when service fails', async () => {
      const errorMessage = 'Platform not found';
      req.params.platform = '3DS';
      gamesService.getGamesByPlatform.mockRejectedValue(new Error(errorMessage));

      await gamesController.getGamesByPlatform(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage
      });
    });
  });

  describe('getGamesByPlatformAndYear', () => {
    it('should return JSON with games filtered by platform and year', async () => {
      const platform = '3DS';
      const year = '2011';
      const mockGames = [
        { Name: 'Game 1', Platform: '3DS', Year: '2011' }
      ];

      req.params = { platform, year };
      gamesService.getGamesByPlatformAndYear.mockResolvedValue(mockGames);

      await gamesController.getGamesByPlatformAndYear(req, res);

      expect(gamesService.getGamesByPlatformAndYear).toHaveBeenCalledWith(platform, year);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockGames.length,
        data: mockGames
      });
    });

    it('should return error JSON when service fails', async () => {
      const errorMessage = 'Query failed';
      req.params = { platform: '3DS', year: '2011' };
      gamesService.getGamesByPlatformAndYear.mockRejectedValue(new Error(errorMessage));

      await gamesController.getGamesByPlatformAndYear(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage
      });
    });
  });

  describe('getTop3Games', () => {
    it('should return JSON with top 3 games by platform and year', async () => {
      const platform = '3DS';
      const year = '2011';
      const mockGames = [
        { Name: 'Game 1', Global_Sales: 10 },
        { Name: 'Game 2', Global_Sales: 8 },
        { Name: 'Game 3', Global_Sales: 5 }
      ];

      req.params = { platform, year };
      gamesService.getTop3GamesByPlatformAndYear.mockResolvedValue(mockGames);

      await gamesController.getTop3Games(req, res);

      expect(gamesService.getTop3GamesByPlatformAndYear).toHaveBeenCalledWith(platform, year);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockGames.length,
        data: mockGames
      });
    });

    it('should return error JSON when service fails', async () => {
      const errorMessage = 'Top 3 query failed';
      req.params = { platform: '3DS', year: '2011' };
      gamesService.getTop3GamesByPlatformAndYear.mockRejectedValue(new Error(errorMessage));

      await gamesController.getTop3Games(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage
      });
    });
  });
});
