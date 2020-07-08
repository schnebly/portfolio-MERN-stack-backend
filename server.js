/* 
    Author: James Schnebly
    File: Server.js
    Purpose: Node backend using express to serve API's
*/

// imports
const express = require('express');
const connectDB = require('./config/db');

// init express server app
const app = express();

// connect to db
connectDB();

// Define REST routes
app.get('/', (req, res) => res.send('API Running'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

// Define port (5000 for localhost)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));