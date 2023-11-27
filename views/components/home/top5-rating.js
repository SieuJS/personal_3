function generateMovieCarousel(movies) {
    const carouselIndicators = movies.map((_, index) => `<button type = "button" data-bs-target="#carouselExampleIndicators" data-slide-to="${index}"${index === 0 ? ' class="active" aria-current ="true"' : ''} arial-lable = "Slide ${index+1}"></button>`).join('\n');
  
    const carouselItems = movies.map((movie, index) => `
      <div class="carousel-item${index === 0 ? ' active' : ''} d-flex justify-content-center">
        <img src="${movie.image.trim()}" class="d-block carousel-img" alt="${movie.title}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${movie.title}</h5>
          <p>Year: ${movie.year}</p>
        </div>
      </div>`
    ).join('\n');
  
    return `
      <div id="top-15-rating" class="carousel slide" data-ride="carousel">
        <div class="carousel-indicators">
          ${carouselIndicators}
        </div>
        <div class="carousel-inner">
          ${carouselItems}
        </div>
        <button class="carousel-control-prev carousel-btn" type="button" data-bs-target="#top-15-rating" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next carousel-btn" type="button" data-bs-target="#top-15-rating" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
      </div>`;
  }
  
module.exports = generateMovieCarousel;
  