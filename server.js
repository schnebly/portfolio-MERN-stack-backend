const express = require('express');

// init express server app
const app = express();

// REST routes
app.get('/', (req, res) => res.send('API Running'));

// Define port (5000 for localhost)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));