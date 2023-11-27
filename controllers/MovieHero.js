const Movie = require("../models/movie.model")
const HttpError = require('../models/http-error')
const getMoviesData = require('../database/data')
const MovieHomeTemplate =  require('../views/pages/home/home.template')
require ('dotenv').config();
const PORT = process.env.PORT;
module.exports = {
    
    async Home (req, res, next) {
        let top15Box , top5Rating, top15Fav;
        
        try{
            top15Box= await fetch(`http://localhost:${PORT}/api/top15-box`);
            top5Rating = await fetch(`http://localhost:${PORT}/api/top5`)
            top15Fav = []
            if (!top15Box.ok || !top5Rating.ok) {
                throw new Error('Failed to fetch data');
            }
            top15Box = await top15Box.json();
            top5Rating = await top5Rating.json();
        }
        catch (err){
            return next(new HttpError(err.message, 500));
        }
        res.send(MovieHomeTemplate({top5Rating,top15Box,top15Fav}))
    },

    async MovieHerro (req, res, next) {
        let response , Movies
        try{
            response= await fetch(`http://localhost:${PORT}/api/movies`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            Movies = await response.json();
        }
        catch (err){
            return next(new HttpError(err.message, 500));
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