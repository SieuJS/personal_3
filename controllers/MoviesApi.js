const Movie = require("../models/movie.model")
const HttpError = require('../models/http-error')

Movie.run();
 
module.exports = {
    async sendAll (req, res, next) {
        let Movies;
        
        try{
        Movies = await  Movie.getAll();
        }
        catch {
            return next(new HttpError("Fail to get films", 404));
        }
        res.json(Movies)
    },
    async top5 (req,res,next) {
        let Movies;
        try{
            Movies = await Movie.getTop5ratings()
        }
        catch (err) {
            return next(new HttpError("Can not get" + err.message, 500))
        }
        res.json(Movies)
    }
}