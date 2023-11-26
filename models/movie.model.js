const db = require('../database/db')
const {Movies} = require ('../database/data');
const tbName = "movies"

const uniqueMovies = Movies.reduce((unique, movie) => {
    const existingMovie = unique.find((m) => m.id === movie.id);
    if (!existingMovie) {
        unique.push(movie);
    }
    return unique;
}, []);

module.exports = class Movie {
    constructor ({id , title, year , runtimeMins, image}){
        this.id  = id; 
        this.title = title ;
        this.year = year;
        this.runtimemins = runtimeMins;
        this.image = image ;
    }
    static async run () {
        console.log(Movies)
    }

    static async insert (movie) {
        const rs = await db.insert(tbName, movie);
        return rs ; 
    }

    static async insertAll () {
        for(let mov of uniqueMovies) {
            
            let transMovie = new Movie({
                id : mov.id,
                title : mov.title,
                year : parseInt(mov.year),
                image : mov.image,
                runtimeMins: parseInt(mov.runtimeMins)
            });
            try{
                await this.insert(transMovie)
            }
            catch (err){
                console.log(err)
                throw err;
            }
        }
    }

    static async getAll () {
        const data = await db.getAll(tbName);
        return data;
    }

}