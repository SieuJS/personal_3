module.exports = function template ({content}) {
    return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <header class="text-white text-center py-4 d-flex justify-content-between">
      <h1>21120321</h1>
      <h1>Movie Website</h1>
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="mode-toggle" >
        <label class="form-check-label" for="flexSwitchCheckChecked">Dark Mode</label>
      </div>
    </header>
  
    <!-- Navigation Section -->
    <nav class="navbar d-flex justify-content-between">
      <a href="/"><i class="fa-solid fa-house"></i></a>
      <a href="/favorite">21321</a>
      <form class="d-flex" id = "search-movies" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
      
    </nav>

  
    <!-- Footer Section -->
    <footer class="bg-dark text-white text-center py-3 mt-4">
      <p>&copy; 2023 Movie Website. All Rights Reserved.</p>
    </footer>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script>
      const modeToggle = document.getElementById('mode-toggle');
    modeToggle.addEventListener('click', function() {
    
    document.body.classList.toggle('dark-mode');
});
    </script>
  </body>
</html>
    `
}