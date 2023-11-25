// app.js (or index.js)
const path = require('path');
const express = require('express');
const templateEngine = require('./templateEngine');

const app = express();
const PORT = 3000;

// Register custom template engine
app.engine('html', templateEngine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/', (req, res) => {
  const context = { x: true , Y : true}; // Change the value of x here

  res.render('condition', context);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
