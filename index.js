// app.js (or index.js)
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const HttpError = require('./models/http-error')
const movieRoute = require('./routes/movie')
const templateEngine = require('./templateEngine');



const app = express();
const PORT = 3000;

// Register custom template engine
app.engine('html', templateEngine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(express.static('./public'));
app.use(bodyParser.json());

app.use(movieRoute);

app.get('/', (req, res) => {
  const context = {
    X: "HELLO",
    Y: 1,
    Z: 1,
    arr: [
       {c:1,list : {board :[1,2,3,4,5]}} ,
       {list : {board :[1,2,3,4,7,9]}}
    ],
  };

  res.render('condition', context);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
