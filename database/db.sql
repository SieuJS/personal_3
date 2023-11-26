--Create database 

create table movies(
    id varchar(11) primary key,
    title char(100),
    "year" int,
    "runtimemins" int,
    image char(200)
);

create table director_with_movies (
    id_movie varchar(11),
    id_director varchar(11),
    "name" char(100),
    Constraint fk_directory foreign key (id_movie) references movies(id),
    primary key (id_movie, id_director)
) ;