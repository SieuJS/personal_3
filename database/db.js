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

const databaseName = "MoviesWebsite";

let db = pgp(cn);
let createDbSuccess = false;



const createDB = async () => {
    let dbcn = null;
    try {
        dbcn = await db.connect();        
        // Attempt to create the database
        await dbcn.any("CREATE DATABASE $1:name;", [databaseName]);
        console.log('Database created successfully');
        cn.database = databaseName;
        console.log("Change db to " ,databaseName);
        db = pgp(cn);
        createDbSuccess = true;
        await createShema();
    } catch (error) {
        console.error('Error creating database:', error.message);
        let err = error.message
        console.log("handling error:")
        await errHandler(err);
        // Throw an error or handle this case appropriately
    } finally {
        if (dbcn) {
            dbcn.done();
            console.log('Connection closed');
        }
    }
};

createDB();


const errHandler = async (err) => {
    if(err.includes('exists')){
        let dbcn = null;
        try {
            dbcn = await db.connect();
            await dbcn.any("DROP DATABASE $1:name;", [databaseName]);
            console.log('DROP Database successfully');
            await createDB();            
        }catch (error) {
            console.error('Error creating database:', error.message);
            let err = error.message
            // Throw an error or handle this case appropriately
        } finally {
            if (dbcn) {
                dbcn.done();
                console.log('Connection closed');
            }
        }
    }
}

let schema = {
    Movies : "Movies",
    Names : "Names" ,
    Reviews : "Reviews",
    Actors_with_Movies : "Actors_with_Movies",
    Directors_with_Movies : "Directors_with_Movies"
}

const createShema = async () => {
    let dbcn = null;
    

    try {
        dbcn = await db.connect();
        await dbcn.any(`Create table ${schema.Movies}(
            id char(11) primary key, 
            title char(200), 
            "year" int,
            "runtimeStr" char(12),
            image char(200),
            award char(200)
            );`);
        
        await dbcn.oneOrNone(`
            Create table ${schema.Names}(
                id char(11) primary key,
                name char(100),
                image char(200),
                sumary char(700),
                birthdate date,
                awart char(100)
            )
        `)

        await dbcn.oneOrNone(`
                Create table ${schema.Reviews}(
                    movieId char(11) primary key,
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
                movieId char(11) ,
                actorId char(11),
                Primary key (movieID, actorId)
            );
        `)

        await dbcn.oneOrNone(`
            Create table ${schema.Directors_with_Movies}(
                movieId char(11) ,
                directorId char(11),
                Primary key (movieID, directorId)
            );
        `)
        console.log("create table Movies success")
    }catch (err){
        throw new Error("table" +err.message);
    }finally{
        if (dbcn) {
            dbcn.done();
        }
        pgp.end(); // Close the global connection pool
    }
}


module.exports = {
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
        const data = await db.one(query + 'RETURNING id');
        return data;
    },
    search : async (tbname, searchString) => {
        
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
            console.log(data)
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