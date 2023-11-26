const db = require('../database/db')
const getMoviesData= require ('../database/data');
const tbName = "movies"



module.exports = class Movie {
    constructor ({id , title, year , runtimeStr, image, awards, rating}){
        this.id  = id; 
        this.title = title ;
        this.year = year;
        this.runtimeStr = runtimeStr;
        this.image = image ;
        this.awards = awards;
        this.rating = rating;
    }
    static async run () {
        await db.initial();
        
        let isInsert = await db.isInsert(tbName);
        if(!isInsert)
        {
            console.log('Importing...')
        let {Movies} = await getMoviesData()
        
        const uniqueMovies = Movies.reduce((unique, movie) => {
            const existingMovie = unique.find((m) => m.id.trim() === movie.id.trim());
            if (!existingMovie) {
                unique.push(movie);
            }
            return unique;
        }, []);
        await this.insertAll(uniqueMovies)
        }
    }

    static async insert (movie) {
        const rs = await db.insert(tbName, movie);
        return rs ; 
    }

    static async insertAll (uniqueMovies) {
        for(let mov of uniqueMovies) {
            
            let transMovie = new Movie({
                id : mov.id,
                title : mov.title,
                year : parseInt(mov.year),
                image : mov.image,
                runtimeStr: mov.runtimeStr,
                awards : mov.awards ,
                rating : isNaN(parseFloat(mov.imDbRating)) ?  0 : parseFloat(mov.imDbRating)
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

    static async getTop5ratings() {
        let client = db.client;
        let dbcn = null;
        try {
            dbcn = await client.connect();
            const data = await dbcn.any(`SELECT * FROM $1:alias ORDER BY rating DESC LIMIT 5;
            `, [`${tbName}`]);
            return data;
        }
        catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    }

}