const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/games.controller');

router.get('/', gamesController.getAllGames.bind(gamesController));
router.get('/:platform', gamesController.getGamesByPlatform.bind(gamesController));
router.get('/:platform/:year', gamesController.getGamesByPlatformAndYear.bind(gamesController));
router.get('/:platform/:year/top3', gamesController.getTop3Games.bind(gamesController));

module.exports = router;
