const { as } = require('pg-promise');
const HttpError = require('../models/http-error')
require ('dotenv').config();

const pgp = require ('pg-promise')(
    {
        capSQL : true
    }
);

const cn = {
    host : process.env.HOST,
    port : process.env.DB_PORT,
    database : process.env.DB_DB,
    user : process.env.DB_USER,
    password : process.env.DB_PW,
    max : 30
}
let inserted = false;

const databaseName = "db21321";

let db = pgp(cn);
let createDbSuccess = false;



const createDB = async () => {
    let dbcn = null;
    try {
        dbcn = await db.connect();        
        // Attempt to create the database
        await dbcn.any("CREATE DATABASE $1:name;", [databaseName]);
        
        
        db = pgp({
            ...cn ,
            database : databaseName
        });
        console.log("create db succes")
        await createShema(db);
    } catch (error) {
        let err = error.message
        
        // Throw an error or handle this case appropriately
    } finally {
        if (dbcn) {
            dbcn.done();
        }
    }
};




const errHandler = async (err) => {
    if(err.includes('exists')){
        let dbcn = null;
        let mcn = {
            ...cn,
            database : process.env.DB_DB
        }
        db = pgp(mcn)
        try {
            dbcn = await db.connect();
            await dbcn.any("DROP DATABASE $1:name;", [databaseName]);
            
            await createDB();            
        }catch (error) {
            console.error('Error creating database:', error.message);
            let err = error.message
            // Throw an error or handle this case appropriately
        } finally {
            if (dbcn) {
                dbcn.done();
            }
        }
    }
}

let schema = {
    Movies : "Movies",
    Names : "Names" ,
    Reviews : "Reviews",
    Actors_with_Movies : "Actors_with_Movies",
    Directors_with_Movies : "Directors_with_Movies",
    Favorites : "Favorites"
}

const createShema = async (db) => {
    let dbcn = null;
    
    try {
        dbcn = await db.connect();
        await dbcn.any(`Create table ${schema.Movies}(
            id varchar(11) primary key, 
            title char(200), 
            "year" int,
            "runtimeStr" char(12),
            image char(200),
            awards char(200),
            rating float,
            boxOffice BigInt
            );`);
        
        await dbcn.oneOrNone(`
            Create table ${schema.Names}(
                id varchar(11) primary key,
                name char(100),
                image char(200),
                sumary char(700),
                birthdate date,
                awards char(100)
            )
        `)

        await dbcn.oneOrNone(`
                Create table ${schema.Reviews}(
                    movieId varchar(11) primary key,
                    username char(40) ,
                    warningSpoiler boolean ,
                    date date,
                    rate int,
                    title char(200),
                    content char (700)
                );
        `)

        await dbcn.oneOrNone(`
            Create table ${schema.Actors_with_Movies}(
                movieId varchar(11) ,
                actorId varchar(11),
                Primary key (movieID, actorId)
            );
        `)

        await dbcn.oneOrNone(`
            Create table ${schema.Directors_with_Movies}(
                movieId varchar(11) ,
                directorId varchar(11),
                Primary key (movieID, directorId)
            );
        `)

        await dbcn.oneOrNone(`
            Create table ${schema.Favorites}(
                movieId varchar(11),
                Primary key (movieId)
            );
        `);
        
    }catch (err){
        throw new Error("table" +err.message);
    }finally{
        if (dbcn) {
            dbcn.done();
        }
    }
}


module.exports = {
    initial : async () =>{
        await createDB();
    },
    client : pgp({
        ...cn,
        database : databaseName
    }),
    isInsert : async (tbName) => {
        
        db = pgp({
            ...cn,
            database : databaseName
        });
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any("SELECT * FROM $1:alias LIMIT 5", [`${tbName}`]);
            if(data.length === 0) {
                return false;
            }
            else return true;
        }
        catch (error) {
            return false;
            throw new HttpError(error.message, 500);
        }
        finally {
            if(dbcn !== null)
            dbcn.done();
        }
    },
    getAll : async (tbName) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.query("SELECT * FROM $1:alias ", [`${tbName}`]);


            return data;
        }
        catch (error) {
            throw new HttpError(error.message, 500);
        }
        finally {
            dbcn.done();
        }
    }, 
    insert : async (tbName, entity) => {
        const query = await pgp.helpers.insert(entity, null, tbName);
        inserted = true;
        const data = await db.one(query + 'RETURNING id');
        return data;
    },
    getTop5 : async () =>{
        cn.database = databaseName;
        db = pgp(cn);
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any(`SELECT * FROM $1:alias ORDER BY rating DESC LIMIT 5;
            `, [`${tbName}`]);
            return data;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            dbcn.done();
        }
    },
    findById : async (tbName, id) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.one("SELECT * FROM $1:alias WHERE id = $2", [`${tbName}`, `${id}`]);

            return data;
        }
        catch (error) {
            throw new HttpError(error.message, 404);
        }
        finally {
            dbcn.done();
        }
    },
    findByName : async (tbName, namePattern) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any("SELECT * FROM $1:alias WHERE first_name like $2 or last_name like $2", [`${tbName}`, `%${namePattern}%`]);
   
            return data;
        }
        catch (error) {
            throw new HttpError(error.message, 404);
        }
        finally {
            dbcn.done();
        }
    }
}