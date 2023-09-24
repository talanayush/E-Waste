const express = require('express');
const app = express();
const routes = require('./routes'); // Import the route module


app.use(express.static(__dirname + '/public'));
app.use('/', routes); // Use the route module

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});