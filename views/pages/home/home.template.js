const generateMovieCarousel = require("../../components/home/top5-rating")
const template = require("../../template")

module.exports = function Home({top5Rating, top15Box, top15Fav}) {
    let content = ""

    

    content += generateMovieCarousel(top5Rating) + " ";
    //  content += generateMovieCarousel(top15Box) + " ";
    //  content += generateMovieCarousel(top15Fav)+ " ";
   return template({content})
}