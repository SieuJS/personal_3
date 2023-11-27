const express = require('express');
const HttpError = require('../models/http-error');


const Controller = require('../controllers/MovieHero')
const ApiController = require('../controllers/MoviesApi')
const router = express.Router();

router.get('/api/movies', ApiController.sendAll);
router.get('/api/top5',ApiController.top5);
router.get('/api/top15-box',ApiController.top15BoxOffice)

router.get('/', Controller.Home);
router.get('/movies', Controller.MovieHerro);
router.get('/load-movies', Controller.LoadMovie)



module.exports = router;