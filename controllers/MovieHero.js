const Movie = require("../models/movie.model")
const HttpError = require('../models/http-error')
const getMoviesData = require('../database/data')
const MovieHomeTemplate =  require('../views/pages/home/home.template')


module.exports = {
    async Home (req, res, next) {
        res.send(MovieHomeTemplate())
    },

    async MovieHerro (req, res, next) {
        let response , Movies
        try{
            response= await fetch("http://localhost:3000/api/movies");
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            Movies = await response.json();
        }
        catch (err){
            throw err;
        }
        res.json(Movies)
    },
    async LoadMovie ( req, res, next){
        try{
        
        await Movie.insertAll();
        console.log('Load Done')
        }
        catch(err) {
            return new HttpError(err.message, 500);
        }
        res.json({message : "Load"});
    },
    async sendMovies (req, res, next) {
        let Movies;
        await Movie.run();
        try{
        Movies = await  Movie.getAll();
        }
        catch {
            return next(new HttpError("Fail to get films", 404));
        }
        res.json(Movies)
    }
}