const express = require('express');
const HttpError = require('../models/http-error');

const Movie = require('../models/movie.model');
const Controller = require('../controllers/MovieHero')

const router = express.Router();

router.get('/movies', Controller.MovieHerro);
router.get('/load-movies', Controller.LoadMovie)


module.exports = router;