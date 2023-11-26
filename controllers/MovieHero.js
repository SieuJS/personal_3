const Movie = require("../models/movie.model")
const HttpError = require('../models/http-error')


module.exports = {
    async MovieHerro (req, res, next) {
        const movies = await Movie.getAll();
        res.json({movies});
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
    }
}