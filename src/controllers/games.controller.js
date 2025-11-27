const gamesService = require('../services/games.service');

class GamesController {
  async getAllGames(req, res) {
    try {
      const games = await gamesService.getAllGames();
      res.json({ success: true, count: games.length, data: games });
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getGamesByPlatform(req, res) {
    try {
      const { platform } = req.params;
      const games = await gamesService.getGamesByPlatform(platform);
      res.json({ success: true, count: games.length, data: games });
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux par plateforme:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getGamesByPlatformAndYear(req, res) {
    try {
      const { platform, year } = req.params;
      const games = await gamesService.getGamesByPlatformAndYear(platform, year);
      res.json({ success: true, count: games.length, data: games });
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getTop3Games(req, res) {
    try {
      const { platform, year } = req.params;
      const games = await gamesService.getTop3GamesByPlatformAndYear(platform, year);
      res.json({ success: true, count: games.length, data: games });
    } catch (error) {
      console.error('Erreur lors de la récupération du top 3:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new GamesController();
